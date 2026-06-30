import { Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { ComponentType } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  component: ComponentType;
}

export function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <Component />;
}
