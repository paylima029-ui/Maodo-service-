import { Link, useParams, useLocation } from "wouter";
import { useGetFormation } from "@workspace/api-client-react";
import type { Lesson } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, PlayCircle, Image as ImageIcon, BookOpen, Loader2, ListChecks, RotateCcw, Trophy } from "lucide-react";
import { LessonContent } from "@/components/lesson-content";
import { useEffect, useState } from "react";

function getProgress(formationId: number): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(`formation_progress_${formationId}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveProgress(formationId: number, lessonId: number) {
  const progress = getProgress(formationId);
  progress[lessonId] = true;
  localStorage.setItem(`formation_progress_${formationId}`, JSON.stringify(progress));
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? match[1] : null;
}

type QuizOption = { id: number; text: string; order: number };
type QuizQuestion = { id: number; question: string; order: number; options: QuizOption[] };
type QuizResult = {
  score: number;
  total: number;
  results: { quizId: number; correct: boolean; correctOptionId: number | null }[];
};

export default function LessonReader() {
  const { id, leconId } = useParams<{ id: string; leconId: string }>();
  const [, navigate] = useLocation();
  const formationId = parseInt(id, 10);
  const lessonId = parseInt(leconId, 10);
  const { data: formation, isLoading } = useGetFormation(formationId);

  const allLessons: Lesson[] = formation?.modules.flatMap((m) => m.lessons) ?? [];
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[currentIndex] ?? null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const [done, setDone] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});

  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  useEffect(() => {
    if (lessonId) {
      const progress = getProgress(formationId);
      setProgressMap(progress);
      setDone(!!progress[lessonId]);
    }
  }, [formationId, lessonId]);

  useEffect(() => {
    if (!lessonId) return;
    setQuizzes([]);
    setQuizAnswers({});
    setQuizResult(null);
    fetch(`/api/lessons/${lessonId}/quizzes`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setQuizzes)
      .catch(() => {});
  }, [lessonId]);

  const markDone = () => {
    saveProgress(formationId, lessonId);
    const updated = getProgress(formationId);
    setProgressMap(updated);
    setDone(true);
  };

  const submitQuiz = async () => {
    setQuizSubmitting(true);
    try {
      const answers = Object.entries(quizAnswers).map(([quizId, optionId]) => ({
        quizId: Number(quizId),
        optionId,
      }));
      const res = await fetch(`/api/lessons/${lessonId}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error();
      const result: QuizResult = await res.json();
      setQuizResult(result);
      if (result.score >= Math.ceil(result.total / 2) && !done) {
        markDone();
      }
    } catch {
      /* silent */
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!formation || !lesson) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 gap-4">
        <p className="text-muted-foreground">Leçon introuvable.</p>
        <Link href={`/formations/${id}`}><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Button></Link>
      </div>
    );
  }

  const currentModule = formation.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
  const lessonNumInModule = (currentModule?.lessons.findIndex((l) => l.id === lessonId) ?? 0) + 1;
  const youtubeId = lesson.mediaType === "youtube" && lesson.mediaUrl ? getYoutubeId(lesson.mediaUrl) : null;
  const answeredAll = quizzes.length > 0 && Object.keys(quizAnswers).length >= quizzes.length;

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => progressMap[l.id]).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col flex-1 bg-background">

      {/* Top bar */}
      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur border-b px-4 sm:px-6 py-0">
        <div className="flex items-center gap-3 py-3">
          <Link href={`/formations/${formation.id}`}>
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{formation.title}</span>
            </button>
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-medium truncate flex-1">{lesson.title}</span>
          <span className="text-xs text-muted-foreground shrink-0 font-mono">
            {currentIndex + 1}/{allLessons.length}
          </span>
          {done && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
              <CheckCircle className="w-3.5 h-3.5" /> Complétée
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="pb-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completedCount > 0 ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {completedCount} leçon{completedCount > 1 ? "s" : ""} terminée{completedCount > 1 ? "s" : ""}
                </span>
              ) : (
                <span>Progression de la formation</span>
              )}
            </span>
            <span className={`font-semibold tabular-nums ${progressPct === 100 ? "text-green-600" : "text-foreground"}`}>
              {progressPct === 100 && <Trophy className="w-3 h-3 inline mr-0.5 text-yellow-500" />}
              {progressPct}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPct === 100
                  ? "bg-green-500"
                  : progressPct >= 50
                  ? "bg-primary"
                  : "bg-primary/70"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">

        {/* Lesson header */}
        <div className="mb-6">
          {currentModule && (
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              {currentModule.title} — Leçon {lessonNumInModule}
            </p>
          )}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{lesson.title}</h1>

          {/* Mini progress chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {formation.modules.map((mod) => {
              const modCompleted = mod.lessons.filter((l) => progressMap[l.id]).length;
              const modTotal = mod.lessons.length;
              const isCurrentMod = mod.lessons.some((l) => l.id === lessonId);
              return (
                <div
                  key={mod.id}
                  title={`${mod.title}: ${modCompleted}/${modTotal}`}
                  className={`h-2 rounded-full transition-all ${
                    modCompleted === modTotal
                      ? "bg-green-500"
                      : isCurrentMod
                      ? "bg-primary"
                      : modCompleted > 0
                      ? "bg-primary/40"
                      : "bg-muted"
                  }`}
                  style={{ width: `${Math.max(16, (modTotal / totalLessons) * 180)}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Theory */}
        {lesson.theory && (
          <div className="mb-6">
            <div className="bg-card border border-border/60 rounded-xl p-5 sm:p-6">
              <LessonContent content={lesson.theory} />
            </div>
          </div>
        )}

        {/* Media — YouTube */}
        {lesson.mediaType === "youtube" && youtubeId && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <PlayCircle className="w-3.5 h-3.5 text-red-600" />
              </div>
              <h2 className="font-semibold text-sm text-red-700 uppercase tracking-wide">Pratique — Vidéo</h2>
            </div>
            <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm bg-black">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Media — YouTube URL direct (non parsé) */}
        {lesson.mediaType === "youtube" && lesson.mediaUrl && !youtubeId && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <PlayCircle className="w-3.5 h-3.5 text-red-600" />
              </div>
              <h2 className="font-semibold text-sm text-red-700 uppercase tracking-wide">Pratique — Vidéo</h2>
            </div>
            <a href={lesson.mediaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
              <PlayCircle className="w-4 h-4" /> Voir la vidéo →
            </a>
          </div>
        )}

        {/* Media — Image */}
        {lesson.mediaType === "image" && lesson.mediaUrl && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <ImageIcon className="w-3.5 h-3.5 text-green-600" />
              </div>
              <h2 className="font-semibold text-sm text-green-700 uppercase tracking-wide">Pratique — Illustration</h2>
            </div>
            <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm">
              <img src={lesson.mediaUrl} alt={lesson.title} className="w-full object-contain max-h-[500px]" />
            </div>
          </div>
        )}

        {/* Quiz section */}
        {quizzes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                <ListChecks className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <h2 className="font-semibold text-sm text-violet-700 uppercase tracking-wide">Quiz de validation</h2>
            </div>

            {quizResult ? (
              /* Results view */
              <div className="bg-card border border-border/60 rounded-xl p-5 space-y-5">
                <div className={`text-center py-4 px-6 rounded-xl border ${
                  quizResult.score === quizResult.total
                    ? "bg-green-50 border-green-200"
                    : quizResult.score >= Math.ceil(quizResult.total / 2)
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <p className={`text-3xl font-extrabold ${
                    quizResult.score === quizResult.total ? "text-green-700"
                    : quizResult.score >= Math.ceil(quizResult.total / 2) ? "text-yellow-700"
                    : "text-red-700"
                  }`}>
                    {quizResult.score}/{quizResult.total}
                  </p>
                  <p className="text-sm font-medium mt-1 text-muted-foreground">
                    {quizResult.score === quizResult.total
                      ? "🎉 Parfait ! Toutes les bonnes réponses !"
                      : quizResult.score >= Math.ceil(quizResult.total / 2)
                      ? "👍 Bien joué ! La leçon est complétée."
                      : "📚 Continuez à réviser et réessayez."}
                  </p>
                </div>

                <div className="space-y-4">
                  {quizzes.map((q) => {
                    const result = quizResult.results.find((r) => r.quizId === q.id);
                    const selectedId = quizAnswers[q.id];
                    return (
                      <div key={q.id} className="space-y-2">
                        <p className="text-sm font-semibold">{q.question}</p>
                        <div className="space-y-1.5">
                          {q.options.map((opt) => {
                            const isCorrect = result?.correctOptionId === opt.id;
                            const isSelected = selectedId === opt.id;
                            return (
                              <div
                                key={opt.id}
                                className={`flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg border ${
                                  isCorrect
                                    ? "bg-green-50 border-green-300 text-green-800 font-medium"
                                    : isSelected && !isCorrect
                                    ? "bg-red-50 border-red-300 text-red-800"
                                    : "border-border/40 text-muted-foreground"
                                }`}
                              >
                                <span className="shrink-0">{isCorrect ? "✓" : isSelected ? "✗" : "○"}</span>
                                <span>{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                  className="w-full gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Réessayer le quiz
                </Button>
              </div>
            ) : (
              /* Quiz form */
              <div className="bg-card border border-border/60 rounded-xl p-5 space-y-6">
                {quizzes.map((q, qi) => (
                  <div key={q.id} className="space-y-3">
                    <p className="text-sm font-semibold">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-all ${
                            quizAnswers[q.id] === opt.id
                              ? "border-violet-400 bg-violet-50 text-violet-900"
                              : "border-border/60 hover:border-border hover:bg-muted/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            className="shrink-0 accent-violet-600"
                            checked={quizAnswers[q.id] === opt.id}
                            onChange={() => setQuizAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                          />
                          <span className="text-sm">{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-2 pt-1">
                  <Button
                    onClick={submitQuiz}
                    disabled={quizSubmitting || !answeredAll}
                    className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {quizSubmitting
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <CheckCircle className="w-4 h-4" />
                    }
                    Soumettre le quiz
                  </Button>
                  {!answeredAll && (
                    <p className="text-xs text-muted-foreground text-center">
                      Répondez à toutes les questions pour valider ({Object.keys(quizAnswers).length}/{quizzes.length})
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mark as done */}
        {!done && (
          <div className="mt-4 mb-6">
            <Button onClick={markDone} variant="outline" className="gap-2 border-green-300 text-green-700 hover:bg-green-50">
              <CheckCircle className="w-4 h-4" /> Marquer comme terminée
            </Button>
          </div>
        )}

        {/* 100% completion banner */}
        {progressPct === 100 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500 shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Formation complétée à 100% !</p>
              <p className="text-xs text-green-600">Félicitations ! Vous avez terminé toutes les leçons.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t mt-6">
          {prevLesson ? (
            <Link href={`/formations/${formation.id}/lecon/${prevLesson.id}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline truncate max-w-[160px]">{prevLesson.title}</span>
                <span className="sm:hidden">Précédente</span>
              </Button>
            </Link>
          ) : (
            <Link href={`/formations/${formation.id}`}>
              <Button variant="ghost" className="gap-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Sommaire
              </Button>
            </Link>
          )}

          {nextLesson ? (
            <Link href={`/formations/${formation.id}/lecon/${nextLesson.id}`}>
              <Button className="gap-2 ml-auto" onClick={markDone}>
                <span className="hidden sm:inline truncate max-w-[160px]">{nextLesson.title}</span>
                <span className="sm:hidden">Suivante</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/formations/${formation.id}`}>
              <Button className="gap-2 ml-auto" onClick={markDone}>
                Terminer <CheckCircle className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
