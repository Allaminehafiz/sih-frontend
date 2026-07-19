import api from "./api";

const facturationService = {
  getAllFactures: () => api.get("/facturation/factures"),
  getFacturesByPatient: (patientId) => api.get(`/facturation/factures/patient/${patientId}`),
  getFacturesByStatut: (statut) => api.get(`/facturation/factures/statut?statut=${statut}`),
  createFacture: (facture) => api.post("/facturation/factures", facture),
  updateStatut: (id, statut) => api.put(`/facturation/factures/${id}/statut?statut=${statut}`),
  getFactureDetail: (id) => api.get(`/facturation/factures/${id}/detail`),


  // Paiements
  genererFacture: (patientId) => api.post(`/facturation/factures/generer/${patientId}`),
  createPaiement: (paiement) => api.post("/facturation/paiements", paiement),
  getPaiementsByFacture: (factureId) => api.get(`/facturation/paiements/facture/${factureId}`),
  deleteFacture: (id) => api.delete(`/facturation/factures/${id}`),
  };

export default facturationService;