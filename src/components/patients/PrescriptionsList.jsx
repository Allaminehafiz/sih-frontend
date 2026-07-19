import Icon from "../common/Icon";
import PrescriptionCard from "./PrescriptionCard";

const PrescriptionsList = ({ prescriptions = [], onAddClick }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Prescriptions
        </h3>
        <span className="cursor-pointer" onClick={onAddClick}>
          <Icon name="add_circle" size={24} color="#005e53" />
        </span>
      </div>
      <div className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <PrescriptionCard key={index} {...prescription} />
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsList;