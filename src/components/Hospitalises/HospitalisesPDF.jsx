import jsPDF from "jspdf";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR");
  } catch {
    return dateStr;
  }
};

const exportHospitalisesPDF = (patients) => {
  if (!patients || patients.length === 0) {
    alert("Aucun patient hospitalisé à exporter.");
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
  pdf.text("Patients hospitalisés", 10, y);

  // Tableau
  y += 8;
  const headers = ["Patient", "ID", "Chambre", "Service", "Admission"];
  const colWidths = [55, 30, 25, 40, 40];
  const startX = 10;

  // En-tête du tableau
  pdf.setFillColor(0, 94, 83);
  pdf.rect(startX, y, 190, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  let xPos = startX;
  headers.forEach((header, i) => {
    pdf.text(header, xPos + 2, y + 6);
    xPos += colWidths[i];
  });
  y += 10;

  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  patients.forEach((p, idx) => {
    if (y > 270) {
      pdf.addPage();
      y = 15;
    }

    if (idx % 2 === 0) {
      pdf.setFillColor(245, 255, 255);
    } else {
      pdf.setFillColor(255, 255, 255);
    }
    pdf.rect(startX, y, 190, 8, "F");

    pdf.setTextColor(0, 0, 0);
    const row = [
      `${p.prenom} ${p.nom}`,
      p.clinicalId || "N/A",
      p.chambre || "N/A",
      p.serviceAffecte || "—",
      formatDate(p.dateAdmission),
    ];

    xPos = startX;
    row.forEach((cell, i) => {
      pdf.text(cell.length > 25 ? cell.substring(0, 25) + "…" : cell, xPos + 2, y + 6);
      xPos += colWidths[i];
    });
    y += 8;
  });

  // Pied de page
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  const today = new Date().toLocaleDateString("fr-FR");
  pdf.text(`Document généré le ${today} - Sanctuary Health`, 10, 285);

  pdf.save("patients_hospitalises.pdf");
};

export default exportHospitalisesPDF;