import Badge from "../common/Badge";

const borderStyles = {
  primary: "border-l-teal-400 group-hover:border-l-teal-600",
  tertiary: "border-l-cyan-400 group-hover:border-l-cyan-600",
  secondary: "border-l-blue-400 group-hover:border-l-blue-600",
  slate: "border-l-slate-300 group-hover:border-l-teal-400",
};

const ScheduleItem = ({ time, patientName, type, mode, modeVariant = "primary", isPast = false }) => {
  return (
    <div className={`flex gap-6 group ${isPast ? "opacity-60" : ""}`}>
      <div className="w-16 text-right pt-1">
        <span className="text-sm font-bold text-gray-500">{time}</span>
      </div>
      <div
        className={`flex-1 bg-gray-50 p-4 rounded-xl border-l-4 transition-all ${
          borderStyles[modeVariant] || borderStyles.primary
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h5 className="font-bold text-gray-900">{patientName}</h5>
            <p className="text-xs text-gray-500 font-medium">{type}</p>
          </div>
          <Badge label={mode} variant={modeVariant} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;