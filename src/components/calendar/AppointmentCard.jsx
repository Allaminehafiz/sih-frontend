import Icon from "../common/Icon";

const typeStyles = {
  primary: { bg: "bg-teal-50", border: "border-l-teal-600", text: "text-teal-700" },
  secondary: { bg: "bg-blue-50", border: "border-l-blue-600", text: "text-blue-700" },
  tertiary: { bg: "bg-cyan-50", border: "border-l-cyan-600", text: "text-cyan-700" },
  error: { bg: "bg-red-50", border: "border-l-red-600", text: "text-red-700" },
};

const AppointmentCard = ({ title, patientName, patient, time, location, doctor, type = "primary", onClick }) => {
  const styles = typeStyles[type] || typeStyles.primary;
  
  // Utiliser le vrai nom et ID du patient si disponibles
  const displayName = patient ? `${patient.prenom} ${patient.nom}` : patientName;
  const displayId = patient?.clinicalId ? `#${patient.clinicalId}` : "";

  return (
    <div
      onClick={onClick}
      className={`${styles.bg} border-l-4 ${styles.border} rounded-xl p-2 shadow-sm hover:z-10 transition-all cursor-pointer overflow-hidden`}
      style={{ fontSize: '0.75rem' }}
    >
      <p className={`text-[10px] font-bold uppercase leading-tight ${styles.text}`}>{title}</p>
      <p className="font-semibold truncate">{displayName || patientName}</p>
      {displayId && <p className="text-[10px] text-gray-500">{displayId}</p>}
      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 truncate">
        {(doctor || location) && <Icon name="medical_services" size={12} />}
        <span>{doctor}{doctor && location ? " • " : ""}{location}</span>
      </div>
      {time && (
        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
          <Icon name="schedule" size={12} />
          <span>{time}</span>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;