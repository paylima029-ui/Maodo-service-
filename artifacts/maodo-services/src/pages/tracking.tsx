import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { useGetOrderByReference, getGetOrderByReferenceQueryKey, type Order } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice, WHATSAPP_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, Clock, CheckCircle, FileText, Check,
  MessageCircle, ArrowLeft, XCircle, AlertCircle, RefreshCw,
  Info, Printer, Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function PaymentReceipt({ order }: { order: Order }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=400,height=650");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Reçu — ${order.reference}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: white; padding: 24px; color: #111; }
            .receipt { max-width: 360px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: white; padding: 24px; text-align: center; }
            .header h1 { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
            .header p { font-size: 12px; opacity: 0.8; }
            .check { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; }
            .amount-box { background: #f0fdf4; border-bottom: 2px dashed #d1d5db; padding: 20px; text-align: center; }
            .amount-box .label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
            .amount-box .amount { font-size: 32px; font-weight: 800; color: #16a34a; margin: 4px 0; }
            .rows { padding: 16px 20px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
            .row:last-child { border-bottom: none; }
            .row .k { color: #6b7280; }
            .row .v { font-weight: 600; text-align: right; max-width: 60%; }
            .ref { background: #f9fafb; border-radius: 8px; padding: 12px 16px; margin: 0 16px 16px; text-align: center; font-family: monospace; font-size: 13px; color: #374151; letter-spacing: 0.05em; border: 1px dashed #d1d5db; }
            .footer { padding: 12px 16px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const paymentMethodLabel: Record<string, string> = {
    WAVE: "Wave",
    ORANGE_MONEY: "Orange Money",
    FREE_MONEY: "Free Money",
    EXPRESSO: "Expresso Money",
  };

  const paidDate = order.updatedAt
    ? new Date(order.updatedAt).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : new Date(order.createdAt).toLocaleDateString("fr-FR");

  return (
    <div className="px-4 py-4 bg-green-50 border-b border-green-200">
      {/* Reçu imprimable */}
      <div
        ref={receiptRef}
        className="receipt max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5 text-center text-white"
          style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)" }}
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-base font-extrabold">Paiement confirmé</h2>
          <p className="text-blue-100 text-xs mt-1">Maodo Numérique</p>
        </div>

        {/* Montant */}
        <div className="amount-box bg-green-50 px-6 py-5 text-center border-b-2 border-dashed border-gray-200">
          <p className="label text-xs text-gray-500 uppercase tracking-wide">Montant payé</p>
          <p className="amount text-3xl font-black text-green-600 mt-1">{formatPrice(order.servicePrice)}</p>
        </div>

        {/* Lignes de détail */}
        <div className="rows px-5 py-3 space-y-0 divide-y divide-gray-50">
          {[
            { k: "Service", v: order.serviceName },
            { k: "Client", v: order.clientName },
            ...(order.paymentMethod
              ? [{ k: "Moyen de paiement", v: paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod }]
              : []),
            { k: "Date", v: paidDate },
          ].map(({ k, v }) => (
            <div key={k} className="row flex justify-between py-2.5 text-sm">
              <span className="k text-gray-500">{k}</span>
              <span className="v font-semibold text-gray-800 text-right max-w-[60%]">{v}</span>
            </div>
          ))}
        </div>

        {/* Référence */}
        <div className="ref mx-4 mb-4 bg-gray-50 rounded-xl px-4 py-3 text-center border border-dashed border-gray-300">
          <p className="text-xs text-gray-400 mb-1">Référence de commande</p>
          <p className="font-mono font-bold text-gray-700 tracking-wider">{order.reference}</p>
        </div>

        {/* Footer reçu */}
        <div className="footer px-4 pb-4 text-center text-xs text-gray-400">
          Vous recevrez votre document par WhatsApp · Merci pour votre confiance
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4 max-w-sm mx-auto">
        <Button
          variant="outline"
          className="flex-1 gap-2 text-sm"
          onClick={handlePrint}
        >
          <Printer className="w-4 h-4" />
          Imprimer
        </Button>
        <a
          href={WHATSAPP_URL(`Bonjour, voici ma référence de commande payée : ${order.reference}`)}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button className="w-full gap-2 text-sm bg-[#25D366] hover:bg-[#1ebd5b] text-white">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function Tracking({ params }: { params: { reference: string } }) {
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useGetOrderByReference(params.reference);

  const isPending = order?.paymentStatus === "pending";

  useEffect(() => {
    if (!isPending) return;
    const check = async () => {
      try {
        await fetch(`/api/payment/verify/${params.reference}`);
      } catch {
        // ignore network errors, keep trying
      }
      await queryClient.invalidateQueries({
        queryKey: getGetOrderByReferenceQueryKey(params.reference),
      });
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [isPending, params.reference, queryClient]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement...</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 py-16 px-4 text-center">
        <p className="text-muted-foreground">Commande introuvable.</p>
        <Link href="/"><Button variant="outline">Retour à l'accueil</Button></Link>
      </div>
    );
  }

  const steps = [
    { id: "pending", label: "Reçue", icon: FileText },
    { id: "processing", label: "En traitement", icon: Clock },
    { id: "verifying", label: "Vérification", icon: CheckCircle },
    { id: "completed", label: "Livré", icon: CheckCircle2 },
  ];

  let currentStepIndex = 0;
  if (order.status === "processing") currentStepIndex = 1;
  if (order.status === "completed") currentStepIndex = 3;
  if (order.status === "cancelled") currentStepIndex = -1;

  const statusLabel = {
    pending: "En attente",
    processing: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  }[order.status] ?? order.status;

  const statusColor = {
    pending: "bg-orange-100 text-orange-800 border-orange-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }[order.status] ?? "";

  const needsRetry = order.paymentStatus === "failed" || order.paymentStatus === "pending";

  return (
    <div className="flex flex-col flex-1 bg-muted/20">

      {/* ── Reçu complet si paiement confirmé ── */}
      {order.paymentStatus === "paid" && <PaymentReceipt order={order} />}

      {/* ── Bannière + actions si paiement en attente ou échoué ── */}
      {order.paymentStatus === "failed" && (
        <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium">
          <XCircle className="w-4 h-4 shrink-0" />
          Paiement refusé — solde insuffisant ou transaction échouée
        </div>
      )}

      {order.paymentStatus === "pending" && (
        <div className="bg-amber-500 text-white px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium">
          <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
          Vérification du paiement en cours…
        </div>
      )}

      {needsRetry && (
        <div className="border-b bg-white px-4 py-4 flex flex-col gap-3">
          <div className="flex gap-2.5 bg-blue-50 border border-blue-200 rounded-xl p-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800 leading-relaxed">
              <span className="font-semibold">Compte Wave non déplafonné ?</span>{" "}
              Les comptes Wave avec plafond ne peuvent pas payer via DiamanoPay.
              Déplafonnez votre compte dans l'app Wave, ou utilisez{" "}
              <span className="font-semibold">Orange Money / Free Money</span>.
            </div>
          </div>

          {order.paymentStatus === "failed" && (
            <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-800 leading-relaxed">
                Votre paiement n'a pas abouti. Vérifiez votre solde ou essayez avec un autre moyen de paiement.
              </p>
            </div>
          )}

          {order.paymentStatus === "pending" && (
            <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Si votre paiement a été refusé ou annulé, vous pouvez réessayer avec un autre moyen ci-dessous.
              </p>
            </div>
          )}

          <Link href={`/payment/${order.id}`} className="w-full">
            <Button className="w-full font-semibold rounded-xl" size="lg">
              Réessayer le paiement
            </Button>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Suivi de commande</h1>
          </div>
          <Badge className={statusColor} variant="outline">{statusLabel}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="font-mono text-sm text-muted-foreground mb-4">Réf : {order.reference}</div>
              <div className="relative pl-6 space-y-8 mt-6">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-muted" />
                {steps.map((step, idx) => {
                  const isPast = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;
                  const StepIcon = isPast ? Check : step.icon;
                  return (
                    <div key={step.id} className={`relative ${isPast ? "opacity-100" : "opacity-40"}`}>
                      <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-2 bg-background
                        ${isPast ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}
                        ${isCurrent ? "ring-4 ring-primary/20 bg-primary/10" : ""}`}>
                        <StepIcon className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isCurrent ? "text-primary" : ""}`}>{step.label}</h4>
                        {isCurrent && <p className="text-xs text-muted-foreground mt-1">Étape actuelle</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Détails + WhatsApp */}
          <div className="flex flex-col gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-5 space-y-3 text-sm">
                <div className="font-semibold mb-2 border-b pb-2">Détails de la commande</div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-right">{order.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-medium">{formatPrice(order.servicePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-medium">{order.clientName}</span>
                </div>
              </CardContent>
            </Card>

            {order.paymentStatus !== "paid" && (
              <a
                href={WHATSAPP_URL(`Bonjour, je vous contacte à propos de ma commande ${order.reference}`)}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white" size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contacter le support WhatsApp
                </Button>
              </a>
            )}
            <p className="text-center text-xs text-muted-foreground">
              {order.paymentStatus === "paid"
                ? "Vous recevrez votre document par WhatsApp dans les délais indiqués."
                : "Vous recevrez une confirmation par WhatsApp une fois le paiement validé."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
