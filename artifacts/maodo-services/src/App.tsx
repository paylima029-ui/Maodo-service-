import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout";
import { InstallPrompt } from "@/components/install-prompt";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Order from "@/pages/order";
import Payment from "@/pages/payment";
import PaymentResult from "@/pages/payment-result";
import PaymentSuccess from "@/pages/payment-success";
import PaymentFailed from "@/pages/payment-failed";
import PaymentPending from "@/pages/payment-pending";
import PaymentCancel from "@/pages/payment-cancel";
import Tracking from "@/pages/tracking";
import Admin from "@/pages/admin";
import Formations from "@/pages/formations";
import FormationDetail from "@/pages/formation-detail";
import LessonReader from "@/pages/lesson-reader";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/login" component={Login} />
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/order/:serviceId" component={Order} />
          <Route path="/payment/:orderId" component={Payment} />
          <Route path="/payment-result" component={PaymentResult} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/payment-failed" component={PaymentFailed} />
          <Route path="/payment-pending" component={PaymentPending} />
          <Route path="/payment-cancel" component={PaymentCancel} />
          <Route path="/success" component={PaymentResult} />
          <Route path="/cancel" component={PaymentCancel} />
          <Route path="/paiement-succes" component={PaymentResult} />
          <Route path="/paiement-echec" component={PaymentCancel} />
          <Route path="/tracking/:reference" component={Tracking} />
          <Route path="/formations" component={Formations} />
          <Route path="/formations/:id" component={FormationDetail} />
          <Route path="/formations/:id/lecon/:leconId" component={LessonReader} />
          <Route path="/admin">
            {() => <ProtectedRoute component={Admin} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
          <InstallPrompt />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
