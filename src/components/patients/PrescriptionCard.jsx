const borderColors = {
  primary: "border-l-teal-600",
  tertiary: "border-l-cyan-600",
};

const textColors = {
  primary: "text-teal-600",
  tertiary: "text-cyan-600",
};

const PrescriptionCard = ({ name, dosage, instructions, quantity, refills, color = "primary" }) => {
  return (
    <div className={`p-4 bg-gray-100 rounded-xl border-l-4 ${borderColors[color] || borderColors.primary}`}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <span className={`text-[10px] font-extrabold ${textColors[color] || textColors.primary}`}>
          ACTIVE
        </span>
      </div>
      <p className="text-xs text-gray-500 font-medium">{instructions}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-bold">Qty: {quantity} • {refills} Refills</span>
        <button className="text-xs font-bold text-teal-600 hover:underline">Details</button>
      </div>
    </div>
  );
};

export default PrescriptionCard;