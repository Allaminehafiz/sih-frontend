import Icon from "../common/Icon";

const CareReminders = ({ reminders = [] }) => {
  return (
    <div className="relative overflow-hidden bg-teal-700 p-6 rounded-2xl text-white">
      {/* Cercle décoratif */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

      <h3 className="text-lg font-bold mb-6 relative z-10" style={{ fontFamily: 'Manrope, sans-serif' }}>
        Care Reminders
      </h3>
      <div className="space-y-4 relative z-10">
        {reminders.map((reminder, index) => (
          <div key={index} className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon name={reminder.icon} size={22} color="#a1feec" />
            </div>
            <div>
              <p className="text-xs font-bold opacity-80 uppercase">{reminder.label}</p>
              <p className="text-xl font-extrabold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {reminder.value}
                {reminder.unit && (
                  <span className="text-sm font-normal opacity-60"> {reminder.unit}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareReminders;