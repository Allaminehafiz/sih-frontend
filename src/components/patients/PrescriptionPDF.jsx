import jsPDF from "jspdf";

const exportPrescriptionPDF = (patientData, prescriptions = []) => {
  if (!prescriptions || prescriptions.length === 0) {
    alert("Aucune prescription à exporter.");
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
  pdf.text("Ordonnance médicale", 10, y);

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

  // Tableau des prescriptions
  y += 12;
  pdf.setFillColor(0, 94, 83);
  pdf.rect(10, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Médicament", 12, y + 6);
  pdf.text("Posologie", 80, y + 6);
  pdf.text("Qantité", 145, y + 6);
  pdf.text("Renouvel.", 175, y + 6);
  y += 10;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  prescriptions.forEach((p, idx) => {
    if (idx % 2 === 0) {
      pdf.setFillColor(245, 255, 255);
    } else {
      pdf.setFillColor(255, 255, 255);
    }
    pdf.rect(10, y, 190, 10, "F");
    pdf.setTextColor(0, 0, 0);
    pdf.text(p.name || "N/A", 12, y + 6);
    pdf.text(p.instructions || "N/A", 80, y + 6);
    pdf.text(`${p.quantity || 0}`, 145, y + 6);
    pdf.text(`${p.refills || 0}`, 175, y + 6);
    y += 10;
  });

  // Pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const today = new Date().toLocaleDateString("fr-FR");
  pdf.text(`Document généré le ${today} - Sanctuary Health`, 10, 285);

  pdf.save(`ordonnance_${patientData.clinicalId || "patient"}.pdf`);
};

export default exportPrescriptionPDF;