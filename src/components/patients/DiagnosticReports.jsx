import Icon from "../common/Icon";
import DiagnosticReport from "./DiagnosticReport";

const DiagnosticReports = ({ reports = [], patientData, onAddExamen, onFinalizeExamen }) => {
  return (
    <div className="bg-white p-6 rounded-xl space-y-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Icon name="lab_profile" size={22} color="#005e53" />
          Diagnostic Reports
        </h3>
        <button onClick={onAddExamen} className="text-teal-600 hover:bg-teal-50 p-1 rounded">
          <Icon name="add_circle" size={22} />
        </button>
      </div>
      <div className="space-y-3">
        {reports.map((report, index) => (
    <div key={index} className="group relative">
      <DiagnosticReport {...report} patientData={patientData} />
            {report.isPending && onFinalizeExamen && (
              <button
                onClick={() => onFinalizeExamen(report)}
                className="absolute right-2 top-2 text-xs text-teal-600 hover:underline"
              >
                Finaliser
              </button>
            )}
          </div>
        ))}
        {reports.length === 0 && (
          <p className="text-sm text-gray-400">Aucun examen</p>
        )}
      </div>
    </div>
  );
};

export default DiagnosticReports;