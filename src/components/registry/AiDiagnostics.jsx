import Icon from "../common/Icon";

const AiDiagnostics = ({ patientCount = 4, description, onViewReport }) => {
  return (
    <div className="bg-teal-700 text-white p-8 rounded-2xl shadow-2xl shadow-teal-700/30 flex flex-col justify-between">
      <div>
        <h4
          className="text-xl font-bold leading-tight mb-2"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          Precision AI Diagnostics
        </h4>
        <p className="text-teal-100 text-sm leading-relaxed">
          {description || `System scan complete. ${patientCount} patients identified with elevated risk profiles. Immediate triage recommended.`}
        </p>
      </div>
      <button
        onClick={onViewReport}
        className="mt-8 bg-white/10 hover:bg-white/20 transition-colors w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10"
      >
        View Risk Report
        <Icon name="arrow_forward" size={16} />
      </button>
    </div>
  );
};

export default AiDiagnostics;