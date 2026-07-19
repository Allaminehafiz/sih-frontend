import Icon from "../common/Icon";
import exportExamenPDF from "./ExamenPDF";

const DiagnosticReport = ({ name, status, daysAgo, isPending, prix, resultat, onExport, patientData }) => {
  return (
    <div className="group p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-xs text-gray-500">
            Status: {status} • {daysAgo}
          </p>
          {prix && <p className="text-xs text-gray-500">Prix: {prix} FCFA</p>}
        </div>
        <div className="flex items-center gap-2">
          {isPending ? (
            <Icon name="timer" size={22} color="#4c616c" />
          ) : (
            <Icon name="verified" size={22} color="#00796b" />
          )}
          {/* Bouton d'export individuel */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              exportExamenPDF(patientData, { name, status, prix, resultat });
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Exporter en PDF"
          >
            <Icon name="picture_as_pdf" size={16} color="#005e53" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticReport;