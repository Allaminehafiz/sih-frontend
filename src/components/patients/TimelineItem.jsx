import Icon from "../common/Icon";
import exportConsultationPDF from "./ConsultationPDF";

const TimelineItem = ({ title, date, description, tags = [], color = "primary", patientData, fullConsultation }) => {
  const colors = {
    primary: "bg-teal-600",
    tertiary: "bg-cyan-600",
    secondary: "bg-blue-400",
    error: "bg-red-500",
  };
  const dotColor = colors[color] || colors.primary;

  return (
    <div className="relative pl-10">
      <div className={`absolute left-0 top-1 w-[24px] h-[24px] ${dotColor} rounded-full border-4 border-white z-10`}></div>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-gray-900">{title}</h4>
            <span className="text-sm font-medium text-gray-500">{date}</span>
          </div>
          {/* Bouton PDF */}
          <button
            onClick={() => exportConsultationPDF(patientData, { title, date, description, doctor: fullConsultation?.doctor })}
            className="p-1 hover:bg-gray-100 rounded"
            title="Exporter en PDF"
          >
            <Icon name="picture_as_pdf" size={16} color="#005e53" />
          </button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        {tags.length > 0 && (
          <div className="flex gap-2 pt-1">
            {tags.map((tag, index) => (
              <span key={index} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;