import api from "./api";

const medicalService = {
  // Dossiers médicaux
  getAllDossiers: () => api.get("/medical/dossiers"),
  getDossierByPatientId: (patientId) => api.get(`/medical/dossiers/patient/${patientId}`),
  createDossier: (dossier) => api.post("/medical/dossiers", dossier),
  updateDossier: (id, dossier) => api.put(`/medical/dossiers/${id}`, dossier),

  // Consultations
  getConsultationsByDossier: (dossierId) => api.get(`/medical/consultations/dossier/${dossierId}`),
  getConsultationsByMedecin: (medecinId) => api.get(`/medical/consultations/medecin/${medecinId}`),
  createConsultation: (consultation) => api.post("/medical/consultations", consultation),
  updateConsultation: (id, consultation) => api.put(`/medical/consultations/${id}`, consultation),

  // Prescriptions
  getPrescriptionsByConsultation: (consultationId) => api.get(`/medical/prescriptions/consultation/${consultationId}`),
  createPrescription: (prescription) => api.post("/medical/prescriptions", prescription),
  deletePrescription: (id) => api.delete(`/medical/prescriptions/${id}`),
   //delete dossier
  deleteDossier: (id) => api.delete(`/medical/dossiers/${id}`),
  // Examens
  getExamensByPatient: (patientId) => api.get(`/medical/examens/patient/${patientId}`),
  createExamen: (examen) => api.post("/medical/examens", examen),
  updateExamen: (id, examen) => api.put(`/medical/examens/${id}`, examen),
  getConsultationsByRange: (start, end) =>
  api.get("/medical/consultations/range", { params: { start, end } }),
};

export default medicalService;