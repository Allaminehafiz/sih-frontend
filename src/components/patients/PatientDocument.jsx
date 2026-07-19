import Icon from "../common/Icon";

const PatientDocument = ({ name, type = "pdf" }) => {
  const isPdf = type === "pdf";
  const iconName = isPdf ? "picture_as_pdf" : "description";
  const iconColor = isPdf ? "#ba1a1a" : "#005e53";

  return (
    <div className="p-3 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer hover:bg-gray-200 transition-colors">
      <Icon name={iconName} size={36} color={iconColor} />
      <p className="text-[10px] font-bold uppercase tracking-tight">{name}</p>
    </div>
  );
};

export default PatientDocument;