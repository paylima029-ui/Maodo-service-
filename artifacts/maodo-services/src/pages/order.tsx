import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/constants";
import { useListServices, useCreateOrder, getListOrdersQueryKey, ApiError } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  clientName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  clientPhone: z.string().min(6, "Numéro invalide"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Order({ params }: { params: { serviceId: string } }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useListServices();
  const service = services?.find((s) => s.id === params.serviceId);
  const createOrder = useCreateOrder();

  const [file, setFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      description: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 py-16 px-4 text-center">
        <p className="text-muted-foreground">Service introuvable.</p>
        <Link href="/services">
          <Button variant="outline">Voir tous nos services</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const order = await createOrder.mutateAsync({
        data: {
          serviceId: service.id,
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          description: data.description,
        }
      });

      if (file && order.id) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch(`/api/orders/${order.id}/file`, {
          method: "POST",
          body: formData,
        });
      }

      queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
      setLocation(`/payment/${order.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = (err.data as { error?: string } | null)?.error;
        toast.error(msg ?? `Erreur ${err.status} lors de la création`);
      } else if (err instanceof TypeError) {
        toast.error("Impossible de joindre le serveur. Vérifiez votre connexion.");
      } else {
        toast.error("Erreur lors de la création de la commande");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-muted/20">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/services">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Commander</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Colonne gauche — Résumé service (desktop) */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="overflow-hidden">
              {service.imageUrl && (
                <div className="h-40 w-full overflow-hidden">
                  <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4">
                <h2 className="font-bold text-lg text-primary">{service.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-sm text-muted-foreground">Prix</span>
                    <span className="font-bold text-lg">{formatPrice(service.price)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Délai
                    </span>
                    <span className="font-semibold">{service.delay}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avantages — visible sur desktop seulement */}
            <Card className="hidden lg:block">
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold text-sm mb-1">Ce que vous obtenez</p>
                {[
                  "Document professionnel et soigné",
                  "Livraison directement sur WhatsApp",
                  "Satisfaction garantie",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite — Formulaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-5 sm:p-6">
                <h3 className="font-semibold text-base mb-4">Vos informations</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Mamadou Diop" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro WhatsApp <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+221 77 000 00 00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description du besoin <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez ce que vous attendez du service..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Fichier à joindre <span className="text-muted-foreground font-normal">(Optionnel)</span>
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          {file ? file.name : "Cliquez pour choisir un fichier"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={createOrder.isPending}
                    >
                      {createOrder.isPending ? "Traitement..." : "Procéder au paiement"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
