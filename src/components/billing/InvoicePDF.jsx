import jsPDF from "jspdf";

const formatAmount = (val) => {
  if (val == null || isNaN(val)) return "0 FCFA";
  const num = Number(val);
  const parts = num.toFixed(0).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".") + " FCFA";
};

const exportInvoicePDF = (facture) => {
  if (!facture) return;

  const pdf = new jsPDF("p", "mm", "a4");
  let y = 10;

  // En-tête avec fond teal
  pdf.setFillColor(0, 94, 83);
  pdf.rect(0, 0, 210, 20, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Sanctuary Health", 10, 13);
  pdf.setFontSize(10);
  pdf.text("Precision Care Portal", 10, 19);

  // Titre
  y = 25;
  pdf.setTextColor(0, 94, 83);
  pdf.setFontSize(16);
  pdf.text(`Facture ${facture.invoiceId || ""}`, 10, y);

  // Informations patient
  y += 10;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const infoFields = [
    { label: "Patient", value: facture.patient || "N/A" },
    { label: "ID", value: facture.email || "N/A" },
    { label: "Date d'émission", value: facture.dateEmission || "N/A" },
    { label: "Date d'échéance", value: facture.dateEcheance || "N/A" },
    { label: "Statut", value: facture.statut || "N/A" },
  ];

  infoFields.forEach(f => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${f.label}:`, 12, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(f.value, 60, y);
    y += 6;
  });

  // Lignes de la facture
  y += 6;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Actes facturés", 12, y + 6);
  y += 12;

  if (facture.lignes && facture.lignes.length > 0) {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Description", 12, y);
    pdf.text("Prix unitaire", 100, y);
    pdf.text("Qté", 140, y);
    pdf.text("Total", 170, y);
    y += 4;

    facture.lignes.forEach((ligne, idx) => {
      if (idx > 0) y += 2;
      pdf.setFillColor(idx % 2 === 0 ? 245 : 255, 255, 255);
      pdf.rect(10, y, 190, 8, "F");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(ligne.description || "", 12, y + 5);
      pdf.text(formatAmount(ligne.montantUnitaire), 100, y + 5);
      pdf.text(`${ligne.quantite || 1}`, 140, y + 5);
      pdf.text(formatAmount(ligne.montantUnitaire * (ligne.quantite || 1)), 170, y + 5);
      y += 8;
    });

    y += 4;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 94, 83);
    pdf.text(`Total : ${formatAmount(facture.montantTotal)}`, 12, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Part assurance : ${formatAmount(facture.partMutuelle)}`, 12, y);
    y += 5;
    pdf.text(`Reste à payer (patient) : ${formatAmount(facture.partPatient)}`, 12, y);
  } else {
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Aucun acte facturé", 12, y);
    y += 6;
  }

  // Paiements
  y += 10;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Paiements effectués", 12, y + 6);
  y += 12;

  if (facture.paiements && facture.paiements.length > 0) {
    facture.paiements.forEach((p, idx) => {
      if (idx > 0) y += 2;
      pdf.setFillColor(idx % 2 === 0 ? 245 : 255, 255, 255);
      pdf.rect(10, y, 190, 8, "F");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(p.datePaiement || "N/A", 12, y + 5);
      pdf.text(formatAmount(p.montant), 80, y + 5);
      pdf.text(p.modePaiement || "", 140, y + 5);
      y += 8;
    });
  } else {
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Aucun paiement enregistré", 12, y);
    y += 6;
  }

  // Pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const today = new Date().toLocaleDateString("fr-FR");
  pdf.text(`Document généré le ${today} - Sanctuary Health - Precision Care Portal`, 10, 285);

  pdf.save(`facture_${facture.invoiceId || "inconnue"}.pdf`);
};

export default exportInvoicePDF;