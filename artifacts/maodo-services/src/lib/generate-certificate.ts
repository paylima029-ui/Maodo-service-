import { jsPDF } from "jspdf";

export function generateCertificate(params: {
  formationId?: number;
  recipientName: string;
  formationTitle: string;
  formationCategory: string;
  completionDate?: Date;
}) {
  const { formationId, recipientName, formationTitle, completionDate = new Date() } = params;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const W = 297;
  const H = 210;

  // ── Background ──────────────────────────────────────────────
  doc.setFillColor(252, 251, 248);
  doc.rect(0, 0, W, H, "F");

  // ── Outer border (blue) ───────────────────────────────────────
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(4);
  doc.rect(8, 8, W - 16, H - 16);

  // ── Inner border (gold) ──────────────────────────────────────
  doc.setDrawColor(217, 160, 17);
  doc.setLineWidth(1.2);
  doc.rect(12, 12, W - 24, H - 24);

  // ── Corner ornaments ─────────────────────────────────────────
  const drawCorner = (x: number, y: number, flip: [number, number]) => {
    doc.setDrawColor(217, 160, 17);
    doc.setLineWidth(0.8);
    const [sx, sy] = flip;
    doc.line(x, y, x + sx * 10, y);
    doc.line(x, y, x, y + sy * 10);
    doc.line(x + sx * 4, y + sy * 4, x + sx * 10, y + sy * 4);
    doc.line(x + sx * 4, y + sy * 4, x + sx * 4, y + sy * 10);
  };
  drawCorner(12, 12, [1, 1]);
  drawCorner(W - 12, 12, [-1, 1]);
  drawCorner(12, H - 12, [1, -1]);
  drawCorner(W - 12, H - 12, [-1, -1]);

  // ── Top decorative strip ──────────────────────────────────────
  doc.setFillColor(30, 58, 138);
  doc.rect(12, 12, W - 24, 22, "F");

  // ── Platform name ────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("MaodoNumérique", W / 2, 26, { align: "center" });

  // ── Star row decoration ───────────────────────────────────────
  doc.setTextColor(217, 160, 17);
  doc.setFontSize(8);
  doc.text("✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦", W / 2, 40, { align: "center" });

  // ── Main heading ──────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(30, 58, 138);
  doc.text("CERTIFICAT DE RÉUSSITE", W / 2, 56, { align: "center" });

  // ── Divider line ─────────────────────────────────────────────
  doc.setDrawColor(217, 160, 17);
  doc.setLineWidth(0.6);
  doc.line(60, 60, W - 60, 60);

  // ── "Décerné à" label ─────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text("Ce certificat est décerné à", W / 2, 72, { align: "center" });

  // ── Recipient name ────────────────────────────────────────────
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(30);
  doc.setTextColor(30, 58, 138);
  doc.text(recipientName, W / 2, 92, { align: "center" });

  // ── Underline name ────────────────────────────────────────────
  doc.setDrawColor(217, 160, 17);
  doc.setLineWidth(0.5);
  const nameWidth = doc.getTextWidth(recipientName);
  doc.line(W / 2 - nameWidth / 2, 95, W / 2 + nameWidth / 2, 95);

  // ── "Pour avoir complété" ─────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("pour avoir complété avec succès la formation", W / 2, 108, { align: "center" });

  // ── Formation title ───────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(30, 58, 138);
  const formationLines = doc.splitTextToSize(`« ${formationTitle} »`, 200);
  doc.text(formationLines, W / 2, 120, { align: "center" });

  // ── Bottom section ────────────────────────────────────────────
  const dateStr = completionDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Left: Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Date de complétion", 65, 155, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text(dateStr, 65, 162, { align: "center" });

  // Center: Seal circle
  doc.setFillColor(30, 58, 138);
  doc.circle(W / 2, 158, 14, "F");
  doc.setFillColor(217, 160, 17);
  doc.circle(W / 2, 158, 12, "F");
  doc.setFillColor(30, 58, 138);
  doc.circle(W / 2, 158, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("MN", W / 2, 160, { align: "center" });

  // Right: Signature
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Directeur de formation", W - 65, 155, { align: "center" });
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.3);
  doc.line(W - 95, 162, W - 35, 162);
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text("Maodo Kouyaté", W - 65, 169, { align: "center" });

  // ── Bottom star row ───────────────────────────────────────────
  doc.setTextColor(217, 160, 17);
  doc.setFontSize(8);
  doc.text("✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦  ✦", W / 2, 178, { align: "center" });

  // ── Bottom strip ──────────────────────────────────────────────
  doc.setFillColor(30, 58, 138);
  doc.rect(12, H - 34, W - 24, 22, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Services Numériques Professionnels · www.maodo-services.sn",
    W / 2,
    H - 20,
    { align: "center" }
  );

  const fileName = `certificat-${formationTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.pdf`;
  doc.save(fileName);

  // ── Record completion on server (once per formation) ──────────
  if (formationId) {
    const key = `formation_cert_sent_${formationId}`;
    if (!localStorage.getItem(key)) {
      fetch("/api/formation-completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formationId, clientName: recipientName, formationTitle }),
      })
        .then(() => localStorage.setItem(key, "1"))
        .catch(() => {});
    }
  }
}
