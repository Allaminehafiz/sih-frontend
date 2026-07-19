import Icon from "../common/Icon";
import ScheduleItem from "./ScheduleItem";

const TodaySchedule = ({ appointments = [] }) => {
  return (
    <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-10">
        <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Today's Schedule
        </h4>
        <button className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:underline">
          View Calendar
          <Icon name="chevron_right" size={18} />
        </button>
      </div>

      <div className="space-y-6">
        {appointments.map((appointment, index) => (
          <ScheduleItem key={index} {...appointment} />
        ))}

        {/* Ligne NOW */}
        <div className="flex gap-6 items-center">
          <div className="w-16 text-right">
            <span className="text-xs font-bold text-red-500">NOW</span>
          </div>
          <div className="flex-1 border-t border-dashed border-red-500 relative">
            <div className="absolute -top-1.5 left-0 h-3 w-3 bg-red-500 rounded-full ring-4 ring-red-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaySchedule;