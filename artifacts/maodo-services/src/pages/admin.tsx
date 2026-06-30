import { useState, useRef, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  useListOrders, useUpdateOrderStatus,
  getListOrdersQueryKey, getGetOrderQueryKey,
  useCreateService, useUpdateService, useDeleteService,
  useDeleteOrder, useClearOrderHistory,
  useGetVisitStats, useGetTodayVisits,
} from "@workspace/api-client-react";
import type { Service, Order, Formation, Module, Lesson } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronDown, Phone, Mail, FileText, Download, Plus, Pencil, Trash2, LogOut, ImagePlus, X, LayoutDashboard, Package, ShoppingBag, BarChart2, Users, TrendingUp, GraduationCap, BookOpen, Video, Image as ImageIcon, ChevronRight, ChevronDown as ChevDown, ListChecks, Loader2, Eye, Code2, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { LessonContent, SyntaxGuide } from "@/components/lesson-content";
import { toast } from "sonner";
import { useLocation } from "wouter";

const ICON_OPTIONS = [
  "FileText", "Mail", "CheckCircle", "GraduationCap", "Globe",
  "Briefcase", "Star", "Code", "BookOpen", "Clipboard",
];

type ServiceForm = {
  id: string; name: string; description: string;
  price: string; delay: string; icon: string; active: boolean;
};

const emptyForm: ServiceForm = { id: "", name: "", description: "", price: "", delay: "", icon: "FileText", active: true };

type TabKey = "nouvelles" | "en-cours" | "terminees" | "services" | "stats" | "formations";

