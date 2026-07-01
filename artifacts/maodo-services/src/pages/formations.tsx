import { Link } from "wouter";
import { useListFormations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { BookOpen, Loader2, GraduationCap, Monitor, ShoppingCart, KeyRound, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";

const categoryIcon: Record<string, React.ElementType> = {
  python: () => <span className="text-2xl">🐍</span>,
  bureautique: () => <span className="text-2xl">💻</span>,
  general: BookOpen,
};

const categoryColor: Record<string, string> = {
  python: "bg-yellow-100 text-yellow-800 border-yellow-200",
  bureautique: "bg-blue-100 text-blue-800 border-blue-200",
  general: "bg-gray-100 text-gray-700 border-gray-200",
};

// ── Dialog de récupération d'accès ──────────────────────────────────────────
function RecoverAccessDialog({ open, onClose, onRecovered }: {
  open: boolean;
  onClose: () => void;
  onRecovered: (count: number) => void;
}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovered, setRecovered] = useState<{ id: number; title: string }[]>([]);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/formation-access/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Aucune formation trouvée pour ce numéro.");
        return;
      }
      const formations: { id: number; title: string }[] = data.formations ?? [];
      formations.forEach((f) => {
        localStorage.setItem(`formation_access_${f.id}`, "1");
      });
      setRecovered(formations);
      onRecovered(formations.length);
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setRecovered([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" /> Récupérer mon accès
          </DialogTitle>
        </DialogHeader>

        {recovered.length > 0 ? (
          <div className="space-y-4 py-2">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-bold text-green-800">Accès restauré !</p>
              <p className="text-xs text-green-700 mt-1">
                {recovered.length} formation{recovered.length > 1 ? "s" : ""} débloquée{recovered.length > 1 ? "s" : ""}.
              </p>
            </div>
            <ul className="space-y-2">
              {recovered.map((f) => (
                <li key={f.id} className="flex items-center gap-2 text-sm bg-muted/40 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="font-medium">{f.title}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground text-center">
              Vous pouvez maintenant accéder à vos formations depuis cet appareil.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p>Entrez le nom complet et le numéro utilisés lors de votre achat pour retrouver vos formations.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recover-name" className="text-sm font-semibold">Nom complet utilisé lors de l'achat</Label>
              <Input
                id="recover-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Amadou Diallo"
                required
                className="h-11"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recover-phone" className="text-sm font-semibold">Numéro de téléphone</Label>
              <Input
                id="recover-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +221 77 000 00 00"
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full gap-2 h-11" disabled={loading || !phone.trim() || !name.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {loading ? "Vérification en cours…" : "Récupérer mon accès"}
            </Button>
          </form>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} className="w-full">
            {recovered.length > 0 ? "Fermer" : "Annuler"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page principale ─────────────────────────────────────────────────────────
export default function Formations() {
  const { data: formations = [], isLoading, refetch } = useListFormations();
  const [recoverOpen, setRecoverOpen] = useState(false);

  const handleRecovered = (count: number) => {
    if (count > 0) refetch();
  };

  return (
    <div className="flex flex-col flex-1 bg-muted/20">

      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Formations en ligne</span>
          </div>
          <h1 className="text-white font-extrabold text-2xl sm:text-3xl mb-2">
            Apprenez à votre rythme
          </h1>
          <p className="text-blue-100 text-sm max-w-lg mb-5">
            Des formations pratiques avec des leçons écrites, vidéos et exercices pour maîtriser Python, la bureautique et plus encore.
          </p>
          {/* Bouton récupération d'accès */}
          <button
            onClick={() => setRecoverOpen(true)}
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" /> Récupérer mon accès
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : formations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Aucune formation disponible</h3>
            <p className="text-muted-foreground text-sm">Les formations seront bientôt disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {formations.map((formation) => {
              const Icon = categoryIcon[formation.category] ?? Monitor;
              const badgeClass = categoryColor[formation.category] ?? categoryColor.general;
              const isPaid = formation.isPaid;
              const hasAccess = !isPaid || localStorage.getItem(`formation_access_${formation.id}`) === "1";
              return (
                <Card key={formation.id} className="overflow-hidden flex flex-col shadow-sm border-border/50 hover:shadow-md transition-shadow">
                  {formation.imageUrl ? (
                    <div className="h-40 w-full overflow-hidden bg-muted relative">
                      <img src={formation.imageUrl} alt={formation.title} className="w-full h-full object-cover" />
                      {isPaid && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-amber-500 text-white border-0 text-xs font-bold shadow">
                            {hasAccess ? "✓ Accès accordé" : formatPrice(formation.price!)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                      <Icon />
                      {isPaid && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-amber-500 text-white border-0 text-xs font-bold shadow">
                            {hasAccess ? "✓ Accès accordé" : formatPrice(formation.price!)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="px-4 pt-4 pb-1 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base leading-tight">{formation.title}</h3>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant="outline" className={`text-xs capitalize ${badgeClass}`}>
                          {formation.category}
                        </Badge>
                        {!isPaid && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Gratuit
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{formation.description}</p>
                  </div>
                  <div className="px-4 pb-4 pt-3">
                    <Link href={`/formations/${formation.id}`} className="w-full">
                      {isPaid && !hasAccess ? (
                        <Button className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white">
                          <ShoppingCart className="w-4 h-4" /> Acheter • {formatPrice(formation.price!)}
                        </Button>
                      ) : (
                        <Button className="w-full gap-2">
                          <BookOpen className="w-4 h-4" /> Accéder à la formation
                        </Button>
                      )}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <RecoverAccessDialog
        open={recoverOpen}
        onClose={() => setRecoverOpen(false)}
        onRecovered={handleRecovered}
      />
    </div>
  );
}
