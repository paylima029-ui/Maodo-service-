import { Link } from "wouter";
import { useListFormations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, GraduationCap, Monitor } from "lucide-react";

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

export default function Formations() {
  const { data: formations = [], isLoading } = useListFormations();

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
          <p className="text-blue-100 text-sm max-w-lg">
            Des formations pratiques avec des leçons écrites, vidéos et exercices pour maîtriser Python, la bureautique et plus encore.
          </p>
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
              return (
                <Card key={formation.id} className="overflow-hidden flex flex-col shadow-sm border-border/50 hover:shadow-md transition-shadow">
                  {formation.imageUrl ? (
                    <div className="h-40 w-full overflow-hidden bg-muted">
                      <img src={formation.imageUrl} alt={formation.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Icon />
                    </div>
                  )}
                  <div className="px-4 pt-4 pb-1 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base leading-tight">{formation.title}</h3>
                      <Badge variant="outline" className={`text-xs shrink-0 capitalize ${badgeClass}`}>
                        {formation.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{formation.description}</p>
                  </div>
                  <div className="px-4 pb-4 pt-3">
                    <Link href={`/formations/${formation.id}`} className="w-full">
                      <Button className="w-full gap-2">
                        <BookOpen className="w-4 h-4" /> Accéder à la formation
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