async function uploadServiceImage(serviceId: string, file: File): Promise<Service> {
  const formData = new FormData();
  formData.append("image", file);
  const token = localStorage.getItem("maodo_admin_token");
  const res = await fetch(`/api/admin/services/${serviceId}/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Erreur lors de l'upload de l'image");
  }
  return res.json();
}

async function deleteServiceImage(serviceId: string): Promise<void> {
  const token = localStorage.getItem("maodo_admin_token");
  const res = await fetch(`/api/admin/services/${serviceId}/image`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Erreur lors de la suppression de l'image");
  }
}

export default function Admin() {
  const [tab, setTab] = useState<TabKey>("nouvelles");
  const [, navigate] = useLocation();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const statusFilter = tab === "nouvelles" ? "pending" : tab === "en-cours" ? "processing" : tab === "terminees" ? "completed" : undefined;
  const { data: orders = [], isLoading } = useListOrders({ status: statusFilter });
  const updateStatus = useUpdateOrderStatus();

  const { data: allServices = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const res = await fetch("/api/admin/services", {
        headers: { Authorization: `Bearer ${localStorage.getItem("maodo_admin_token")}` },
      });
      if (!res.ok) throw new Error("Erreur de chargement");
      return res.json();
    },
  });

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const deleteOrder = useDeleteOrder();
  const clearHistory = useClearOrderHistory();

  const [deleteOrderDialog, setDeleteOrderDialog] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [clearHistoryDialog, setClearHistoryDialog] = useState(false);

  const handleDeleteOrder = async () => {
    if (!deleteOrderDialog.order) return;
    try {
      await deleteOrder.mutateAsync({ id: deleteOrderDialog.order.id });
      toast.success("Commande supprimée");
      queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      setDeleteOrderDialog({ open: false, order: null });
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleClearHistory = async () => {
    try {
      const result = await clearHistory.mutateAsync({
        params: statusFilter ? { status: statusFilter as any } : {},
      });
      toast.success(`${result.deleted} commande(s) supprimée(s)`);
      queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      setClearHistoryDialog(false);
    } catch {
      toast.error("Erreur lors de la suppression de l'historique");
    }
  };

  const [serviceDialog, setServiceDialog] = useState<{ open: boolean; editing: Service | null }>({ open: false, editing: null });
  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyForm);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; service: Service | null }>({ open: false, service: null });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setServiceForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setServiceDialog({ open: true, editing: null });
  };

  const openEdit = (service: Service) => {
    setServiceForm({
      id: service.id,
      name: service.name,
      description: service.description,
      price: String(service.price),
      delay: service.delay,
      icon: service.icon,
      active: service.active,
    });
    setImageFile(null);
    setImagePreview(service.imageUrl ?? null);
    setRemoveExistingImage(false);
    setServiceDialog({ open: true, editing: service });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);
  };

  const clearImage = () => {
    if (imageFile) {
      // Annule la sélection d'un nouveau fichier, restaure l'image existante
      setImageFile(null);
      setImagePreview(serviceDialog.editing?.imageUrl ?? null);
    } else {
      // Supprime l'image existante en base
      setImagePreview(null);
      setRemoveExistingImage(true);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(serviceForm.price, 10);
    if (isNaN(price) || price < 0) { toast.error("Prix invalide"); return; }
    try {
      let savedService: Service;
      if (serviceDialog.editing) {
        savedService = await updateService.mutateAsync({
          id: serviceDialog.editing.id,
          data: { name: serviceForm.name, description: serviceForm.description, price, delay: serviceForm.delay, icon: serviceForm.icon, active: serviceForm.active },
        });
        toast.success("Service mis à jour");
      } else {
        savedService = await createService.mutateAsync({
          data: { id: serviceForm.id, name: serviceForm.name, description: serviceForm.description, price, delay: serviceForm.delay, icon: serviceForm.icon },
        });
        toast.success("Service créé");
      }

      if (removeExistingImage && !imageFile) {
        try {
          await deleteServiceImage(savedService.id);
          toast.success("Photo supprimée");
        } catch (imgErr: any) {
          toast.error(imgErr?.message ?? "Erreur lors de la suppression de la photo");
        }
      } else if (imageFile) {
        try {
          await uploadServiceImage(savedService.id, imageFile);
          toast.success("Photo enregistrée");
        } catch (imgErr: any) {
          toast.error(imgErr?.message ?? "Erreur lors de l'upload de la photo");
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setServiceDialog({ open: false, editing: null });
    } catch (err: any) {
      toast.error(err?.data?.error ?? err?.message ?? "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.service) return;
    try {
      await deleteService.mutateAsync({ id: deleteDialog.service.id });
      toast.success("Service supprimé");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setDeleteDialog({ open: false, service: null });
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status: newStatus as any } });
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(id) });
    } catch { toast.error("Erreur lors de la mise à jour"); }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Nouvelle</Badge>;
      case "processing": return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>;
      case "completed": return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Terminée</Badge>;
      case "cancelled": return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Annulée</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const { data: todayVisits } = useGetTodayVisits();
  const { data: visitStats = [] } = useGetVisitStats();

  const token = localStorage.getItem("maodo_admin_token");
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const { data: adminFormations = [], isLoading: formationsLoading, refetch: refetchFormations } = useQuery<Formation[]>({
    queryKey: ["admin-formations"],
    queryFn: async () => {
      const res = await fetch("/api/admin/formations", { headers: authHeaders });
      if (!res.ok) throw new Error("Erreur chargement formations");
      return res.json();
    },
  });

  type FormationForm = { slug: string; title: string; description: string; category: string; active: boolean };
  const emptyFormationForm: FormationForm = { slug: "", title: "", description: "", category: "general", active: true };
  const [formationDialog, setFormationDialog] = useState<{ open: boolean; editing: Formation | null }>({ open: false, editing: null });
  const [formationForm, setFormationForm] = useState<FormationForm>(emptyFormationForm);
  const [deleteFormationDialog, setDeleteFormationDialog] = useState<{ open: boolean; formation: Formation | null }>({ open: false, formation: null });
  const [formationImageFile, setFormationImageFile] = useState<File | null>(null);
  const [formationImagePreview, setFormationImagePreview] = useState<string | null>(null);
  const formationImageInputRef = useRef<HTMLInputElement>(null);

  const createFormationMut = useMutation({
    mutationFn: async ({ body, imageFile }: { body: FormationForm; imageFile: File | null }) => {
      const res = await fetch("/api/admin/formations", { method: "POST", headers: authHeaders, body: JSON.stringify({ ...body, imageUrl: null }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
      const formation = await res.json();
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await fetch(`/api/admin/formations/${formation.id}/image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      }
      return formation;
    },
    onSuccess: () => { toast.success("Formation créée"); refetchFormations(); setFormationDialog({ open: false, editing: null }); setFormationImageFile(null); setFormationImagePreview(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateFormationMut = useMutation({
    mutationFn: async ({ id, body, imageFile, currentImageUrl }: { id: number; body: FormationForm; imageFile: File | null; currentImageUrl?: string | null }) => {
      const imageUrl = imageFile ? null : (currentImageUrl ?? null);
      const res = await fetch(`/api/admin/formations/${id}`, { method: "PUT", headers: authHeaders, body: JSON.stringify({ ...body, imageUrl }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await fetch(`/api/admin/formations/${id}/image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      }
      return res.json();
    },
    onSuccess: () => { toast.success("Formation mise à jour"); refetchFormations(); setFormationDialog({ open: false, editing: null }); setFormationImageFile(null); setFormationImagePreview(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteFormationMut = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/formations/${id}`, { method: "DELETE", headers: authHeaders });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
    },
    onSuccess: () => { toast.success("Formation supprimée"); refetchFormations(); setDeleteFormationDialog({ open: false, formation: null }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleFormationActiveMut = useMutation({
    mutationFn: async (formation: Formation) => {
      const body = { slug: formation.slug, title: formation.title, description: formation.description, category: formation.category, imageUrl: formation.imageUrl ?? null, active: !formation.active };
      const res = await fetch(`/api/admin/formations/${formation.id}`, { method: "PUT", headers: authHeaders, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
      return res.json();
    },
    onSuccess: (data: Formation) => {
      toast.success(data.active ? "Formation débloquée" : "Formation bloquée");
      refetchFormations();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  type ModuleForm = { title: string; order: number };
  const [moduleDialog, setModuleDialog] = useState<{ open: boolean; formationId: number | null; editing: Module | null }>({ open: false, formationId: null, editing: null });
  const [moduleForm, setModuleForm] = useState<ModuleForm>({ title: "", order: 0 });

  const createModuleMut = useMutation({
    mutationFn: async ({ formationId, body }: { formationId: number; body: ModuleForm }) => {
      const res = await fetch("/api/admin/modules", { method: "POST", headers: authHeaders, body: JSON.stringify({ formationId, ...body }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
      return res.json();
    },
    onSuccess: () => { toast.success("Module créé"); refetchFormations(); setModuleDialog({ open: false, formationId: null, editing: null }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteModuleMut = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/modules/${id}`, { method: "DELETE", headers: authHeaders });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
    },
    onSuccess: () => { toast.success("Module supprimé"); refetchFormations(); },
    onError: (e: Error) => toast.error(e.message),
  });

  type LessonForm = { title: string; theory: string; mediaType: string; mediaUrl: string; order: number };
  const emptyLessonForm: LessonForm = { title: "", theory: "", mediaType: "none", mediaUrl: "", order: 0 };
  const [lessonDialog, setLessonDialog] = useState<{ open: boolean; moduleId: number | null; editing: Lesson | null }>({ open: false, moduleId: null, editing: null });
  const [lessonForm, setLessonForm] = useState<LessonForm>(emptyLessonForm);
  const [lessonTheoryTab, setLessonTheoryTab] = useState<"edit" | "preview">("edit");
  const [lessonImageFile, setLessonImageFile] = useState<File | null>(null);
  const [lessonImagePreview, setLessonImagePreview] = useState<string | null>(null);
  const lessonImageInputRef = useRef<HTMLInputElement>(null);

  const uploadLessonImage = async (lessonId: number, file: File) => {
    const fd = new FormData();
    fd.append("media", file);
    await fetch(`/api/admin/lessons/${lessonId}/media`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
  };

  const createLessonMut = useMutation({
    mutationFn: async ({ moduleId, body, imageFile }: { moduleId: number; body: LessonForm; imageFile: File | null }) => {
      const mediaType = imageFile ? "image" : body.mediaType;
      const mediaUrl = imageFile ? null : (body.mediaUrl || null);
      const res = await fetch("/api/admin/lessons", { method: "POST", headers: authHeaders, body: JSON.stringify({ moduleId, ...body, mediaType, mediaUrl }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
      const lesson = await res.json();
      if (imageFile) await uploadLessonImage(lesson.id, imageFile);
      return lesson;
    },
    onSuccess: () => { toast.success("Leçon créée"); refetchFormations(); setLessonDialog({ open: false, moduleId: null, editing: null }); setLessonImageFile(null); setLessonImagePreview(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateLessonMut = useMutation({
    mutationFn: async ({ id, moduleId, body, imageFile }: { id: number; moduleId: number; body: LessonForm; imageFile: File | null }) => {
      const mediaType = imageFile ? "image" : body.mediaType;
      const mediaUrl = imageFile ? null : (body.mediaUrl || null);
      const res = await fetch(`/api/admin/lessons/${id}`, { method: "PUT", headers: authHeaders, body: JSON.stringify({ moduleId, ...body, mediaType, mediaUrl }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
      if (imageFile) await uploadLessonImage(id, imageFile);
      return res.json();
    },
    onSuccess: () => { toast.success("Leçon mise à jour"); refetchFormations(); setLessonDialog({ open: false, moduleId: null, editing: null }); setLessonImageFile(null); setLessonImagePreview(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteLessonMut = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE", headers: authHeaders });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Erreur"); }
    },
    onSuccess: () => { toast.success("Leçon supprimée"); refetchFormations(); },
    onError: (e: Error) => toast.error(e.message),
  });

  type QuizOptionData = { id: number; text: string; isCorrect: boolean; order: number };
  type QuizQuestionData = { id: number; question: string; order: number; createdAt: string; options: QuizOptionData[] };
  type EditingQ = { id: number | null; question: string; options: { id?: number; text: string; isCorrect: boolean }[] };

  const [quizDialog, setQuizDialog] = useState<{ open: boolean; lessonId: number | null; lessonTitle: string }>({ open: false, lessonId: null, lessonTitle: "" });
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionData[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [editingQ, setEditingQ] = useState<EditingQ | null>(null);
  const [savingQ, setSavingQ] = useState(false);

  const fetchQuizzes = async (lessonId: number) => {
    setQuizLoading(true);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/quizzes`, { headers: authHeaders });
      if (res.ok) setQuizQuestions(await res.json());
      else setQuizQuestions([]);
    } finally {
      setQuizLoading(false);
    }
  };

  const openQuizDialog = (lessonId: number, lessonTitle: string) => {
    setQuizDialog({ open: true, lessonId, lessonTitle });
    setEditingQ(null);
    fetchQuizzes(lessonId);
  };

  const saveQuestion = async () => {
    if (!quizDialog.lessonId || !editingQ) return;
    if (!editingQ.question.trim()) { toast.error("Entrez une question"); return; }
    if (editingQ.options.length < 2) { toast.error("Au moins 2 options requises"); return; }
    if (!editingQ.options.some((o) => o.isCorrect)) { toast.error("Sélectionnez la bonne réponse"); return; }
    if (editingQ.options.some((o) => !o.text.trim())) { toast.error("Toutes les options doivent avoir du texte"); return; }
    setSavingQ(true);
    try {
      let quizId = editingQ.id;
      if (!quizId) {
        const res = await fetch(`/api/admin/lessons/${quizDialog.lessonId}/quizzes`, { method: "POST", headers: authHeaders, body: JSON.stringify({ question: editingQ.question, order: quizQuestions.length }) });
        if (!res.ok) throw new Error("Erreur création question");
        const quiz = await res.json();
        quizId = quiz.id as number;
      } else {
        const existing = quizQuestions.find((q) => q.id === editingQ.id);
        const res = await fetch(`/api/admin/quizzes/${quizId}`, { method: "PUT", headers: authHeaders, body: JSON.stringify({ question: editingQ.question, order: existing?.order ?? 0 }) });
        if (!res.ok) throw new Error("Erreur mise à jour question");
      }
      for (let i = 0; i < editingQ.options.length; i++) {
        const opt = editingQ.options[i];
        if (opt.id) {
          await fetch(`/api/admin/quiz-options/${opt.id}`, { method: "PUT", headers: authHeaders, body: JSON.stringify({ text: opt.text, isCorrect: opt.isCorrect, order: i }) });
        } else {
          await fetch(`/api/admin/quizzes/${quizId}/options`, { method: "POST", headers: authHeaders, body: JSON.stringify({ text: opt.text, isCorrect: opt.isCorrect, order: i }) });
        }
      }
      toast.success(editingQ.id ? "Question mise à jour" : "Question ajoutée");
      setEditingQ(null);
      await fetchQuizzes(quizDialog.lessonId!);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSavingQ(false);
    }
  };

  const deleteQuestion = async (quizId: number) => {
    if (!quizDialog.lessonId) return;
    const res = await fetch(`/api/admin/quizzes/${quizId}`, { method: "DELETE", headers: authHeaders });
    if (res.ok) { toast.success("Question supprimée"); await fetchQuizzes(quizDialog.lessonId); }
    else toast.error("Erreur suppression");
  };

  const deleteOption = async (optionId: number) => {
    if (!quizDialog.lessonId) return;
    const res = await fetch(`/api/admin/quiz-options/${optionId}`, { method: "DELETE", headers: authHeaders });
    if (res.ok) { toast.success("Option supprimée"); await fetchQuizzes(quizDialog.lessonId); }
    else toast.error("Erreur suppression");
  };

  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const toggleModule = (id: number) => setExpandedModules((p) => ({ ...p, [id]: !p[id] }));

  const navItems: { key: TabKey; label: string; icon: React.ElementType; desc: string }[] = [
    { key: "nouvelles", label: "Nouvelles", icon: ShoppingBag, desc: "Commandes en attente" },
    { key: "en-cours", label: "En cours", icon: LayoutDashboard, desc: "Commandes traitées" },
    { key: "terminees", label: "Terminées", icon: ShoppingBag, desc: "Commandes terminées" },
    { key: "services", label: "Services", icon: Package, desc: "Gérer le catalogue" },
    { key: "formations", label: "Formations", icon: GraduationCap, desc: "Cours & leçons" },
    { key: "stats", label: "Statistiques", icon: BarChart2, desc: "Visites & activité" },
  ];

  return (
    <div className="flex flex-col flex-1 bg-muted/20 min-h-screen">
      {/* Top bar */}
      <div className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{auth.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { auth.logout(); navigate("/login"); }}>
            <LogOut className="h-4 w-4 mr-1.5" /> Déconnexion
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

          {/* Sidebar (desktop) / Tabs strip (mobile) */}
          <aside className="w-full lg:w-56 shrink-0">
            {/* Mobile: horizontal scroll strip */}
            <div className="flex lg:hidden gap-1 overflow-x-auto pb-1">
              {navItems.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    tab === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Desktop: vertical nav */}
            <nav className="hidden lg:flex flex-col gap-1">
              {navItems.map(({ key, label, icon: Icon, desc }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors w-full ${
                    tab === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div>
                    <div>{label}</div>
                    <div className={`text-xs font-normal ${tab === key ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{desc}</div>
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* ── Stats tab ── */}
            {tab === "stats" && (
              <div className="flex flex-col gap-6">

                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-blue-600">{todayVisits?.count ?? 0}</p>
                        <p className="text-xs text-muted-foreground font-medium">Visiteurs aujourd'hui</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-green-600">
                          {visitStats.reduce((sum, d) => sum + d.count, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Visites (7 derniers jours)</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <BarChart2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-purple-600">
                          {visitStats.length > 0
                            ? Math.round(visitStats.reduce((s, d) => s + d.count, 0) / visitStats.length)
                            : 0}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Moyenne / jour</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bar chart — 7 derniers jours */}
                <Card className="shadow-sm">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-sm font-semibold">Visites par jour — 7 derniers jours</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-2">
                    {visitStats.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-6">Aucune donnée disponible</p>
                    ) : (() => {
                      const sorted = [...visitStats].sort((a, b) => a.date.localeCompare(b.date));
                      const max = Math.max(...sorted.map(d => d.count), 1);
                      return (
                        <div className="flex items-end gap-2 h-40">
                          {sorted.map((day) => {
                            const pct = Math.max((day.count / max) * 100, 4);
                            const isToday = day.date === new Date().toISOString().split("T")[0];
                            const label = new Date(day.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
                            return (
                              <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                                <span className="text-xs font-semibold text-muted-foreground">{day.count}</span>
                                <div className="w-full flex items-end" style={{ height: "100px" }}>
                                  <div
                                    className={`w-full rounded-t-md transition-all ${isToday ? "bg-blue-500" : "bg-primary/60"}`}
                                    style={{ height: `${pct}%` }}
                                  />
                                </div>
                                <span className={`text-[0.6rem] text-center leading-tight ${isToday ? "text-blue-600 font-bold" : "text-muted-foreground"}`}>
                                  {label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Tableau détaillé */}
                <Card className="shadow-sm">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-sm font-semibold">Détail par jour</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-medium">Date</th>
                          <th className="text-right px-5 py-2.5 text-xs text-muted-foreground font-medium">Visiteurs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...visitStats].sort((a, b) => b.date.localeCompare(a.date)).map((day, i) => {
                          const isToday = day.date === new Date().toISOString().split("T")[0];
                          return (
                            <tr key={day.date} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                              <td className="px-5 py-2.5 font-medium">
                                {new Date(day.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                                {isToday && <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">Aujourd'hui</Badge>}
                              </td>
                              <td className="px-5 py-2.5 text-right font-bold text-primary">{day.count.toLocaleString("fr-FR")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Formations tab ── */}
            {tab === "formations" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium">{adminFormations.length} formation(s)</p>
                  <Button size="sm" onClick={() => { setFormationForm(emptyFormationForm); setFormationDialog({ open: true, editing: null }); }}>
                    <Plus className="h-4 w-4 mr-1" /> Ajouter
                  </Button>
                </div>

                {formationsLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Chargement...</div>
                ) : adminFormations.length === 0 ? (
                  <div className="py-12 text-center bg-card rounded-lg border border-dashed">
                    <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Aucune formation. Créez-en une !</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {adminFormations.map((formation) => (
                      <Card key={formation.id} className="shadow-sm">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <CardTitle className="text-sm font-bold">{formation.title}</CardTitle>
                                <Badge variant="outline" className="text-xs capitalize">{formation.category}</Badge>
                                {!formation.active && <Badge variant="secondary" className="text-xs">Inactif</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{formation.description}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button
                                variant="ghost" size="icon"
                                className={`h-7 w-7 ${formation.active ? "text-green-600 hover:text-orange-600" : "text-red-500 hover:text-green-600"}`}
                                title={formation.active ? "Bloquer l'accès" : "Débloquer l'accès"}
                                disabled={toggleFormationActiveMut.isPending}
                                onClick={() => toggleFormationActiveMut.mutate(formation)}
                              >
                                {formation.active ? <LockKeyholeOpen className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                              </Button>
                              <Button
                                variant="ghost" size="icon" className="h-7 w-7"
                                onClick={() => {
                                  setFormationForm({ slug: formation.slug, title: formation.title, description: formation.description, category: formation.category, active: formation.active });
                                  setFormationImageFile(null);
                                  setFormationImagePreview(formation.imageUrl ?? null);
                                  setFormationDialog({ open: true, editing: formation });
                                }}
                              ><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteFormationDialog({ open: true, formation })}><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modules</p>
                            <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => { setModuleForm({ title: "", order: 0 }); setModuleDialog({ open: true, formationId: formation.id, editing: null }); }}>
                              <Plus className="h-3 w-3 mr-1" /> Module
                            </Button>
                          </div>
                          {(formation as any).modules && (formation as any).modules.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {(formation as any).modules.map((mod: any) => (
                                <div key={mod.id} className="border rounded-lg overflow-hidden">
                                  <div
                                    className="flex items-center justify-between px-3 py-2 bg-muted/40 cursor-pointer"
                                    onClick={() => toggleModule(mod.id)}
                                  >
                                    <div className="flex items-center gap-2">
                                      {expandedModules[mod.id] ? <ChevDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                                      <span className="text-xs font-semibold">{mod.title}</span>
                                      <span className="text-xs text-muted-foreground">({mod.lessons?.length ?? 0} leçon{mod.lessons?.length !== 1 ? "s" : ""})</span>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setLessonForm(emptyLessonForm); setLessonDialog({ open: true, moduleId: mod.id, editing: null }); }}>
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); deleteModuleMut.mutate(mod.id); }}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  {expandedModules[mod.id] && (
                                    <div className="divide-y">
                                      {mod.lessons?.length === 0 && (
                                        <p className="text-xs text-muted-foreground px-3 py-2">Aucune leçon</p>
                                      )}
                                      {mod.lessons?.map((lesson: any) => (
                                        <div key={lesson.id} className="flex items-center gap-2 px-3 py-2">
                                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                          <span className="text-xs flex-1 truncate">{lesson.title}</span>
                                          {lesson.mediaType === "youtube" && <Video className="h-3 w-3 text-red-400" />}
                                          {lesson.mediaType === "image" && <ImageIcon className="h-3 w-3 text-green-400" />}
                                          <Button variant="ghost" size="icon" className="h-6 w-6 text-violet-500" title="Gérer le quiz" onClick={() => openQuizDialog(lesson.id, lesson.title)}>
                                            <ListChecks className="h-3 w-3" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setLessonForm({ title: lesson.title, theory: lesson.theory, mediaType: lesson.mediaType, mediaUrl: lesson.mediaUrl ?? "", order: lesson.order }); setLessonImageFile(null); setLessonImagePreview(lesson.mediaType === "image" && lesson.mediaUrl ? lesson.mediaUrl : null); setLessonDialog({ open: true, moduleId: mod.id, editing: lesson }); }}>
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteLessonMut.mutate(lesson.id)}>
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Aucun module — chargez la formation pour voir ses modules.</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Services tab ── */}
            {tab === "services" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium">{allServices.length} service(s)</p>
                  <Button size="sm" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-1" /> Ajouter
                  </Button>
                </div>

                {servicesLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Chargement...</div>
                ) : allServices.length === 0 ? (
                  <div className="py-12 text-center bg-card rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Aucun service. Créez-en un !</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allServices.map((service) => (
                      <Card key={service.id} className={`shadow-sm overflow-hidden flex flex-col ${!service.active ? "opacity-60" : ""}`}>
                        {service.imageUrl && (
                          <div className="h-36 w-full overflow-hidden bg-muted">
                            <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-semibold flex items-center gap-2 flex-wrap">
                                {service.name}
                                {!service.active && <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500">Inactif</Badge>}
                              </CardTitle>
                              <CardDescription className="text-xs mt-1">{service.description}</CardDescription>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(service)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteDialog({ open: true, service })}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="p-4 pt-1 mt-auto flex justify-between text-sm">
                          <span className="font-bold text-primary">{formatPrice(service.price)}</span>
                          <span className="text-muted-foreground">⏱ {service.delay}</span>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Orders tabs ── */}
            {tab !== "services" && (
              <div>
                {/* Header with clear history button */}
                {orders.length > 0 && !isLoading && (
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setClearHistoryDialog(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Vider l'historique
                    </Button>
                  </div>
                )}
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Chargement...</div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center bg-card rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Aucune commande trouvée</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {orders.map((order: Order) => (
                      <Card key={order.id} className="overflow-hidden shadow-sm">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base font-semibold">{order.clientName}</CardTitle>
                              <CardDescription className="font-mono text-xs mt-1">{order.reference}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {statusBadge(order.status)}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteOrderDialog({ open: true, order })}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 pb-0">
                          <div className="flex justify-between items-end mb-3">
                            <div className="text-sm font-medium">{order.serviceName}</div>
                            <div className="text-sm font-bold text-primary">{formatPrice(order.servicePrice)}</div>
                          </div>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full flex justify-between mb-4">
                                Voir détails <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pb-4 animate-in slide-in-from-top-2">
                              <div className="grid grid-cols-1 gap-2 text-sm bg-muted/50 p-3 rounded-md">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  <a href={`tel:${order.clientPhone}`} className="text-primary hover:underline">{order.clientPhone}</a>
                                </div>
                                {order.clientEmail && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <a href={`mailto:${order.clientEmail}`} className="text-primary hover:underline">{order.clientEmail}</a>
                                  </div>
                                )}
                                <div className="mt-2 pt-2 border-t">
                                  <div className="text-xs text-muted-foreground mb-1">Description</div>
                                  <p className="whitespace-pre-wrap">{order.description}</p>
                                </div>
                                {order.fileName && (
                                  <div className="mt-2 pt-2 border-t flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-xs truncate max-w-[200px]">
                                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                      <span className="truncate">{order.fileName}</span>
                                    </div>
                                    <Button size="sm" variant="secondary" className="h-7 px-2 text-xs" asChild>
                                      <a href={`/api/orders/${order.id}/file`} target="_blank" rel="noreferrer" download={order.fileName ?? true}>
                                        <Download className="w-3 h-3 mr-1" /> Télécharger
                                      </a>
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div className="pt-2">
                                <div className="text-xs text-muted-foreground mb-2">Changer le statut</div>
                                <Select value={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                                  <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">En attente (Nouvelle)</SelectItem>
                                    <SelectItem value="processing">En traitement</SelectItem>
                                    <SelectItem value="completed">Terminée</SelectItem>
                                    <SelectItem value="cancelled">Annulée</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Formation dialog ── */}
      <Dialog open={formationDialog.open} onOpenChange={(o) => !o && setFormationDialog({ open: false, editing: null })}>
        <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formationDialog.editing ? "Modifier la formation" : "Nouvelle formation"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (formationDialog.editing) {
              updateFormationMut.mutate({ id: formationDialog.editing.id, body: formationForm, imageFile: formationImageFile, currentImageUrl: formationDialog.editing.imageUrl });
            } else {
              createFormationMut.mutate({ body: formationForm, imageFile: formationImageFile });
            }
          }} className="space-y-3">
            <div className="space-y-1">
              <Label>Slug (identifiant URL)</Label>
              <Input value={formationForm.slug} onChange={e => setFormationForm(f => ({ ...f, slug: e.target.value }))} placeholder="ex: python-debutant" required />
            </div>
            <div className="space-y-1">
              <Label>Titre</Label>
              <Input value={formationForm.title} onChange={e => setFormationForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input value={formationForm.description} onChange={e => setFormationForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Catégorie</Label>
              <Select value={formationForm.category} onValueChange={v => setFormationForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="bureautique">Bureautique</SelectItem>
                  <SelectItem value="general">Général</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Photo de couverture</Label>
              <input
                ref={formationImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setFormationImageFile(file);
                  setFormationImagePreview(URL.createObjectURL(file));
                }}
              />
              {formationImagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={formationImagePreview} alt="Aperçu" className="w-full h-36 object-cover" />
                  <Button
                    type="button" variant="secondary" size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-90"
                    onClick={() => { setFormationImageFile(null); setFormationImagePreview(null); if (formationImageInputRef.current) formationImageInputRef.current.value = ""; }}
                  ><X className="h-3.5 w-3.5" /></Button>
                  {formationImageFile && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Nouvelle image sélectionnée</div>
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  onClick={() => formationImageInputRef.current?.click()}
                >
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cliquer pour choisir une image</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="fm-active" checked={formationForm.active} onChange={e => setFormationForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
              <Label htmlFor="fm-active">Formation active (visible publiquement)</Label>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => { setFormationDialog({ open: false, editing: null }); setFormationImageFile(null); setFormationImagePreview(null); }}>Annuler</Button>
              <Button type="submit" disabled={createFormationMut.isPending || updateFormationMut.isPending}>
                {formationDialog.editing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete formation dialog ── */}
      <AlertDialog open={deleteFormationDialog.open} onOpenChange={(o) => !o && setDeleteFormationDialog({ open: false, formation: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la formation ?</AlertDialogTitle>
            <AlertDialogDescription>
              La formation <strong>{deleteFormationDialog.formation?.title}</strong> et tous ses modules et leçons seront définitivement supprimés. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteFormationDialog.formation && deleteFormationMut.mutate(deleteFormationDialog.formation.id)} disabled={deleteFormationMut.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Module dialog ── */}
      <Dialog open={moduleDialog.open} onOpenChange={(o) => !o && setModuleDialog({ open: false, formationId: null, editing: null })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nouveau module</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (moduleDialog.formationId) createModuleMut.mutate({ formationId: moduleDialog.formationId, body: moduleForm });
          }} className="space-y-3">
            <div className="space-y-1">
              <Label>Titre du module</Label>
              <Input value={moduleForm.title} onChange={e => setModuleForm(f => ({ ...f, title: e.target.value }))} placeholder="ex: Introduction" required />
            </div>
            <div className="space-y-1">
              <Label>Ordre</Label>
              <Input type="number" min="0" value={moduleForm.order} onChange={e => setModuleForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setModuleDialog({ open: false, formationId: null, editing: null })}>Annuler</Button>
              <Button type="submit" disabled={createModuleMut.isPending}>Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Lesson dialog ── */}
      <Dialog open={lessonDialog.open} onOpenChange={(o) => { if (!o) { setLessonDialog({ open: false, moduleId: null, editing: null }); setLessonImageFile(null); setLessonImagePreview(null); } }}>
        <DialogContent className="max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{lessonDialog.editing ? "Modifier la leçon" : "Nouvelle leçon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (lessonDialog.editing && lessonDialog.moduleId) {
              updateLessonMut.mutate({ id: lessonDialog.editing.id, moduleId: lessonDialog.moduleId, body: lessonForm, imageFile: lessonImageFile });
            } else if (lessonDialog.moduleId) {
              createLessonMut.mutate({ moduleId: lessonDialog.moduleId, body: lessonForm, imageFile: lessonImageFile });
            }
          }} className="space-y-3">
            <div className="space-y-1">
              <Label>Titre</Label>
              <Input value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Théorie (texte de la leçon)</Label>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                value={lessonForm.theory}
                onChange={e => setLessonForm(f => ({ ...f, theory: e.target.value }))}
                placeholder="Contenu de la leçon…"
              />
            </div>
            <div className="space-y-1">
              <Label>Type de média</Label>
              <Select value={lessonForm.mediaType} onValueChange={v => setLessonForm(f => ({ ...f, mediaType: v, mediaUrl: "" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="youtube">Vidéo YouTube</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {lessonForm.mediaType === "youtube" && (
              <div className="space-y-1">
                <Label>URL YouTube</Label>
                <Input value={lessonForm.mediaUrl} onChange={e => setLessonForm(f => ({ ...f, mediaUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
              </div>
            )}
            {lessonForm.mediaType === "image" && (
              <div className="space-y-2">
                <Label>Image de la leçon</Label>
                <input
                  ref={lessonImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setLessonImageFile(file);
                    setLessonImagePreview(URL.createObjectURL(file));
                  }}
                />
                {lessonImagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={lessonImagePreview} alt="Aperçu" className="w-full h-36 object-cover" />
                    <Button
                      type="button" variant="secondary" size="icon"
                      className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-90"
                      onClick={() => { setLessonImageFile(null); setLessonImagePreview(null); if (lessonImageInputRef.current) lessonImageInputRef.current.value = ""; }}
                    ><X className="h-3.5 w-3.5" /></Button>
                  </div>
                ) : (
                  <div
                    className="w-full h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                    onClick={() => lessonImageInputRef.current?.click()}
                  >
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Cliquer pour choisir une image</span>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-1">
              <Label>Ordre</Label>
              <Input type="number" min="0" value={lessonForm.order} onChange={e => setLessonForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setLessonDialog({ open: false, moduleId: null, editing: null })}>Annuler</Button>
              <Button type="submit" disabled={createLessonMut.isPending || updateLessonMut.isPending}>
                {lessonDialog.editing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Service dialog ── */}
      <Dialog open={serviceDialog.open} onOpenChange={(o) => !o && setServiceDialog({ open: false, editing: null })}>
        <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{serviceDialog.editing ? "Modifier le service" : "Ajouter un service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit} className="space-y-3">
            {!serviceDialog.editing && (
              <div className="space-y-1">
                <Label htmlFor="svc-id">Identifiant (ex: cv, site)</Label>
                <Input id="svc-id" value={serviceForm.id} onChange={e => setServiceForm(f => ({ ...f, id: e.target.value }))} placeholder="ex: traduction" required />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="svc-name">Nom</Label>
              <Input id="svc-name" value={serviceForm.name} onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="svc-desc">Description</Label>
              <Input id="svc-desc" value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="svc-price">Prix (FCFA)</Label>
                <Input id="svc-price" type="number" min="0" value={serviceForm.price} onChange={e => setServiceForm(f => ({ ...f, price: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="svc-delay">Délai</Label>
                <Input id="svc-delay" value={serviceForm.delay} onChange={e => setServiceForm(f => ({ ...f, delay: e.target.value }))} placeholder="24h" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Icône</Label>
              <Select value={serviceForm.icon} onValueChange={v => setServiceForm(f => ({ ...f, icon: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Photo du service</Label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={imagePreview} alt="Aperçu" className="w-full h-36 object-cover" />
                  <Button type="button" variant="secondary" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-90" onClick={clearImage}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                  {imageFile && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      Nouvelle photo sélectionnée
                    </div>
                  )}
                </div>
              ) : removeExistingImage ? (
                <div
                  className="w-full h-24 border-2 border-dashed border-destructive/50 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-destructive/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Trash2 className="h-5 w-5 text-destructive/70" />
                  <span className="text-xs text-destructive/80 font-medium">Photo supprimée — cliquer pour en ajouter une</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">Cliquer pour ajouter une photo</span>
                  <span className="text-xs opacity-60">JPG, PNG ou WebP · 2 Mo max</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
            </div>

            {serviceDialog.editing && (
              <div className="space-y-1">
                <Label>Statut</Label>
                <Select value={serviceForm.active ? "active" : "inactive"} onValueChange={v => setServiceForm(f => ({ ...f, active: v === "active" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setServiceDialog({ open: false, editing: null })}>Annuler</Button>
              <Button type="submit" disabled={createService.isPending || updateService.isPending}>
                {serviceDialog.editing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialog.open} onOpenChange={o => !o && setDeleteDialog({ open: false, service: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le service <strong>{deleteDialog.service?.name}</strong> sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete single order confirmation ── */}
      <AlertDialog open={deleteOrderDialog.open} onOpenChange={o => !o && setDeleteOrderDialog({ open: false, order: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette commande ?</AlertDialogTitle>
            <AlertDialogDescription>
              La commande <strong>{deleteOrderDialog.order?.reference}</strong> de{" "}
              <strong>{deleteOrderDialog.order?.clientName}</strong> sera définitivement supprimée. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              disabled={deleteOrder.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Quiz management dialog ── */}
      <Dialog open={quizDialog.open} onOpenChange={(o) => { if (!o) { setQuizDialog({ open: false, lessonId: null, lessonTitle: "" }); setEditingQ(null); } }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-violet-500" />
              Quiz — {quizDialog.lessonTitle}
            </DialogTitle>
          </DialogHeader>

          {quizLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {quizQuestions.length === 0 && !editingQ && (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/40 rounded-lg">Aucune question. Ajoutez-en une ci-dessous.</p>
              )}

              {quizQuestions.map((q, qi) => (
                <div key={q.id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-muted-foreground mt-0.5 shrink-0 min-w-[16px]">{qi + 1}.</span>
                    <span className="text-sm font-medium flex-1">{q.question}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setEditingQ({ id: q.id, question: q.question, options: q.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })) })}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-destructive" onClick={() => deleteQuestion(q.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="pl-4 space-y-1">
                    {q.options.length === 0 && <p className="text-xs text-muted-foreground italic">Aucune option</p>}
                    {q.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <span className={`text-xs flex-1 ${opt.isCorrect ? "text-green-600 font-semibold" : "text-muted-foreground"}`}>
                          {opt.isCorrect ? "✓" : "○"} {opt.text}
                        </span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive shrink-0" onClick={() => deleteOption(opt.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {editingQ ? (
                <div className="border-2 border-violet-300/60 rounded-lg p-4 space-y-3 bg-violet-50/50">
                  <p className="text-sm font-semibold text-violet-800">{editingQ.id ? "Modifier la question" : "Nouvelle question"}</p>
                  <div className="space-y-1">
                    <Label className="text-xs">Question</Label>
                    <Input value={editingQ.question} onChange={(e) => setEditingQ((q) => q ? { ...q, question: e.target.value } : q)} placeholder="Entrez la question..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Options — sélectionnez la bonne réponse</Label>
                    {editingQ.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="quiz-correct"
                          checked={opt.isCorrect}
                          onChange={() => setEditingQ((q) => q ? { ...q, options: q.options.map((o, i) => ({ ...o, isCorrect: i === oi })) } : q)}
                          className="shrink-0 accent-violet-600"
                        />
                        <Input
                          value={opt.text}
                          onChange={(e) => setEditingQ((q) => q ? { ...q, options: q.options.map((o, i) => i === oi ? { ...o, text: e.target.value } : o) } : q)}
                          placeholder={`Option ${oi + 1}...`}
                          className="h-8 text-sm flex-1"
                        />
                        {editingQ.options.length > 2 && !opt.id && (
                          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground" onClick={() => setEditingQ((q) => q ? { ...q, options: q.options.filter((_, i) => i !== oi) } : q)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {editingQ.options.length < 4 && (
                      <Button type="button" variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => setEditingQ((q) => q ? { ...q, options: [...q.options, { text: "", isCorrect: false }] } : q)}>
                        <Plus className="h-3 w-3" /> Ajouter une option
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={saveQuestion} disabled={savingQ} className="gap-1.5">
                      {savingQ ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      Enregistrer
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingQ(null)}>Annuler</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setEditingQ({ id: null, question: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] })}>
                  <Plus className="h-4 w-4" /> Ajouter une question
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Clear history confirmation ── */}
      <AlertDialog open={clearHistoryDialog} onOpenChange={setClearHistoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vider l'historique ?</AlertDialogTitle>
            <AlertDialogDescription>
              {statusFilter
                ? `Toutes les commandes de l'onglet "${tab}" seront définitivement supprimées.`
                : "Toutes les commandes seront définitivement supprimées."}{" "}
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearHistory}
              disabled={clearHistory.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Tout supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
