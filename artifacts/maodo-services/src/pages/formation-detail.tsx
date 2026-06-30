import { Link, useParams } from "wouter";
import { useGetFormation } from "@workspace/api-client-react";
import type { Lesson } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, ChevronRight, Loader2, PlayCircle, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useEffect } from "react";

function getProgress(formationId: number): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(`formation_progress_${formationId}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export default function FormationDetail() {
  const { id } = useParams<{ id: string }>();
  const formationId = parseInt(id, 10);
  const { data: formation, isLoading } = useGetFormation(formationId);

  const progress = formation ? getProgress(formationId) : {};
  const allLessons: Lesson[] = formation?.modules.flatMap((m) => m.lessons) ?? [];
  const doneLessons = allLessons.filter((l) => progress[l.id]).length;

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

  return (
    <div className="flex flex-col flex-1 bg-muted/20">

      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          <Link href="/formations">
            <button className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Toutes les formations
            </button>
          </Link>
          <h1 className="text-white font-extrabold text-xl sm:text-2xl mb-1">{formation.title}</h1>
          <p className="text-blue-100 text-sm mb-4">{formation.description}</p>

          {allLessons.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-medium">
                {doneLessons}/{allLessons.length} leçons complétées
              </div>
              <div className="flex-1 max-w-xs bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-yellow-300 h-1.5 rounded-full transition-all"
                  style={{ width: `${allLessons.length > 0 ? (doneLessons / allLessons.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}
