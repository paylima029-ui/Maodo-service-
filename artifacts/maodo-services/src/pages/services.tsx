import { Link } from "wouter";
import { formatPrice } from "@/lib/constants";
import { useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, FileText, Mail, CheckCircle, GraduationCap, Globe, Loader2 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Mail,
  CheckCircle,
  GraduationCap,
  Globe,
};

export default function Services() {
  const { data: services, isLoading } = useListServices();

  return (
    <div className="flex flex-col flex-1 bg-muted/20">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Nos Services</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(services ?? []).map((service) => {
              const Icon = iconMap[service.icon] ?? FileText;
              return (
                <Card key={service.id} className="shadow-sm border-border/50 bg-card overflow-hidden flex flex-col">
                  {service.imageUrl ? (
                    <div className="h-44 w-full overflow-hidden bg-muted">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-primary/40" />
                    </div>
                  )}
                  <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 pt-1 flex-1">
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border/50">
                      <div className="font-bold text-primary">{formatPrice(service.price)}</div>
                      <div className="flex items-center text-xs text-muted-foreground font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        Livraison en {service.delay}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0">
                    <Link href={`/order/${service.id}`} className="w-full">
                      <Button className="w-full font-medium">Commander</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
