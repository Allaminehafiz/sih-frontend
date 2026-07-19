import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import ActionMenu from "../common/ActionMenu";
import Icon from "../common/Icon";
const statusStyles = {
  STABLE: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  OBSERVATION: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CRITICAL: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  RECOVERING: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  ADMIS: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  EN_ATTENTE: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  REFUSE: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const statusLabels = {
  STABLE: "STABLE",
  OBSERVATION: "OBSERVATION",
  CRITICAL: "CRITICAL",
  RECOVERING: "RECOVERING",
  ADMIS: "ADMIS",
  EN_ATTENTE: "EN ATTENTE",
  REFUSE: "REFUSE",
};

const PatientTableRow = ({ patient, onClick, onEdit, onDelete }) => {
  const statusStyle = statusStyles[patient.status] || statusStyles.ADMIS;
  const displayStatus = statusLabels[patient.status] || patient.status;

  return (
    <tr
      className="group hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          {patient.avatar ? (
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={patient.avatar}
              alt={patient.name}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <div className="text-sm font-bold">?</div>
            </div>
          )}
          <div>
            <p className="font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {patient.name}
            </p>
            <p className="text-xs text-gray-500">
              {patient.gender} • {patient.age} yrs
            </p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-teal-800">
          {patient.clinicalId}
        </code>
      </td>
      <td className="px-8 py-5">
        <p className="text-sm font-medium text-gray-900">{patient.lastEncounter}</p>
        <p className="text-[10px] text-gray-400">{patient.department}</p>
      </td>
      <td className="px-8 py-5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
          {displayStatus}
        </span>
      </td>
      <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
        <ActionMenu
          onEdit={() => onEdit && onEdit(patient)}
          onDelete={() => onDelete && onDelete(patient)}
        />
      </td>
    </tr>
  );
};

export default PatientTableRow;