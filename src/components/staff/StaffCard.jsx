import ActionMenu from "../common/ActionMenu";

const borderColors = {
  secondary: "border-t-blue-400",
  primary: "border-t-teal-600",
  tertiary: "border-t-cyan-500",
  gray: "border-t-gray-300",
};

const StaffCard = ({ staff, onAction, onEdit, onDelete }) => {
  const borderColor = borderColors[staff?.borderColor] || borderColors.primary;

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${borderColor}`}>
      <div className="flex justify-between items-start mb-6">
        <img
          className="w-16 h-16 rounded-lg object-cover"
          src={staff?.avatar || `https://ui-avatars.com/api/?name=Staff&background=005e53&color=fff&size=128`}
          alt={staff?.name || "Staff"}
        />
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-gray-100 rounded-md">
            <span className="text-[10px] font-bold text-gray-600">ID: {staff?.displayId || staff?.id || "N/A"}</span>
          </div>
          <ActionMenu
            onEdit={() => onEdit && onEdit(staff)}
            onDelete={() => onDelete && onDelete(staff)}
          />
        </div>
      </div>

      <h5 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {staff?.name || "Unknown"}
      </h5>
      <p className="text-sm font-medium text-gray-500 mb-4">{staff?.role || "N/A"}</p>

      <div className="space-y-3 py-4 border-y border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Availability</span>
          {staff?.isActive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
              <span className="font-bold text-teal-700">ACTIVE</span>
            </div>
          ) : (
            <span className={`font-bold ${staff?.statusColor || 'text-red-600'}`}>
              {staff?.status || "OFF DUTY"}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{staff?.infoLabel || "Info"}</span>
          <span className="font-bold text-gray-900">{staff?.infoValue || "N/A"}</span>
        </div>
      </div>

      <button
        onClick={() => onAction && onAction(staff)}
        className="w-full mt-4 py-2 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded transition-colors uppercase tracking-widest"
      >
        {staff?.actionLabel || "Profile Detail"}
      </button>
    </div>
  );
};

export default StaffCard;