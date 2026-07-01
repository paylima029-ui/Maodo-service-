import { Link, useParams, useLocation } from "wouter";
import { useGetFormation } from "@workspace/api-client-react";
import type { Lesson } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft, BookOpen, ChevronRight, Loader2, PlayCircle,
  Image as ImageIcon, CheckCircle, LockKeyhole, ShoppingCart,
  Award, Download, GraduationCap, Layers, Play, RotateCcw,
  Clock, ChevronDown, ChevronUp, Trophy, KeyRound,
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

// ── Paywall ─────────────────────────────────────────────────────────────────
function FormationPaywall({ formationId, title, price, description, imageUrl, totalLessons, totalModules }: {
  formationId: number; title: string; price: number;
  description?: string | null; imageUrl?: string | null;
  totalLessons: number; totalModules: number;
}) {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoverPhone, setRecoverPhone] = useState("");
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [showRecover, setShowRecover] = useState(false);
  const [recoverSuccess, setRecoverSuccess] = useState(false);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverPhone.trim()) return;
    setRecoverLoading(true);
    try {
      const res = await fetch("/api/formation-access/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: recoverPhone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Aucune formation trouvée pour ce numéro."); return; }
      const formations: { id: number }[] = data.formations ?? [];
      if (formations.some((f) => f.id === formationId)) {
        localStorage.setItem(`formation_access_${formationId}`, "1");
        setRecoverSuccess(true);
        setTimeout(() => setLocation(`/formations/${formationId}`), 1500);
      } else {
        toast.error("Ce numéro n'a pas acheté cette formation.");
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setRecoverLoading(false);
    }
  };

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
    <div className="flex flex-col flex-1 bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-10">
          <Link href="/formations">
            <button className="flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Toutes les formations
            </button>
          </Link>
          <div className="flex items-start gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
              <LockKeyhole className="w-3 h-3" /> Formation payante
            </span>
          </div>
          <h1 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight mb-3">{title}</h1>
          {description && <p className="text-blue-200 text-sm leading-relaxed max-w-xl mb-6">{description}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-blue-400" /> {totalModules} module{totalModules > 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-400" /> {totalLessons} leçon{totalLessons > 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> Certificat inclus</span>
          </div>
        </div>
      </div>

      {/* Purchase card */}
      <div className="max-w-md mx-auto w-full px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-7 h-7 text-amber-600" />
            </div>
            <p className="text-sm text-slate-600 mb-2">Accès complet à la formation</p>
            <div className="text-4xl font-extrabold text-amber-600">{formatPrice(price)}</div>
            <p className="text-xs text-slate-500 mt-1">Paiement unique · Accès à vie</p>
          </div>

          <form onSubmit={handleBuy} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pw-name" className="text-sm font-semibold">Votre nom complet</Label>
              <Input id="pw-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Amadou Diallo" required className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw-phone" className="text-sm font-semibold">Numéro de téléphone</Label>
              <Input id="pw-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: +221 77 000 00 00" required className="h-11" />
            </div>
            <Button type="submit" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white h-12 font-bold text-base" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {loading ? "Traitement…" : `Acheter l'accès · ${formatPrice(price)}`}
            </Button>
            <p className="text-xs text-center text-slate-500">🔒 Paiement sécurisé via Wave ou Orange Money</p>

            {/* Récupération d'accès */}
            <div className="pt-2 border-t border-slate-100">
              {!showRecover ? (
                <button
                  type="button"
                  onClick={() => setShowRecover(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:underline py-1"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Vous avez déjà acheté cette formation ? Récupérez votre accès
                </button>
              ) : recoverSuccess ? (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Accès restauré ! Redirection…
                </div>
              ) : (
                <form onSubmit={handleRecover} className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium">Nom complet + numéro utilisés lors de l'achat :</p>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom complet (ex: Amadou Diallo)"
                    className="h-9 text-sm"
                    required
                  />
                  <div className="flex gap-2">
                    <Input
                      value={recoverPhone}
                      onChange={(e) => setRecoverPhone(e.target.value)}
                      placeholder="+221 77 000 00 00"
                      className="h-9 text-sm flex-1"
                      required
                    />
                    <Button type="submit" size="sm" variant="outline" disabled={recoverLoading || !recoverPhone.trim() || !name.trim()} className="shrink-0 gap-1">
                      {recoverLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                      OK
                    </Button>
                  </div>
                  <button type="button" onClick={() => setShowRecover(false)} className="text-xs text-muted-foreground hover:underline">
                    Annuler
                  </button>
                </form>
              )}
            </div>
          </form>

          {/* Inclus */}
          <div className="px-6 pb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ce qui est inclus</p>
            <ul className="space-y-1.5">
              {[
                `${totalLessons} leçon${totalLessons > 1 ? "s" : ""} complètes`,
                "Vidéos et exercices pratiques",
                "Certificat de réussite PDF",
                "Accès à vie",
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Certificate dialog ───────────────────────────────────────────────────────
function CertificateDialog({ open, onClose, defaultName, formationId, formationTitle, formationCategory }: {
  open: boolean; onClose: () => void; defaultName: string;
  formationId: number; formationTitle: string; formationCategory: string;
}) {
  const [name, setName] = useState(defaultName);

  const handleGenerate = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Veuillez saisir votre nom"); return; }
    try {
      generateCertificate({ formationId, recipientName: trimmed, formationTitle, formationCategory });
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
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm font-bold text-amber-800">Félicitations !</p>
            <p className="text-xs text-amber-700 mt-1">
              Vous avez complété <span className="font-bold">100%</span> de la formation.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cert-name" className="text-sm font-semibold">Nom à afficher sur le certificat</Label>
            <Input id="cert-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Amadou Diallo" autoFocus className="h-11" />
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

// ── Main component ───────────────────────────────────────────────────────────
export default function FormationDetail() {
  const { id } = useParams<{ id: string }>();
  const formationId = parseInt(id, 10);
  const { data: formation, isLoading } = useGetFormation(formationId);
  const [certOpen, setCertOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  const progress = formation ? getProgress(formationId) : {};
  const allLessons: Lesson[] = formation?.modules.flatMap((m) => m.lessons) ?? [];
  const doneLessons = allLessons.filter((l) => progress[l.id]).length;
  const isComplete = allLessons.length > 0 && doneLessons === allLessons.length;
  const progressPct = allLessons.length > 0 ? Math.round((doneLessons / allLessons.length) * 100) : 0;

  // Find the first incomplete lesson for CTA
  const firstIncomplete = allLessons.find((l) => !progress[l.id]);
  const firstLesson = allLessons[0];
  const ctaLesson = doneLessons > 0 ? firstIncomplete ?? firstLesson : firstLesson;

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement de la formation…</p>
        </div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen gap-4 bg-slate-50">
        <BookOpen className="w-12 h-12 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground font-medium">Formation introuvable.</p>
        <Link href="/formations">
          <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" />Retour</Button>
        </Link>
      </div>
    );
  }

  if (formation.isPaid && !hasFormationAccess(formationId)) {
    return (
      <FormationPaywall
        formationId={formationId}
        title={formation.title}
        price={formation.price!}
        description={formation.description}
        imageUrl={formation.imageUrl}
        totalLessons={allLessons.length}
        totalModules={formation.modules.length}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900">
        {formation.imageUrl && (
          <img src={formation.imageUrl} alt={formation.title} className="absolute inset-0 w-full h-full object-cover opacity-15" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-10">
          <Link href="/formations">
            <button className="flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Toutes les formations
            </button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight mb-3">{formation.title}</h1>
              {formation.description && (
                <p className="text-blue-200 text-sm leading-relaxed max-w-xl mb-6">{formation.description}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-blue-200">
                <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-blue-400" /> {formation.modules.length} module{formation.modules.length > 1 ? "s" : ""}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-400" /> {allLessons.length} leçon{allLessons.length > 1 ? "s" : ""}</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> Certificat inclus</span>
              </div>

              {/* Progress bar */}
              {allLessons.length > 0 && doneLessons > 0 && (
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs text-blue-300">
                    <span>{doneLessons} / {allLessons.length} leçons terminées</span>
                    <span className={`font-bold tabular-nums ${isComplete ? "text-green-400" : "text-white"}`}>
                      {isComplete && <Trophy className="w-3 h-3 inline mr-0.5 text-yellow-400" />}
                      {progressPct}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden max-w-sm">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-green-400" : "bg-yellow-400"}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              {allLessons.length > 0 && ctaLesson && (
                <div className="flex flex-wrap gap-3">
                  <Link href={`/formations/${formation.id}/lecon/${ctaLesson.id}`}>
                    <Button size="lg" className={`gap-2 font-bold shadow-lg ${
                      doneLessons === 0
                        ? "bg-white text-blue-900 hover:bg-blue-50"
                        : isComplete
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-primary hover:bg-primary/90 text-white"
                    }`}>
                      {doneLessons === 0
                        ? <><Play className="w-4 h-4" /> Commencer la formation</>
                        : isComplete
                        ? <><RotateCcw className="w-4 h-4" /> Revoir la formation</>
                        : <><Play className="w-4 h-4" /> Continuer</>
                      }
                    </Button>
                  </Link>
                  {isComplete && (
                    <Button
                      size="lg"
                      className="gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold shadow-lg"
                      onClick={() => setCertOpen(true)}
                    >
                      <Award className="w-4 h-4" /> Mon certificat
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Image card (desktop) */}
            {formation.imageUrl && (
              <div className="hidden sm:block shrink-0 w-52 h-36 rounded-xl overflow-hidden border border-white/20 shadow-xl mt-2">
                <img src={formation.imageUrl} alt={formation.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Completion banner ── */}
      {isComplete && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 pt-5">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-900">🎉 Formation complétée à 100% !</p>
              <p className="text-xs text-amber-700 mt-0.5">Téléchargez votre certificat de réussite personnalisé.</p>
            </div>
            <Button
              size="sm"
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold shrink-0"
              onClick={() => setCertOpen(true)}
            >
              <Download className="w-3.5 h-3.5" /> Certificat
            </Button>
          </div>
        </div>
      )}

      {/* ── Modules & Lessons ── */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">

        {formation.modules.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground font-medium">Aucun module disponible pour cette formation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Contenu de la formation
            </h2>

            {formation.modules.map((module, mi) => {
              const modDone = module.lessons.filter((l) => progress[l.id]).length;
              const modTotal = module.lessons.length;
              const modPct = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;
              const isModComplete = modDone === modTotal && modTotal > 0;
              const isOpen = expandedModules[module.id] ?? true;

              return (
                <div key={module.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm transition-colors ${
                      isModComplete ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                    }`}>
                      {isModComplete ? <CheckCircle className="w-5 h-5" /> : mi + 1}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-sm text-foreground leading-snug">{module.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {modDone}/{modTotal} leçon{modTotal !== 1 ? "s" : ""}
                        </span>
                        {modPct > 0 && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isModComplete ? "bg-green-500" : "bg-primary"}`}
                                style={{ width: `${modPct}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold tabular-nums ${isModComplete ? "text-green-600" : "text-primary"}`}>{modPct}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                  </button>

                  {/* Lessons list */}
                  {isOpen && (
                    <div className="border-t border-slate-100 divide-y divide-slate-50">
                      {module.lessons.map((lesson, li) => {
                        const done = !!progress[lesson.id];
                        return (
                          <Link key={lesson.id} href={`/formations/${formation.id}/lecon/${lesson.id}`}>
                            <div className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 cursor-pointer transition-all group ${
                              done
                                ? "hover:bg-green-50/60"
                                : "hover:bg-slate-50"
                            }`}>
                              {/* Status icon */}
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                                done
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                              }`}>
                                {done ? <CheckCircle className="w-4 h-4" /> : li + 1}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${done ? "text-green-800" : "text-foreground"}`}>
                                  {lesson.title}
                                </p>
                                {lesson.mediaType !== "none" && (
                                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                    {lesson.mediaType === "youtube"
                                      ? <><PlayCircle className="w-3 h-3" /> Vidéo incluse</>
                                      : <><ImageIcon className="w-3 h-3" /> Image incluse</>
                                    }
                                  </p>
                                )}
                              </div>

                              {done && (
                                <span className="hidden sm:block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full shrink-0">
                                  Terminée
                                </span>
                              )}
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary shrink-0 transition-colors" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate dialog */}
      {certOpen && (
        <CertificateDialog
          open={certOpen}
          onClose={() => setCertOpen(false)}
          defaultName={getSavedName(formationId)}
          formationId={formationId}
          formationTitle={formation.title}
          formationCategory={formation.category}
        />
      )}
    </div>
  );
}
