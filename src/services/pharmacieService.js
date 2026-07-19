import api from "./api";

const pharmacieService = {
  getAllMedicaments: () => api.get("/pharmacie/medicaments"),
  createMedicament: (medicament) => api.post("/pharmacie/medicaments", medicament),
  updateStock: (id, quantite) => api.put(`/pharmacie/medicaments/${id}/stock?quantite=${quantite}`),
  getLowStock: () => api.get("/pharmacie/medicaments/low-stock"),
  deleteMedicament: (id) => api.delete(`/pharmacie/medicaments/${id}`),

  // Ordonnances
  getOrdonnancesByPatient: (patientId) => api.get(`/pharmacie/ordonnances/patient/${patientId}`),
  createOrdonnance: (ordonnance) => api.post("/pharmacie/ordonnances", ordonnance),
  validerOrdonnance: (id) => api.put(`/pharmacie/ordonnances/${id}/valider`),
};

export default pharmacieService;