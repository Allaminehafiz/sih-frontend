import jsPDF from "jspdf";

const exportConsultationPDF = (patientData, consultation) => {
  if (!consultation) {
    alert("Aucune consultation à exporter.");
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
  pdf.text("Rapport de consultation", 10, y);

  // Infos patient
  y += 10;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Patient : ${patientData.name || "N/A"}`, 12, y);
  pdf.text(`ID : ${patientData.clinicalId || "N/A"}`, 100, y);
  y += 6;
  pdf.text(`Date de naissance : ${patientData.dob || "N/A"}`, 12, y);

  // Détail de la consultation
  y += 12;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Détail de la consultation", 12, y + 6);
  y += 12;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const fields = [
    { label: "Date", value: consultation.date || "N/A" },
    { label: "Motif", value: consultation.title || consultation.motif || "N/A" },
    { label: "Médecin", value: consultation.doctor || "N/A" },
  ];

  fields.forEach(f => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${f.label}:`, 12, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(f.value, 50, y);
    y += 7;
  });

  // Diagnostic / Notes
  y += 4;
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(100, 100, 100);
  pdf.text("Diagnostic / Notes :", 12, y);
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const notes = consultation.description || consultation.notes || "Aucune note renseignée.";
  const lines = pdf.splitTextToSize(notes, 180);
  pdf.text(lines, 12, y);

  // Pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const today = new Date().toLocaleDateString("fr-FR");
  pdf.text(`Document généré le ${today} - Sanctuary Health - Precision Care Portal`, 10, 285);

  pdf.save(`consultation_${patientData.clinicalId || "patient"}.pdf`);
};

export default exportConsultationPDF;