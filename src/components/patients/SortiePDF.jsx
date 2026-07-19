import jsPDF from "jspdf";

const exportSortiePDF = (patientData) => {
  if (!patientData) {
    alert("Aucune donnée patient à exporter.");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");
  let y = 10;

  // En-tête
  pdf.setFillColor(0, 94, 83);
  pdf.rect(0, 0, 210, 20, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Sanctuary Health", 10, 13);
  pdf.setFontSize(10);
  pdf.text("Precision Care Portal", 10, 19);

  // Titre
  y = 28;
  pdf.setTextColor(0, 94, 83);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Fiche de sortie", 10, y);

  // Infos patient
  y += 10;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Patient : ${patientData.name || "N/A"}`, 12, y);
  pdf.text(`ID : ${patientData.clinicalId || "N/A"}`, 100, y);
  y += 6;
  pdf.text(`Date de naissance : ${patientData.dob || "N/A"}`, 12, y);
  pdf.text(`Âge : ${patientData.age || "?"} ans`, 100, y);

  // Infos de sortie
  y += 12;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Informations de sortie", 12, y + 6);
  y += 12;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const fields = [
    { label: "Statut admission", value: patientData.statutAdmission || "N/A" },
    { label: "Couverture", value: patientData.couvertureMedicale || "Aucune" },
    { label: "Taux prise en charge", value: patientData.tauxPriseEnCharge ? `${Math.round(patientData.tauxPriseEnCharge * 100)}%` : "N/A" },
    { label: "Chambre", value: patientData.chambre || "N/A" },
    { label: "Date de sortie", value: new Date().toLocaleDateString("fr-FR") },
  ];

  fields.forEach(f => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${f.label}:`, 12, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(f.value, 60, y);
    y += 7;
  });

  // Observations
  y += 8;
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(100, 100, 100);
  pdf.text("Observations :", 12, y);
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  pdf.text("Patient sorti. Lit libéré.", 12, y);

  // Pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const today = new Date().toLocaleDateString("fr-FR");
  pdf.text(`Document généré le ${today} - Sanctuary Health - Precision Care Portal`, 10, 285);

  pdf.save(`sortie_${patientData.clinicalId || "patient"}.pdf`);
};

export default exportSortiePDF;