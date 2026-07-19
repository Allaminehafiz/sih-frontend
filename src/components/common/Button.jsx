import Icon from "./Icon";

// Variantes de style pour les boutons
const variants = {
  primary: "bg-teal-700 text-white shadow hover:bg-teal-800",
  outline: "border border-gray-300 text-gray-600 hover:bg-gray-50",
  ghost: "text-gray-500 hover:bg-gray-100",
};

const Button = ({ variant = "primary", label, icon, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium text-sm transition-colors ${variants[variant] || variants.primary} ${className}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {label}
    </button>
  );
};

export default Button;