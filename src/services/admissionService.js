import api from "./api";

const admissionService = {
  getInPatients: () => api.get("/admission/patients/in-patients"),
getOutPatients: () => api.get("/admission/patients/out-patients"),
getPendingReview: () => api.get("/admission/patients/pending-review"),
  getAllPatients: () => api.get("/admission/patients"),
  getPatientById: (id) => api.get(`/admission/patients/${id}`),
  getPatientByClinicalId: (clinicalId) => api.get(`/admission/patients/clinical/${clinicalId}`),
  searchPatients: (query) => api.get(`/admission/patients/search?q=${query}`),
  createPatient: (patient) => api.post("/admission/patients", patient),
  updatePatient: (id, patient) => api.put(`/admission/patients/${id}`, patient),
  deletePatient: (id) => api.delete(`/admission/patients/${id}`),
  getPatientCount: () => api.get("/admission/patients/count"),
  getPatientsHospitalises: () => api.get("/admission/patients/hospitalises"),
  createPatient: (requestData) => api.post("/admission/patients", requestData),
  getChambresDisponibles: (service) => {
  const params = service ? `?service=${service}` : '';
  return api.get(`/admission/chambres/disponibles${params}`);
},
  sortirPatient: (id) => api.put(`/admission/patients/${id}/sortir`),

  // NOUVEAU : Transfert de chambre
  transfererPatient: (id, nouvelleChambre) =>
    api.put(`/admission/patients/${id}/transferer`, null, {
      params: { nouvelleChambre },
    }),


  };

  



export default admissionService;