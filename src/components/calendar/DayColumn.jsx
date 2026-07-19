import AppointmentCard from "./AppointmentCard";

const DayColumn = ({ day, date, isToday, isWeekend, appointments = [], patients = [], onAppointmentClick }) => {
  // Pour chaque rendez-vous, on retrouve le patient correspondant
  const enrichedAppointments = appointments.map(appt => {
    const patient = patients.find(p => p.id === appt.patientId) || null;
    return {
      ...appt,
      patient, // objet patient complet
      patientName: patient ? `${patient.prenom} ${patient.nom}` : appt.patientName,
    };
  });

  return (
    <div
      className={`relative border-r border-gray-100 p-1 ${
        isToday ? "bg-teal-50/30" : ""
      } ${isWeekend ? "bg-gray-50/50" : ""}`}
    >
      {enrichedAppointments.map((appt, index) => (
        <div
          key={index}
          className="absolute left-1 right-1"
          style={{ top: `${appt.top}rem` }}
        >
          <div style={{ height: `${appt.height}rem` }}>
            <AppointmentCard
              {...appt}
              onClick={() => onAppointmentClick && onAppointmentClick(appt)}
            />
          </div>
        </div>
      ))}

      {/* Ligne de temps actuel */}
      {isToday && (
        <div
          className="absolute left-0 right-0 h-[2px] bg-red-500 z-20 flex items-center"
          style={{ top: "10.5rem" }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 -ml-[6px]"></div>
        </div>
      )}
    </div>
  );
};

export default DayColumn;