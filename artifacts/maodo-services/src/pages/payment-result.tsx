import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { CheckCircle2, XCircle, Clock, Loader2, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/constants";

type VerifyStatus = "loading" | "success" | "failed" | "pending" | "error";

interface OrderInfo {
  reference: string;
  servicePrice: number;
  serviceName: string;
}

export default function PaymentResult() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const rawReference = params.get("reference") ?? params.get("ref") ?? "";
  const reference = rawReference.split("?")[0].split("&")[0].trim();
  const transactionId = params.get("transactionId") ?? params.get("transaction_id") ?? params.get("chargeId") ?? "";

  console.log("[PaymentResult] URL params:", { reference, transactionId, search });

  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!reference && !transactionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    async function verify() {
      setStatus("loading");

      await new Promise((r) => setTimeout(r, 1500));
      if (cancelled) return;

      try {
        let resolvedReference = reference;
        let resolvedStatus: string | null = null;

        if (!resolvedReference && transactionId) {
          const statusRes = await fetch(`/api/payment/status/${encodeURIComponent(transactionId)}`, { cache: "no-store" });
          if (!cancelled && statusRes.ok) {
            const statusData = await statusRes.json();
            resolvedStatus = statusData.status;
            resolvedReference = statusData.reference ?? "";
            console.log("[PaymentResult] status by transactionId:", { transactionId, resolvedStatus, resolvedReference });
          }
        }

        if (resolvedReference) {
          try {
            const orderRes = await fetch(`/api/orders/ref/${encodeURIComponent(resolvedReference)}`, { cache: "no-store" });
            if (!cancelled && orderRes.ok) {
              const o = await orderRes.json();
              setOrder({ reference: o.reference, servicePrice: o.servicePrice, serviceName: o.serviceName });
            }
          } catch { }
        }

        if (resolvedStatus) {
          if (cancelled) return;
          const s = resolvedStatus;
          if (s === "paid" || s === "success") setStatus("success");
          else if (s === "failed" || s === "cancelled" || s === "expired") setStatus("failed");
          else setStatus("pending");
          return;
        }

        if (resolvedReference) {
          const verifyRes = await fetch(`/api/payment/verify/${encodeURIComponent(resolvedReference)}`, { cache: "no-store" });
          if (cancelled) return;

          if (!verifyRes.ok && verifyRes.status !== 304) {
            console.error("[PaymentResult] verify error", verifyRes.status);
            setStatus("pending");
            return;
          }

          let data: { paymentStatus?: string } = {};
          try {
            data = await verifyRes.json();
          } catch {
            setStatus("pending");
            return;
          }
          console.log("[PaymentResult] verify response:", { reference: resolvedReference, paymentStatus: data.paymentStatus });

          const s = data.paymentStatus ?? "";
          if (s === "paid" || s === "success") setStatus("success");
          else if (s === "failed" || s === "cancelled" || s === "expired") setStatus("failed");
          else setStatus("pending");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("[PaymentResult] fetch error", err);
        if (!cancelled) setStatus("error");
      }
    }

    verify();
    return () => { cancelled = true; };
  }, [reference, transactionId, retryCount]);

  const activeReference = order?.reference || reference;

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center min-h-[60vh]">
        <Loader2 className="w-14 h-14 text-primary animate-spin mb-6" />
        <h1 className="text-xl font-semibold mb-2">Vérification du paiement…</h1>
        <p className="text-sm text-muted-foreground">
          Nous vérifions le statut de votre paiement. Merci de patienter.
        </p>
        {(reference || transactionId) && (
          <p className="mt-3 text-xs text-muted-foreground font-mono">
            {reference ? `Réf. ${reference}` : `Tx. ${transactionId}`}
          </p>
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center min-h-[60vh] animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-green-700">Paiement réussi !</h1>
        {order && (
          <div className="mt-2 mb-4 bg-green-50 border border-green-200 rounded-xl px-6 py-4 text-sm space-y-1">
            <p className="text-muted-foreground">Service : <span className="font-medium text-foreground">{order.serviceName}</span></p>
            <p className="text-muted-foreground">Montant : <span className="font-semibold text-foreground">{formatPrice(order.servicePrice)}</span></p>
            <p className="text-muted-foreground">Commande : <span className="font-mono font-medium text-foreground">{order.reference}</span></p>
          </div>
        )}
        {!order && activeReference && (
          <p className="text-sm text-muted-foreground mb-4 font-mono">Réf. {activeReference}</p>
        )}
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Votre commande est en cours de traitement. Vous recevrez votre document sur WhatsApp.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {activeReference && (
            <Button onClick={() => setLocation(`/tracking/${activeReference}`)}>
              Suivre ma commande
            </Button>
          )}
          <Button variant="outline" onClick={() => setLocation("/")}>
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center min-h-[60vh] animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-red-700">Paiement échoué</h1>
        {activeReference && (
          <p className="text-sm text-muted-foreground mb-2 font-mono">Réf. {activeReference}</p>
        )}
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Le paiement n'a pas pu être effectué. Vérifiez le solde de votre compte et réessayez.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {activeReference && (
            <Button onClick={() => setLocation(`/tracking/${activeReference}`)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer le paiement
            </Button>
          )}
          <Button variant="outline" onClick={() => setLocation("/")}>
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center min-h-[60vh] animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Clock className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-amber-700">Paiement en attente</h1>
        {activeReference && (
          <p className="text-sm text-muted-foreground mb-2 font-mono">Réf. {activeReference}</p>
        )}
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Votre paiement est en cours de confirmation. Cela peut prendre quelques minutes.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button variant="outline" onClick={() => setRetryCount((c) => c + 1)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Vérifier à nouveau
          </Button>
          {activeReference && (
            <Button variant="ghost" onClick={() => setLocation(`/tracking/${activeReference}`)}>
              Suivre ma commande
            </Button>
          )}
          <Button variant="outline" onClick={() => setLocation("/")}>
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 text-center min-h-[60vh]">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Impossible de vérifier</h1>
      {activeReference && (
        <p className="text-sm text-muted-foreground mb-2 font-mono">Réf. {activeReference}</p>
      )}
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Une erreur est survenue lors de la vérification. Consultez le suivi de commande ou contactez le support.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {activeReference && (
          <Button onClick={() => setLocation(`/tracking/${activeReference}`)}>
            Suivi de commande
          </Button>
        )}
        <Button variant="outline" onClick={() => setLocation("/")}>
          <Home className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
