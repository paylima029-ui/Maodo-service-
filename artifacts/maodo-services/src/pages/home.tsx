import { Link } from "wouter";
import { formatPrice } from "@/lib/constants";
import { useListServices, useListFormations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock, Loader2, ArrowRight, CheckCircle, Zap,
  MessageCircle, GraduationCap, BookOpen, FileText, Star
} from "lucide-react";
import { VisitorCounter } from "@/components/visitor-counter";

const categoryColor: Record<string, string> = {
  python: "bg-yellow-100 text-yellow-800 border-yellow-200",
  bureautique: "bg-blue-100 text-blue-800 border-blue-200",
  general: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function Home() {
  const { data: services, isLoading } = useListServices();
  const { data: formations = [] } = useListFormations();
  const allServices = services ?? [];

  return (
    <div className="flex flex-col flex-1 gap-0">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #3b82f6 70%, #60a5fa 100%)",
        }}
      >
        {/* Orbs décoratifs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full opacity-10" style={{ width: 400, height: 400, background: "white", top: -120, left: -80 }} />
          <div className="absolute rounded-full opacity-10" style={{ width: 250, height: 250, background: "white", bottom: -80, left: 80 }} />
          <div className="absolute rounded-full opacity-[0.07]" style={{ width: 180, height: 180, background: "white", top: 30, right: 100 }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-14 lg:pb-16">

          {/* Titre + Photo */}
          <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex-1 z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span className="text-yellow-200 text-xs font-semibold tracking-wide uppercase">
                  Plateforme numérique
                </span>
              </div>
              <h1 className="text-white font-extrabold leading-tight text-xl sm:text-3xl lg:text-4xl xl:text-5xl">
                Documents <span className="text-yellow-300">pro</span><br className="hidden sm:block" />
                &amp; Formations <span className="text-yellow-300">en ligne</span>
              </h1>
              <p className="hidden sm:block text-blue-100 text-sm leading-relaxed max-w-md mt-2">
                Commandez vos documents professionnels ou lancez-vous dans une formation — tout sur une seule plateforme.
              </p>
              <div className="mt-3">
                <VisitorCounter />
              </div>
            </div>

            {/* Photo Maodo */}
            <div className="relative flex-shrink-0 z-10 self-end" style={{ width: "90px" }}>
              <div
                className="absolute rounded-full"
                style={{
                  width: "80px", height: "80px",
                  bottom: "0", left: "50%",
                  transform: "translateX(-50%)",
                  background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)",
                  filter: "blur(12px)",
                }}
              />
              <img
                src="/maodo-cutout.png"
                alt="Maodo"
                style={{
                  height: "150px",
                  objectFit: "contain",
                  objectPosition: "bottom",
                  filter: "drop-shadow(-4px 0px 20px rgba(0,0,0,0.4))",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Les deux piliers — cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 z-10 relative">

            {/* Pilier 1 — Services */}
            <div
              className="rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col gap-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#facc15" }}>
                  <FileText className="w-5 h-5 text-blue-900" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm sm:text-base">Services Pro</p>
                  <p className="text-blue-200 text-xs">CV, Lettres, Dossiers</p>
                </div>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Documents livrés sur <strong className="text-white">WhatsApp</strong> en quelques heures. Rapide, simple, professionnel.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {["CV", "Lettre", "Dossier étranger", "Site web"].map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                size="sm"
                className="w-full font-bold rounded-xl gap-1.5 text-sm"
                style={{ background: "#facc15", color: "#1e3a8a", boxShadow: "0 4px 14px rgba(250,204,21,0.4)" }}
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              >
                Voir les services <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Pilier 2 — Formations */}
            <div
              className="rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col gap-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#a855f7" }}>
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm sm:text-base">Formations</p>
                  <p className="text-blue-200 text-xs">Python, Bureautique...</p>
                </div>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Apprenez à votre rythme avec des cours <strong className="text-white">structurés et accessibles</strong> depuis n'importe quel appareil.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {["Python", "Bureautique", "Web", "Divers"].map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/formations">
                <Button
                  size="sm"
                  className="w-full font-bold rounded-xl gap-1.5 text-sm"
                  style={{ background: "#a855f7", color: "#fff", boxShadow: "0 4px 14px rgba(168,85,247,0.4)" }}
                >
                  Voir les formations <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Vague */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 32"
          preserveAspectRatio="none"
          style={{ height: "32px", display: "block" }}
        >
          <path
            d="M0,16 C240,32 480,0 720,16 C960,32 1200,8 1440,16 L1440,32 L0,32 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </section>

      {/* ── Stats rapides ── */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-1 mb-5 max-w-7xl mx-auto w-full">
        <div
          className="grid grid-cols-3 gap-2 rounded-2xl p-3 sm:p-4"
          style={{
            background: "hsl(var(--card))",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid hsl(var(--border))",
          }}
        >
          {[
            { icon: Zap, value: "48h", label: "Délai moyen" },
            { icon: CheckCircle, value: "100%", label: "Satisfaction" },
            { icon: MessageCircle, value: "WhatsApp", label: "Livraison" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-0.5 py-1 sm:py-2">
              <span className="font-extrabold text-primary text-base sm:text-lg">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-[0.65rem] sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section id="services" className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8 py-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#fef9c3" }}>
              <FileText className="w-3.5 h-3.5 text-yellow-700" />
            </div>
            <h2 className="font-bold text-base sm:text-lg tracking-tight">Services Professionnels</h2>
          </div>
          <Link href="/services">
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              Voir tout <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {allServices.map((service) => (
              <Card
                key={service.id}
                className="shadow-sm border-border/50 overflow-hidden flex flex-col"
              >
                {service.imageUrl ? (
                  <div className="h-44 w-full overflow-hidden bg-muted">
                    <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-28 w-full bg-gradient-to-br from-yellow-50 to-blue-50 flex items-center justify-center">
                    <span style={{ fontSize: "2rem" }}>📄</span>
                  </div>
                )}
                <div className="px-4 pt-3 pb-1 flex-1">
                  <p className="font-bold text-sm sm:text-base">{service.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                </div>
                <div className="px-4 pb-2 pt-2">
                  <div className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
                    <span className="font-bold text-primary text-sm">{formatPrice(service.price)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Clock className="w-3 h-3" />
                      {service.delay}
                    </span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Link href={`/order/${service.id}`} className="w-full">
                    <Button className="w-full font-medium text-sm">Commander</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Formations ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#f3e8ff" }}>
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <h2 className="font-bold text-base sm:text-lg tracking-tight">Formations en ligne</h2>
          </div>
          <Link href="/formations">
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              Voir tout <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {formations.length === 0 ? (
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
            style={{ background: "linear-gradient(135deg, #f3e8ff, #ede9fe)" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#a855f7" }}>
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm sm:text-base text-purple-900">Formations bientôt disponibles</p>
              <p className="text-purple-700 text-xs sm:text-sm mt-1">
                Des formations Python, Bureautique et bien d'autres arrivent. Revenez bientôt !
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formations.slice(0, 3).map((formation) => {
              const badgeClass = categoryColor[formation.category] ?? categoryColor.general;
              return (
                <Link key={formation.id} href={`/formations/${formation.id}`}>
                  <Card className="overflow-hidden flex flex-col shadow-sm border-border/50 hover:shadow-md transition-shadow cursor-pointer h-full">
                    {formation.imageUrl ? (
                      <div className="h-36 w-full overflow-hidden bg-muted">
                        <img src={formation.imageUrl} alt={formation.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-28 w-full bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-purple-300" />
                      </div>
                    )}
                    <div className="px-4 py-3 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-bold text-sm leading-tight">{formation.title}</p>
                        <Badge variant="outline" className={`text-xs shrink-0 capitalize ${badgeClass}`}>
                          {formation.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{formation.description}</p>
                    </div>
                    <div className="px-4 pb-3">
                      <div className="flex items-center gap-1.5 text-xs text-purple-600 font-medium">
                        <BookOpen className="w-3.5 h-3.5" /> Accéder à la formation
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA bas de page ── */}
      <section className="mt-2 mb-20 sm:mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
        >
          <h3 className="font-bold text-lg sm:text-xl mb-2">Prêt à commencer ?</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            Commandez un document professionnel ou lancez-vous dans une formation dès aujourd'hui.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              className="rounded-full px-6 font-semibold gap-2"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              <FileText className="w-4 h-4" /> Nos services
            </Button>
            <Link href="/formations">
              <Button
                variant="outline"
                className="rounded-full px-6 font-semibold gap-2"
                style={{ borderColor: "#a855f7", color: "#7c3aed" }}
              >
                <GraduationCap className="w-4 h-4" /> Nos formations
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
