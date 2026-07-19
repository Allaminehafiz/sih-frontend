import Icon from "../common/Icon";

const PatientCoordination = ({ actions = [] }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
        Patient Coordination
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all group"
          >
            <span className="text-sm font-semibold flex items-center gap-3">
              <Icon name={action.icon} size={20} color="#4c616c" />
              {action.label}
            </span>
            <Icon name="chevron_right" size={18} color="#6e7a76" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatientCoordination;