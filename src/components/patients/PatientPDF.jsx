import jsPDF from "jspdf";

const exportPatientPDF = (patientData, timeline = [], diagnostics = []) => {
  const pdf = new jsPDF("p", "mm", "a4");
  let y = 10;

  // En-tête avec fond teal
  pdf.setFillColor(0, 94, 83); // #005e53
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
  pdf.setFont("helvetica", "bold");
  pdf.text("Fiche patient", 10, y);

  // Informations patient dans un tableau
  y += 8;
  pdf.setDrawColor(0, 94, 83);
  pdf.setLineWidth(0.5);
  pdf.line(10, y, 200, y);
  y += 4;

  const patientFields = [
    { label: "Nom complet", value: patientData.name || "N/A" },
    { label: "ID clinique", value: patientData.clinicalId || "N/A" },
    { label: "Date de naissance", value: `${patientData.dob || "N/A"} (${patientData.age || "?"} ans)` },
    { label: "Statut d'admission", value: patientData.statutAdmission || "N/A" },
    { label: "Couverture médicale", value: patientData.couvertureMedicale || "Aucune" },
    { label: "Taux de prise en charge", value: patientData.tauxPriseEnCharge != null ? `${Math.round(patientData.tauxPriseEnCharge * 100)}%` : "N/A" },
    { label: "Chambre", value: patientData.chambre || "N/A" },
  ];

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  patientFields.forEach(field => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${field.label}:`, 12, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(field.value, 60, y);
    y += 6;
  });

  // Données médicales (badges)
  y += 4;
  pdf.setFillColor(240, 248, 250);
  pdf.rect(10, y, 190, 10, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 94, 83);
  pdf.text("Données médicales", 12, y + 6);
  y += 10;

  const medicalFields = [
    { label: "Groupe sanguin", value: patientData.bloodType || "N/A" },
    { label: "Poids", value: patientData.weight ? `${patientData.weight} kg` : "N/A" },
    { label: "Taille", value: patientData.height ? `${patientData.height} cm` : "N/A" },
  ];

  medicalFields.forEach((field, idx) => {
    const x = 12 + idx * 62;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(x, y, 58, 12, "F");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(field.label, x + 2, y + 5);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 94, 83);
    pdf.text(field.value, x + 2, y + 10);
  });

  // Timeline (consultations)
  y += 16;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Historique clinique (timeline)", 12, y + 6);
  y += 12;

  if (timeline.length === 0) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Aucune consultation enregistrée", 12, y);
    y += 6;
  } else {
    timeline.forEach((item, idx) => {
      if (idx > 0) {
        y += 2;
      }
      pdf.setFillColor(idx % 2 === 0 ? 245 : 255, 255, 255);
      pdf.rect(10, y, 190, 12, "F");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 94, 83);
      pdf.text(`${item.date} - ${item.title}`, 12, y + 5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text(item.description.length > 60 ? item.description.substring(0, 60) + "..." : item.description, 12, y + 9);
      y += 12;
    });
  }

  // Diagnostics (examens)
  y += 10;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Diagnostics / Examens", 12, y + 6);
  y += 12;

  if (diagnostics.length === 0) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Aucun examen enregistré", 12, y);
    y += 6;
  } else {
    diagnostics.forEach((diag, idx) => {
      if (idx > 0) y += 2;
      pdf.setFillColor(idx % 2 === 0 ? 245 : 255, 255, 255);
      pdf.rect(10, y, 190, 12, "F");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 94, 83);
      pdf.text(diag.name, 12, y + 5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      const statusText = `Statut : ${diag.status}`;
      const priceText = diag.prix ? `Prix : ${diag.prix} FCFA` : "";
      pdf.text(`${statusText}   ${priceText}`, 12, y + 9);
      y += 12;
    });
  }

  // Pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const today = new Date().toLocaleDateString("fr-FR");
  pdf.text(`Document généré le ${today} - Sanctuary Health - Precision Care Portal`, 10, 285);

  // Enregistrer
  pdf.save(`patient_${patientData.clinicalId || "inconnu"}.pdf`);
};

export default exportPatientPDF;