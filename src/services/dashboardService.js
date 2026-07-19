import api from "./api";

const dashboardService = {
  getStats: async () => {
    const patients = await api.get("/admission/patients/count");
    const factures = await api.get("/facturation/factures");
    const pendingCount = factures.data.filter(f => f.statut === "EN_ATTENTE").length;
    const overdueCount = factures.data.filter(f => f.statut === "EN_RETARD").length;
    
    return {
      totalPatients: patients.data,
      pendingInvoices: pendingCount + overdueCount,
    };
  },
  
  getStatsFacturation: () => api.get("/dashboard/stats-facturation"),
  getRecentPatients: () => api.get("/admission/patients"),
  getAppointmentsToday: () => api.get("/dashboard/stats"),
  getMontantEnAttente: () => api.get("/dashboard/montant-en-attente"),
  getRecentConsultations: () => api.get("/medical/consultations/medecin/1"),
  getPendingFactures: () => api.get("/facturation/factures/statut?statut=EN_ATTENTE"),
};

export default dashboardService;