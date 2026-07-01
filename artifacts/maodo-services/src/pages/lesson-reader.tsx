import { Link, useParams, useLocation } from "wouter";
import { useGetFormation } from "@workspace/api-client-react";
import type { Lesson } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, CheckCircle, PlayCircle, Image as ImageIcon,
  Loader2, ListChecks, RotateCcw, Trophy, LockKeyhole, ChevronDown,
  ChevronRight, Menu, X, BookOpen, Clock, Star
} from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

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

  // Auto-expand the module containing the current lesson
  useEffect(() => {
    if (!formation) return;
    const map: Record<number, boolean> = {};
    formation.modules.forEach((m) => {
      map[m.id] = m.lessons.some((l) => l.id === lessonId);
    });
    setExpandedModules(map);
  }, [formation, lessonId]);

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
      <div className="flex flex-1 items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement de la leçon…</p>
        </div>
      </div>
    );
  }

  if (!formation || !lesson) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen gap-4 bg-slate-50">
        <BookOpen className="w-12 h-12 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground font-medium">Leçon introuvable.</p>
        <Link href={`/formations/${id}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour à la formation
          </Button>
        </Link>
      </div>
    );
  }

  const currentModule = formation.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
  const youtubeId = lesson.mediaType === "youtube" && lesson.mediaUrl ? getYoutubeId(lesson.mediaUrl) : null;
  const answeredAll = quizzes.length > 0 && Object.keys(quizAnswers).length >= quizzes.length;

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => progressMap[l.id]).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const hasQuiz = quizzes.length > 0;
  const canGoNext = !hasQuiz || done;
  const quizPassed = quizResult !== null && quizResult.score >= Math.ceil(quizResult.total / 2);

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
          {/* Mobile sidebar toggle */}
          <button
            className="sm:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href={`/formations/${formation.id}`}>
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-medium max-w-[180px] truncate">{formation.title}</span>
            </button>
          </Link>

          <span className="hidden sm:block text-muted-foreground/50">/</span>
          <span className="text-sm font-semibold truncate flex-1 hidden sm:block">{lesson.title}</span>

          {/* Progress */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono tabular-nums">{completedCount}/{totalLessons}</span>
            </div>
            {done && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <CheckCircle className="w-3.5 h-3.5" /> Validée
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative">

        {/* ── Sidebar overlay (mobile) ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside className={`
          fixed sm:sticky top-14 z-20 h-[calc(100vh-3.5rem)] w-72 bg-white border-r flex-col overflow-y-auto
          transition-transform duration-300 sm:translate-x-0 sm:flex
          ${sidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden"}
        `}>
          {/* Formation info */}
          <div className="p-4 border-b bg-slate-50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Contenu de la formation</p>
            <h2 className="text-sm font-bold text-foreground leading-snug">{formation.title}</h2>
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{completedCount} / {totalLessons} leçons</span>
                <span className={`font-bold tabular-nums ${progressPct === 100 ? "text-green-600" : "text-primary"}`}>
                  {progressPct === 100 && <Trophy className="w-3 h-3 inline mr-0.5 text-yellow-500" />}
                  {progressPct}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progressPct === 100 ? "bg-green-500" : "bg-primary"}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Modules list */}
          <div className="flex-1 py-2">
            {formation.modules.map((mod, modIdx) => {
              const modCompleted = mod.lessons.filter((l) => progressMap[l.id]).length;
              const isOpen = expandedModules[mod.id] ?? false;
              return (
                <div key={mod.id} className="border-b last:border-0">
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {modIdx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">{mod.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{modCompleted}/{mod.lessons.length} leçons</p>
                    </div>
                    {isOpen
                      ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="pb-1">
                      {mod.lessons.map((l) => {
                        const isActive = l.id === lessonId;
                        const isCompleted = !!progressMap[l.id];
                        return (
                          <Link
                            key={l.id}
                            href={`/formations/${formation.id}/lecon/${l.id}`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className={`flex items-start gap-2.5 px-4 py-2.5 cursor-pointer transition-colors ${
                              isActive
                                ? "bg-primary/8 border-l-2 border-primary"
                                : "hover:bg-slate-50 border-l-2 border-transparent"
                            }`}>
                              <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                isCompleted
                                  ? "bg-green-500"
                                  : isActive
                                  ? "bg-primary"
                                  : "bg-slate-200"
                              }`}>
                                {isCompleted
                                  ? <CheckCircle className="w-3 h-3 text-white" />
                                  : <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                }
                              </div>
                              <p className={`text-xs leading-snug line-clamp-2 ${
                                isActive ? "font-semibold text-primary" : isCompleted ? "text-muted-foreground" : "text-foreground"
                              }`}>
                                {l.title}
                              </p>
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
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">

            {/* Lesson header */}
            <div className="mb-8">
              {currentModule && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                    <BookOpen className="w-3 h-3" /> {currentModule.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Leçon {(currentModule.lessons.findIndex((l) => l.id === lessonId) + 1)} / {currentModule.lessons.length}
                  </span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> Leçon {currentIndex + 1} sur {totalLessons}
                </span>
                {done && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Complétée
                  </span>
                )}
              </div>
            </div>

            {/* Theory */}
            {lesson.theory && (
              <section className="mb-8">
                <div className="prose prose-sm sm:prose max-w-none bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <LessonContent content={lesson.theory} />
                </div>
              </section>
            )}

            {/* Media — YouTube embed */}
            {lesson.mediaType === "youtube" && youtubeId && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <h2 className="font-bold text-sm text-slate-700 uppercase tracking-widest">Vidéo</h2>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-black">
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
              </section>
            )}

            {/* Media — YouTube URL non parsé */}
            {lesson.mediaType === "youtube" && lesson.mediaUrl && !youtubeId && (
              <section className="mb-8">
                <a
                  href={lesson.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
                >
                  <PlayCircle className="w-4 h-4" /> Voir la vidéo →
                </a>
              </section>
            )}

            {/* Media — Image */}
            {lesson.mediaType === "image" && lesson.mediaUrl && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h2 className="font-bold text-sm text-slate-700 uppercase tracking-widest">Illustration</h2>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={lesson.mediaUrl} alt={lesson.title} className="w-full object-contain max-h-[520px]" />
                </div>
              </section>
            )}

            {/* ── Quiz section ── */}
            {quizzes.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center">
                    <ListChecks className="w-4 h-4 text-violet-600" />
                  </div>
                  <h2 className="font-bold text-sm text-slate-700 uppercase tracking-widest">Quiz de validation</h2>
                  {done && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      <CheckCircle className="w-3 h-3" /> Réussi
                    </span>
                  )}
                </div>

                {quizResult ? (
                  /* Results */
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Score banner */}
                    <div className={`px-6 py-6 text-center border-b ${
                      quizPassed ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100" : "bg-gradient-to-br from-red-50 to-rose-50 border-red-100"
                    }`}>
                      <div className={`text-5xl font-extrabold mb-1 ${quizPassed ? "text-green-700" : "text-red-600"}`}>
                        {quizResult.score}<span className="text-2xl font-bold text-muted-foreground">/{quizResult.total}</span>
                      </div>
                      <p className={`text-sm font-semibold ${quizPassed ? "text-green-700" : "text-red-600"}`}>
                        {quizResult.score === quizResult.total
                          ? "🎉 Parfait ! Toutes les bonnes réponses !"
                          : quizPassed
                          ? "👍 Bien joué ! La leçon est débloquée."
                          : "📚 Score insuffisant — réessayez."}
                      </p>
                      {!quizPassed && (
                        <p className="text-xs text-muted-foreground mt-1">Il faut au moins {Math.ceil(quizResult.total / 2)}/{quizResult.total} pour valider.</p>
                      )}
                    </div>

                    {/* Correction */}
                    <div className="p-6 space-y-5">
                      {quizzes.map((q) => {
                        const result = quizResult.results.find((r) => r.quizId === q.id);
                        const selectedId = quizAnswers[q.id];
                        return (
                          <div key={q.id}>
                            <p className="text-sm font-semibold text-foreground mb-2.5">{q.question}</p>
                            <div className="space-y-2">
                              {q.options.map((opt) => {
                                const isCorrect = result?.correctOptionId === opt.id;
                                const isSelected = selectedId === opt.id;
                                return (
                                  <div key={opt.id} className={`flex items-center gap-3 text-sm px-4 py-2.5 rounded-xl border font-medium ${
                                    isCorrect
                                      ? "bg-green-50 border-green-300 text-green-800"
                                      : isSelected && !isCorrect
                                      ? "bg-red-50 border-red-300 text-red-700"
                                      : "border-slate-100 text-slate-400"
                                  }`}>
                                    <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs border font-bold
                                      ${isCorrect ? 'bg-green-500 border-green-500 text-white' : isSelected && !isCorrect ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 text-slate-400'}">
                                      {isCorrect ? "✓" : isSelected ? "✗" : "○"}
                                    </span>
                                    <span>{opt.text}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-6 pb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                        className="w-full gap-2 border-violet-200 text-violet-700 hover:bg-violet-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Réessayer le quiz
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Quiz form */
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100">
                    {quizzes.map((q, qi) => (
                      <div key={q.id} className="p-5 sm:p-6">
                        <p className="text-sm font-bold text-foreground mb-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-extrabold mr-2 shrink-0">
                            {qi + 1}
                          </span>
                          {q.question}
                        </p>
                        <div className="space-y-2.5">
                          {q.options.map((opt) => (
                            <label
                              key={opt.id}
                              className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border-2 transition-all ${
                                quizAnswers[q.id] === opt.id
                                  ? "border-violet-500 bg-violet-50 text-violet-900 font-semibold shadow-sm"
                                  : "border-slate-200 hover:border-violet-300 hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                quizAnswers[q.id] === opt.id ? "border-violet-600 bg-violet-600" : "border-slate-300"
                              }`}>
                                {quizAnswers[q.id] === opt.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <input
                                type="radio"
                                name={`q_${q.id}`}
                                className="sr-only"
                                checked={quizAnswers[q.id] === opt.id}
                                onChange={() => setQuizAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                              />
                              <span className="text-sm">{opt.text}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="p-5 sm:p-6">
                      <Button
                        onClick={submitQuiz}
                        disabled={quizSubmitting || !answeredAll}
                        className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white h-11 font-semibold text-sm"
                      >
                        {quizSubmitting
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Star className="w-4 h-4" />
                        }
                        {quizSubmitting ? "Correction en cours…" : "Valider le quiz"}
                      </Button>
                      {!answeredAll && (
                        <p className="text-xs text-muted-foreground text-center mt-2.5">
                          Répondez à toutes les questions ({Object.keys(quizAnswers).length}/{quizzes.length} réponse{Object.keys(quizAnswers).length > 1 ? "s" : ""})
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Mark as done — only when no quiz */}
            {!done && !hasQuiz && (
              <div className="mb-8">
                <Button
                  onClick={markDone}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  <CheckCircle className="w-4 h-4" /> Marquer comme terminée
                </Button>
              </div>
            )}

            {/* 100% completion banner */}
            {progressPct === 100 && (
              <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border border-amber-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-extrabold text-amber-900">🎓 Formation complétée à 100% !</p>
                  <p className="text-sm text-amber-700 mt-0.5">Félicitations ! Vous avez terminé toutes les leçons. Votre certificat vous attend.</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky navigation footer ── */}
          <div className="sticky bottom-0 bg-white border-t shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">

              {prevLesson ? (
                <Link href={`/formations/${formation.id}/lecon/${prevLesson.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs max-w-[140px] truncate">{prevLesson.title}</span>
                    <span className="sm:hidden text-xs">Précédente</span>
                  </Button>
                </Link>
              ) : (
                <Link href={`/formations/${formation.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs">Sommaire</span>
                  </Button>
                </Link>
              )}

              {/* Center: lesson counter */}
              <span className="text-xs text-muted-foreground font-mono tabular-nums">
                {currentIndex + 1} / {totalLessons}
              </span>

              {nextLesson ? (
                canGoNext ? (
                  <Link href={`/formations/${formation.id}/lecon/${nextLesson.id}`}>
                    <Button size="sm" className="gap-2 font-semibold" onClick={!hasQuiz ? markDone : undefined}>
                      <span className="hidden sm:inline text-xs max-w-[140px] truncate">{nextLesson.title}</span>
                      <span className="sm:hidden text-xs">Suivante</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col items-end gap-0.5">
                    <Button size="sm" disabled className="gap-2 opacity-50">
                      <LockKeyhole className="w-3.5 h-3.5" />
                      <span className="text-xs">Suivante</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                      <LockKeyhole className="w-2.5 h-2.5" /> Validez le quiz
                    </p>
                  </div>
                )
              ) : (
                canGoNext ? (
                  <Link href={`/formations/${formation.id}`}>
                    <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 font-semibold" onClick={!hasQuiz ? markDone : undefined}>
                      <span className="text-xs">Terminer</span>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col items-end gap-0.5">
                    <Button size="sm" disabled className="gap-2 opacity-50">
                      <LockKeyhole className="w-3.5 h-3.5" />
                      <span className="text-xs">Terminer</span>
                    </Button>
                    <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                      <LockKeyhole className="w-2.5 h-2.5" /> Validez le quiz
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
