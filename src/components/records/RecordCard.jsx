import Icon from "../common/Icon";
import ActionMenu from "../common/ActionMenu";

const RecordCard = ({ record, onClick, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onClick}>
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
            <Icon name="folder" size={24} color="#005e53" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {record.patientName}
            </h4>
            <p className="text-xs text-gray-500">ID: {record.patientIdDisplay}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-teal-50 text-teal-700">
            {record.status}
          </span>
          <ActionMenu
            onEdit={() => onEdit && onEdit(record)}
            onDelete={() => onDelete && onDelete(record)}
          />
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4 cursor-pointer" onClick={onClick}>
        <div className="flex justify-between">
          <span>Department:</span>
          <span className="font-medium">{record.department}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Consult.:</span>
          <span className="font-medium">{record.lastUpdated}</span>
        </div>
        <div className="flex justify-between">
          <span>Physician:</span>
          <span className="font-medium">{record.physician}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500 italic">
          {record.diagnosis?.length > 60
            ? record.diagnosis.substring(0, 60) + "..."
            : record.diagnosis}
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-4 border-t border-gray-50 cursor-pointer"
        onClick={onClick}
      >
        <span className="text-xs text-teal-600 font-bold group-hover:underline">
          View Patient
        </span>
        <Icon name="arrow_forward" size={16} color="#005e53" />
      </div>
    </div>
  );
};

export default RecordCard;