import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, CheckCircle2, XCircle, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const PAYMENT_METHODS = [
  { id: "wave", label: "Wave" },
  { id: "orange", label: "Orange Money" },
];

function WaveLogo({ size = 48 }: { size?: number }) {
  return (
    <img
      src="/wave-logo.jpg"
      alt="Wave"
      width={size}
      height={size}
      style={{ objectFit: "contain", borderRadius: 10 }}
    />
  );
}

function OrangeMoneyLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#FF6600"/>
      <circle cx="24" cy="24" r="13" fill="white"/>
      <circle cx="24" cy="24" r="8" fill="#FF6600"/>
      <text x="24" y="28.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Arial, sans-serif">OM</text>
    </svg>
  );
}

type PaymentState = "idle" | "processing" | "redirect" | "polling" | "success" | "failed";

export default function Payment({ params }: { params: { orderId: string } }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [method, setMethod] = useState("wave");
  const [state, setState] = useState<PaymentState>("idle");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { data: order, isLoading } = useGetOrder(Number(params.orderId));

  const formationId = new URLSearchParams(window.location.search).get("formationId");

  const handleSuccess = () => {
    if (formationId) {
      localStorage.setItem(`formation_access_${formationId}`, "1");
      setTimeout(() => setLocation(`/formations/${formationId}`), 2000);
    } else {
      setTimeout(() => setLocation(`/tracking/${order?.reference}`), 2000);
    }
  };

  useEffect(() => {
    if (state !== "polling" || !transactionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${transactionId}`);
        const data = await res.json();
        if (data.status === "success") {
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(Number(params.orderId)) });
          setState("success");
          handleSuccess();
        } else if (["failed", "cancelled", "expired"].includes(data.status)) {
          clearInterval(interval);
          setState("failed");
        }
      } catch {
        // keep polling
      }
    }, 3000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (state === "polling") setState("failed");
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state, transactionId, params.orderId, order?.reference, queryClient, setLocation]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-muted-foreground">Commande introuvable</div>;
  }

  const handlePayment = async () => {
    setState("processing");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, method }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Le paiement a échoué. Veuillez réessayer.");
        setState("idle");
        return;
      }

      if (data.simulation) {
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(order.id) });
        setState("success");
        setTimeout(() => setLocation(`/tracking/${order.reference}`), 2000);
        return;
      }

      setTransactionId(data.transactionId);

      if (data.paymentUrl) {
        setState("redirect");
        window.location.href = data.paymentUrl;
      } else if (data.qrCode) {
        setQrCode(data.qrCode);
        setState("polling");
      } else {
        setState("polling");
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
      setState("idle");
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Paiement réussi !</h1>
        <p className="text-muted-foreground">Redirection vers votre suivi...</p>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Paiement échoué</h1>
        <p className="text-muted-foreground mb-6">Le paiement n'a pas pu être effectué.</p>
        <Button onClick={() => setState("idle")} className="w-full max-w-xs">
          Réessayer
        </Button>
      </div>
    );
  }

  if (state === "polling") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center">
        {qrCode && (
          <div className="mb-6">
            <div className="w-8 h-8 text-muted-foreground mx-auto mb-3">
              <QrCode className="w-full h-full" />
            </div>
            <img src={qrCode} alt="QR Code de paiement" className="w-48 h-48 mx-auto rounded-lg border" />
          </div>
        )}
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-lg font-semibold mb-2">En attente du paiement...</h2>
        <p className="text-sm text-muted-foreground">
          {qrCode
            ? "Scannez le QR code avec votre application mobile pour payer."
            : "Complétez le paiement dans la fenêtre ouverte."}
        </p>
        <Button variant="ghost" className="mt-6" onClick={() => setState("failed")}>
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pb-24">
      <div className="px-4 py-4 flex items-center gap-3 border-b bg-muted/20">
        <h1 className="text-xl font-bold tracking-tight">Paiement</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Référence</span>
            <span className="font-mono font-medium text-sm">{order.reference}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{order.serviceName}</span>
          </div>
          <div className="flex justify-between items-end mt-4 pt-3 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Total à payer</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(order.servicePrice)}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Choisir votre moyen de paiement</h3>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-sm font-semibold ${
                  method === m.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                {m.id === "wave" ? <WaveLogo size={48} /> : <OrangeMoneyLogo size={48} />}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Paiement sécurisé via DiamanoPay</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t max-w-[390px] mx-auto z-10 pb-[env(safe-area-inset-bottom,16px)]">
        <Button
          className="w-full"
          size="lg"
          disabled={state === "processing"}
          onClick={handlePayment}
        >
          {state === "processing" ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Traitement...</>
          ) : (
            `Payer ${formatPrice(order.servicePrice)}`
          )}
        </Button>
      </div>
    </div>
  );
}
