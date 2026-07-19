import api from "./api";

const calendarService = {
  getCreneauxLibres: (medecinId, date, duree = 30) =>
    api.get("/calendar/creneaux-libres", { params: { medecinId, date, duree } }),
};

export default calendarService;