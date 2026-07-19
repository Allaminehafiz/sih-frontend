import { useState, useEffect } from "react";
import CalendarSubHeader from "../components/calendar/CalendarSubHeader";
import CalendarGrid from "../components/calendar/CalendarGrid";
import NextAppointmentPanel from "../components/calendar/NextAppointmentPanel";
import AppointmentForm from "../components/calendar/AppointmentForm";
import medicalService from "../services/medicalService";
import admissionService from "../services/admissionService";
import staffService from "../services/staffService";

const nextPatient = {
  name: "Aucun patient",
  type: "Aucun rendez-vous",
  avatar: "",
  bp: "--",
  weight: "--",
  pulse: "--",
};
const treatments = [];

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const formatRange = (start, end) => {
  const opts = { month: 'short', day: 'numeric' };
  const s = start.toLocaleDateString('en-US', opts);
  const e = end.toLocaleDateString('en-US', opts);
  return `${s} — ${e}, ${start.getFullYear()}`;
};

// Rôles autorisés à créer des rendez-vous
const canCreateAppointment = (role) => ["ADMIN", "AGENT_ADMISSION"].includes(role);

const CalendarPage = ({ user }) => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentsByDay, setAppointmentsByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await admissionService.getAllPatients();
        setPatients(res.data);
      } catch (err) {
        console.error("Erreur chargement patients", err);
      }
    };
    const fetchMedecins = async () => {
      try {
        const res = await staffService.getByRole("MEDECIN");
        setMedecins(res.data);
      } catch (err) {
        console.error("Erreur chargement médecins", err);
      }
    };
    const fetchDossiers = async () => {
      try {
        const res = await medicalService.getAllDossiers();
        setDossiers(res.data);
      } catch (err) {
        console.error("Erreur chargement dossiers", err);
      }
    };
    fetchPatients();
    fetchMedecins();
    fetchDossiers();
  }, []);

  const fetchAppointments = async (start, end) => {
    setLoading(true);
    try {
      const startStr = start.toISOString().slice(0, 19);
      const endStr = end.toISOString().slice(0, 19);
      const response = await medicalService.getConsultationsByRange(startStr, endStr);
      const grouped = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
      response.data.forEach((cons) => {
        const date = new Date(cons.dateConsultation);
        const dayIdx = (date.getDay() + 6) % 7;
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const day = dayNames[dayIdx];
        const hour = date.getHours() + date.getMinutes() / 60;
        const top = (hour - 8) * 4;
        const height = (cons.dureeMinutes / 60) * 4;

        const medecin = medecins.find(m => m.id === cons.medecinId);
        const doctorName = medecin ? `Dr. ${medecin.nom}` : `Dr. #${cons.medecinId}`;

        grouped[day].push({
          ...cons,
          title: cons.motif,
          patientName: `Patient #${cons.dossierId}`,
          doctor: doctorName,
          location: cons.notes || "",
          type: cons.urgence ? "error" : "primary",
          top: Math.max(0, top),
          height: Math.max(1, height),
          dossierId: cons.dossierId,
        });
      });
      setAppointmentsByDay(grouped);
    } catch (error) {
      console.error("Erreur chargement rendez-vous :", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments(currentWeekStart, currentWeekEnd);
  }, [currentWeekStart, medecins]);

  const enrichedAppointments = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
  for (const day of Object.keys(appointmentsByDay)) {
    enrichedAppointments[day] = appointmentsByDay[day].map(appt => {
      const dossier = dossiers.find(d => d.id === appt.dossierId);
      const patient = dossier ? patients.find(p => p.id === dossier.patientId) : null;
      return {
        ...appt,
        patient: patient || null,
        patientName: patient ? `${patient.prenom} ${patient.nom}` : appt.patientName,
      };
    });
  }

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(currentWeekStart.getDate() + i);
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekDates.push({
      day: dayNames[i],
      date: dayDate.getDate(),
      isToday: dayDate.toDateString() === new Date().toDateString(),
      isWeekend: i >= 5,
    });
  }

  const rangeString = formatRange(currentWeekStart, currentWeekEnd);

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarSubHeader
        staffAvatars={[]}
        currentRange={rangeString}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        onNewAppointment={canCreateAppointment(user?.role) ? () => setShowAppointmentForm(true) : null}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
          ) : (
            <CalendarGrid
              appointmentsByDay={enrichedAppointments}
              weekDates={weekDates}
              patients={patients}
              onAppointmentClick={(appt) => setSelectedAppointment(appt)}
            />
          )}
        </div>
        <NextAppointmentPanel
          patient={nextPatient}
          treatments={treatments}
          onViewHistory={() => console.log("View history")}
        />
      </div>

      {showAppointmentForm && canCreateAppointment(user?.role) && (
        <AppointmentForm
          onSubmit={() => fetchAppointments(currentWeekStart, currentWeekEnd)}
          onCancel={() => setShowAppointmentForm(false)}
        />
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {selectedAppointment.title || "Rendez-vous"}
            </h3>
            <p className="text-sm"><span className="font-medium">Patient :</span> {selectedAppointment.patientName}</p>
            {selectedAppointment.patient && (
              <p className="text-sm"><span className="font-medium">ID :</span> #{selectedAppointment.patient.clinicalId}</p>
            )}
            <p className="text-sm"><span className="font-medium">Médecin :</span> {selectedAppointment.doctor}</p>
            {selectedAppointment.location && (
              <p className="text-sm"><span className="font-medium">Lieu :</span> {selectedAppointment.location}</p>
            )}
            {selectedAppointment.notes && (
              <p className="text-sm"><span className="font-medium">Notes :</span> {selectedAppointment.notes}</p>
            )}
            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-4 w-full py-2 bg-teal-700 text-white rounded-lg font-bold hover:bg-teal-800 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;