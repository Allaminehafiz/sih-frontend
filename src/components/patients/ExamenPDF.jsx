import jsPDF from "jspdf";

const formatAmount = (val) => {
  if (val == null || isNaN(val)) return "0 FCFA";
  const num = Number(val);
  const parts = num.toFixed(0).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".") + " FCFA";
};

const exportExamenPDF = (patientData, examen) => {
  if (!examen) {
    alert("Aucun examen à exporter.");
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
  pdf.text("Résultat d'examen", 10, y);

  // Infos patient
  y += 10;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Patient : ${patientData.name || "N/A"}`, 12, y);
  pdf.text(`ID : ${patientData.clinicalId || "N/A"}`, 100, y);
  y += 6;
  pdf.text(`Date de naissance : ${patientData.dob || "N/A"}`, 12, y);

  // Détail de l'examen
  y += 12;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Détail de l'examen", 12, y + 6);
  y += 12;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);

  const fields = [
    { label: "Examen", value: examen.name || "N/A" },
    { label: "Statut", value: examen.status || "N/A" },
    { label: "Prix", value: formatAmount(examen.prix) },
    { label: "Résultat", value: "" },
  ];

  fields.forEach(f => {
    if (f.label === "Résultat") {
      y += 4;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Résultat :", 12, y);
      y += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const resultat = examen.resultat || "Aucun résultat renseigné";
      const lines = pdf.splitTextToSize(resultat, 180);
      pdf.text(lines, 12, y);
      y += lines.length * 5;
    } else {
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${f.label}:`, 12, y);
      pdf.setTextColor(0, 0, 0);
      pdf.text(f.value, 60, y);
      y += 6;
    }
  });

  // Pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const today = new Date().toLocaleDateString("fr-FR");
  pdf.text(`Document généré le ${today} - Sanctuary Health - Precision Care Portal`, 10, 285);

  pdf.save(`examen_${patientData.clinicalId || "patient"}.pdf`);
};

export default exportExamenPDF;