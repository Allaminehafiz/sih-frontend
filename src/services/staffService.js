import api from "./api";

const staffService = {
  getAllUtilisateurs: () => api.get("/staff/utilisateurs"),
  getByRole: (role) => api.get(`/staff/utilisateurs/role/${role}`),
  createUtilisateur: (utilisateur) => api.post("/staff/utilisateurs", utilisateur),
  updateUtilisateur: (id, utilisateur) => api.put(`/staff/utilisateurs/${id}`, utilisateur),
  deleteUtilisateur: (id) => api.delete(`/staff/utilisateurs/${id}`),
};

export default staffService;