import { useEffect, useState } from "react";
import { Download, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Platform = "android" | "ios" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as any).standalone === true)
  );
}

const DISMISS_KEY = "pwa_install_dismissed_until";

function isDismissed(): boolean {
  const until = localStorage.getItem(DISMISS_KEY);
  if (!until) return false;
  return Date.now() < Number(until);
}

function dismiss(hours: number) {
  localStorage.setItem(DISMISS_KEY, String(Date.now() + hours * 60 * 60 * 1000));
}

export function InstallPrompt() {
  const [platform] = useState<Platform>(detectPlatform);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (isDismissed()) return;

    if (platform === "ios") {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [platform]);

  const handleInstall = async () => {
    if (platform === "ios") {
      setShowIosHint(true);
      return;
    }
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setInstalling(false);
    if (outcome === "accepted") {
      setShow(false);
    } else {
      dismiss(24);
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleLater = () => {
    dismiss(6);
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      {/* Fond semi-transparent bloquant */}
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />

      {/* Carte d'invite */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[101] px-4 pb-6 pt-2 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:right-auto
                   sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[380px] sm:pb-4"
        role="dialog"
        aria-modal="true"
        aria-label="Installer l'application"
      >
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "white" }}
        >
          {/* Header coloré */}
          <div
            className="px-5 pt-6 pb-4 text-white text-center"
            style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-3 overflow-hidden shadow-lg border-2 border-white/30">
              <img src="/icon-192.png" alt="Maodo Numérique" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-extrabold">Installer Maodo Numérique</h2>
            <p className="text-blue-100 text-xs mt-1">
              Accès rapide depuis votre écran d'accueil
            </p>
          </div>

          {/* Avantages */}
          <div className="px-5 py-4 space-y-2.5">
            {[
              "Lancez l'app en 1 tap, sans navigateur",
              "Commandez et suivez vos documents plus vite",
              "Notifications et accès hors-ligne",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          {/* iOS hint */}
          {showIosHint && (
            <div className="mx-5 mb-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <Share className="w-4 h-4" /> Comment installer sur iPhone / iPad
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Appuyez sur <strong>Partager</strong> <Share className="inline w-3 h-3" /> en bas de Safari</li>
                <li>Faites défiler et appuyez sur <strong>« Sur l'écran d'accueil »</strong> <Plus className="inline w-3 h-3" /></li>
                <li>Appuyez sur <strong>Ajouter</strong> en haut à droite</li>
              </ol>
            </div>
          )}

          {/* Actions */}
          <div className="px-5 pb-5 flex flex-col gap-2.5">
            <Button
              className="w-full font-bold py-3 text-sm"
              style={{ background: "linear-gradient(90deg,#1e3a8a,#2563eb)", color: "white" }}
              onClick={handleInstall}
              disabled={installing}
            >
              <Download className="w-4 h-4 mr-2" />
              {installing ? "Installation…" : platform === "ios" ? "Voir comment installer" : "Installer l'application"}
            </Button>
            <button
              onClick={handleLater}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Pas maintenant (réapparaîtra dans 6h)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
