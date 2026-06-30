import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, ApiError } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, AlertCircle, WifiOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const auth = useAuth();
  const loginMutation = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const result = await loginMutation.mutateAsync({ data: { email: email.trim(), password } });
      auth.login(result.token, result.email);
      toast.success("Connexion réussie");
      navigate("/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setErrorMsg("Email ou mot de passe incorrect. Vérifiez bien ce que vous avez tapé (le mot de passe est sensible à la casse).");
        } else {
          setErrorMsg(`Erreur serveur (${err.status}) — réessayez dans quelques secondes.`);
        }
      } else if (err instanceof TypeError) {
        setErrorMsg("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
      } else {
        setErrorMsg("Une erreur inattendue est survenue. Rechargez la page et réessayez.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Administration</CardTitle>
          <CardDescription>Connectez-vous pour accéder au tableau de bord</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }}
                placeholder="admin@exemple.com"
                required
                autoComplete="username"
                spellCheck={false}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(null); }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {showPassword && password && (
                <p className="text-xs text-muted-foreground break-all">
                  Mot de passe saisi : <span className="font-mono font-medium text-foreground">{password}</span>
                </p>
              )}
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                {errorMsg.includes("serveur") || errorMsg.includes("connexion") ? (
                  <WifiOff className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                )}
                <p className="text-xs text-destructive leading-snug">{errorMsg}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Astuce : cliquez sur l'œil 👁 pour vérifier votre mot de passe avant d'envoyer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
