export const SERVICES = [
  { id: "cv", name: "CV Professionnel", price: 5000, delay: "24h", description: "Un CV moderne qui attire l'attention", icon: "FileText" },
  { id: "lettre", name: "Lettre de motivation", price: 3000, delay: "12h", description: "Percutante et personnalisée", icon: "Mail" },
  { id: "correction", name: "Correction de CV", price: 2500, delay: "6h", description: "Votre CV optimisé par un expert", icon: "CheckCircle" },
  { id: "dossier", name: "Dossier d'études à l'étranger", price: 15000, delay: "72h", description: "Dossier complet et conforme", icon: "GraduationCap" },
  { id: "site", name: "Site web simple", price: 50000, delay: "7 jours", description: "Votre présence en ligne", icon: "Globe" },
];

export const formatPrice = (price: number) => price.toLocaleString('fr-FR') + ' FCFA';

export const WHATSAPP_NUMBER = "221769042423";
export const WHATSAPP_URL = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
