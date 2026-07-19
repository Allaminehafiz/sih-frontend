import DayColumn from "./DayColumn";

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

const CalendarGrid = ({ appointmentsByDay = {}, weekDates = [], patients = [], onAppointmentClick }) => {
  return (
    <div className="flex-1 overflow-auto relative p-8">
      <div className="min-w-[1200px] bg-white rounded-[2rem] shadow-sm border border-gray-200 flex flex-col h-full">
        {/* En-tête des jours */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-100">
          <div className="h-16 flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest border-r border-gray-100">
            GMT-5
          </div>
          {weekDates.map((d, index) => (
            <div
              key={index}
              className={`h-16 flex flex-col items-center justify-center gap-1 border-r border-gray-100 ${
                d.isToday ? "bg-teal-50" : d.isWeekend ? "bg-gray-50" : ""
              } ${index === 6 ? "border-r-0" : ""}`}
            >
              <span
                className={`text-xs font-bold uppercase ${
                  d.isToday ? "text-teal-700" : d.isWeekend ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {d.day}
              </span>
              <span
                className={`text-xl font-bold ${
                  d.isToday ? "text-teal-700" : d.isWeekend ? "text-gray-400" : "text-gray-900"
                }`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                {d.date}
              </span>
            </div>
          ))}
        </div>

        {/* Grille horaire */}
        <div className="relative flex-1 overflow-y-auto">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] min-h-[1000px]">
            {/* Colonne des heures */}
            <div className="flex flex-col border-r border-gray-100">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-16 flex items-start justify-center pt-2 text-xs font-bold text-gray-500"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Colonnes des jours */}
            {weekDates.map((d, index) => (
              <DayColumn
                key={index}
                day={d.day}
                date={d.date}
                isToday={d.isToday}
                isWeekend={d.isWeekend}
                appointments={appointmentsByDay[d.day] || []}
                patients={patients}
                onAppointmentClick={onAppointmentClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;