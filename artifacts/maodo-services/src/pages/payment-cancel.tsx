import { useLocation, useSearch } from "wouter";
import { XCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const reference = params.get("reference") ?? params.get("ref") ?? "";

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 text-center min-h-[60vh] animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <XCircle className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold mb-2 text-red-700">Paiement annulé</h1>
      {reference && (
        <p className="text-sm text-muted-foreground mb-2 font-mono">Réf. {reference}</p>
      )}
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Le paiement a été annulé ou a échoué. Vous pouvez réessayer depuis le suivi de commande.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {reference && (
          <Button onClick={() => setLocation(`/tracking/${reference}`)}>
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
