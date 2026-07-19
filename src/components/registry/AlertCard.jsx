import Icon from "../common/Icon";

const AlertCard = ({ icon, label, value, color = "tertiary" }) => {
  const iconColors = {
    tertiary: "text-cyan-600",
    primary: "text-teal-600",
  };

  const bgColors = {
    tertiary: "bg-gray-100",
    primary: "bg-teal-50",
  };

  const borderColors = {
    tertiary: "border-gray-200",
    primary: "border-teal-200",
  };

  return (
    <div className={`${bgColors[color]} p-6 rounded-2xl flex flex-col justify-between ${borderColors[color]} border`}>
      <Icon name={icon} size={28} color={iconColors[color] === "text-cyan-600" ? "#005c67" : "#005e53"} />
      <div>
        <p className="text-gray-500 text-xs font-bold mb-1">{label}</p>
        <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
      </div>
    </div>
  );
};

export default AlertCard;