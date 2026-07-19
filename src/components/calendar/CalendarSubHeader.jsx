import Icon from "../common/Icon";
import Button from "../common/Button";

const views = ["Day", "Week", "Month"];

const CalendarSubHeader = ({
  currentRange = "",
  activeView = "Week",
  onViewChange,
  onPrev,
  onNext,
  onNewAppointment,
  staffAvatars = [],
}) => {
  return (
    <section className="px-8 py-6 flex items-center justify-between bg-white border-b border-gray-100">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
          <button onClick={onPrev} className="hover:text-teal-600">
            <Icon name="chevron_left" size={22} />
          </button>
          <span
            className="font-bold text-lg"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {currentRange}
          </span>
          <button onClick={onNext} className="hover:text-teal-600">
            <Icon name="chevron_right" size={22} />
          </button>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {views.map((view) => (
            <button
              key={view}
              onClick={() => onViewChange && onViewChange(view)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === view
                  ? "bg-white shadow-sm text-teal-700 font-bold"
                  : "text-gray-500 hover:text-teal-600"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {staffAvatars.slice(0, 3).map((avatar, index) => (
            <img
              key={index}
              alt={avatar.alt}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              src={avatar.src}
            />
          ))}
          {staffAvatars.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
              +{staffAvatars.length - 3}
            </div>
          )}
        </div>
        <Button
          label="New Appointment"
          icon="add"
          variant="primary"
          onClick={onNewAppointment}
          className="shadow-lg shadow-teal-700/20 hover:scale-105 transition-transform"
        />
      </div>
    </section>
  );
};

export default CalendarSubHeader;