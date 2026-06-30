import { Link, useParams, useLocation } from "wouter";
import { useGetFormation } from "@workspace/api-client-react";
import type { Lesson } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Loader2,
  PlayCircle,
  Image as ImageIcon,
  CheckCircle,
  LockKeyhole,
  ShoppingCart,
  Award,
  Download,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/constants";
import { generateCertificate } from "@/lib/generate-certificate";

function getProgress(formationId: number): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(`formation_progress_${formationId}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function getSavedName(formationId: number): string {
  return localStorage.getItem(`formation_name_${formationId}`) ?? "";
}

function hasFormationAccess(formationId: number): boolean {
  return localStorage.getItem(`formation_access_${formationId}`) === "1";
}

// ── Paywall ────────────────────────────────────────────────────────────────
function FormationPaywall({ formationId, title, price }: { formationId: number; title: string; price: number }) {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) { toast.error("Nom et téléphone requis"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/formation-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formationId, clientName: name.trim(), clientPhone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erreur lors de la commande"); return; }
      localStorage.setItem(`formation_name_${formationId}`, name.trim());
      setLocation(`/payment/${data.orderId}?formationId=${formationId}`);
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-muted/20">
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          <Link href="/formations">
            <button className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Toutes les formations
            </button>
          </Link>
          <h1 className="text-white font-extrabold text-xl sm:text-2xl mb-1">{title}</h1>
          <p className="text-blue-100 text-sm">Formation payante</p>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-4 py-10">
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <LockKeyhole className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="font-bold text-lg mb-1">Formation payante</h2>
            <p className="text-muted-foreground text-sm mb-3">Achetez un accès pour débloquer tous les modules et leçons.</p>
            <div className="text-3xl font-extrabold text-amber-600">{formatPrice(price)}</div>
          </div>

          <form onSubmit={handleBuy} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pw-name">Votre nom complet</Label>
              <Input id="pw-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Amadou Diallo" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw-phone">Numéro de téléphone (Wave / Orange)</Label>
              <Input id="pw-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: +221 77 000 00 00" required />
            </div>
            <Button type="submit" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {loading ? "Traitement..." : `Acheter l'accès · ${formatPrice(price)}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Paiement sécurisé via Wave ou Orange Money</p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Certificate dialog ──────────────────────────────────────────────────────
function CertificateDialog({
  open,
  onClose,
  defaultName,
  formationTitle,
  formationCategory,
}: {
  open: boolean;
  onClose: () => void;
  defaultName: string;
  formationTitle: string;
  formationCategory: string;
}) {
  const [name, setName] = useState(defaultName);

  const handleGenerate = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Veuillez saisir votre nom"); return; }
    try {
      generateCertificate({ recipientName: trimmed, formationTitle, formationCategory });
      toast.success("Certificat téléchargé !");
      onClose();
    } catch {
      toast.error("Erreur lors de la génération du certificat.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Votre certificat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm font-semibold text-amber-800">Félicitations !</p>
            <p className="text-xs text-amber-700 mt-1">
              Vous avez complété <span className="font-bold">100%</span> de la formation.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cert-name">Nom à afficher sur le certificat</Label>
            <Input
              id="cert-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Amadou Diallo"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleGenerate}>
            <Download className="w-4 h-4" /> Télécharger le PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function FormationDetail() {
  const { id } = useParams<{ id: string }>();
  const formationId = parseInt(id, 10);
  const { data: formation, isLoading } = useGetFormation(formationId);

  const [certOpen, setCertOpen] = useState(false);

  const progress = formation ? getProgress(formationId) : {};
  const allLessons: Lesson[] = formation?.modules.flatMap((m) => m.lessons) ?? [];
  const doneLessons = allLessons.filter((l) => progress[l.id]).length;
  const isComplete = allLessons.length > 0 && doneLessons === allLessons.length;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 gap-4">
        <p className="text-muted-foreground">Formation introuvable.</p>
        <Link href="/formations"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Button></Link>
      </div>
    );
  }

  if (formation.isPaid && !hasFormationAccess(formationId)) {
    return <FormationPaywall formationId={formationId} title={formation.title} price={formation.price!} />;
  }

  return (
    <div className="flex flex-col flex-1 bg-muted/20">

      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          <Link href="/formations">
            <button className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Toutes les formations
            </button>
          </Link>
          <h1 className="text-white font-extrabold text-xl sm:text-2xl mb-1">{formation.title}</h1>
          <p className="text-blue-100 text-sm mb-4">{formation.description}</p>

          {allLessons.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-medium">
                {doneLessons}/{allLessons.length} leçons complétées
              </div>
              <div className="flex-1 max-w-xs bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-yellow-300 h-1.5 rounded-full transition-all"
                  style={{ width: `${(doneLessons / allLessons.length) * 100}%` }}
                />
              </div>
              {isComplete && (
                <button
                  onClick={() => setCertOpen(true)}
                  className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow"
                >
                  <Award className="w-3.5 h-3.5" /> Obtenir mon certificat
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Certificate completion banner */}
      {isComplete && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-900 text-sm">🎉 Félicitations, formation complétée !</p>
              <p className="text-xs text-amber-700 mt-0.5">Vous avez terminé toutes les leçons. Téléchargez votre certificat de réussite.</p>
            </div>
            <Button
              size="sm"
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-white shrink-0"
              onClick={() => setCertOpen(true)}
            >
              <Download className="w-4 h-4" /> Certificat
            </Button>
          </div>
        </div>
      )}

      {/* Modules & Lessons */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {formation.modules.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun module disponible pour cette formation.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {formation.modules.map((module, mi) => (
              <div key={module.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    {mi + 1}
                  </div>
                  <h2 className="font-bold text-base">{module.title}</h2>
                  <span className="text-xs text-muted-foreground ml-1">({module.lessons.length} leçon{module.lessons.length !== 1 ? "s" : ""})</span>
                </div>

                <div className="flex flex-col gap-2 ml-8">
                  {module.lessons.map((lesson, li) => {
                    const done = !!progress[lesson.id];
                    return (
                      <Link key={lesson.id} href={`/formations/${formation.id}/lecon/${lesson.id}`}>
                        <div className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${done ? "bg-green-50 border-green-200" : "bg-card border-border/60 hover:border-primary/30"}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${done ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                            {done ? <CheckCircle className="w-4 h-4" /> : li + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${done ? "text-green-800" : ""}`}>{lesson.title}</p>
                            {lesson.mediaType !== "none" && (
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                {lesson.mediaType === "youtube" ? <PlayCircle className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                {lesson.mediaType === "youtube" ? "Vidéo" : "Image"} incluse
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate dialog */}
      {certOpen && (
        <CertificateDialog
          open={certOpen}
          onClose={() => setCertOpen(false)}
          defaultName={getSavedName(formationId)}
          formationTitle={formation.title}
          formationCategory={formation.category}
        />
      )}
    </div>
  );
}
