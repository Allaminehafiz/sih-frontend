import Icon from "../common/Icon";

const TreatmentItem = ({ icon, iconColor = "text-teal-600", iconBg = "bg-teal-50", name, details }) => {
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        <Icon name={icon} size={20} />
      </div>
      <div>
        <p className="text-sm font-bold">{name}</p>
        <p className="text-xs text-gray-500">{details}</p>
      </div>
    </div>
  );
};

export default TreatmentItem;