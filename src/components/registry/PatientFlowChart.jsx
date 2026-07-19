import Icon from "../common/Icon";

const bars = [
  { height: "40%", hoverHeight: "50%", color: "bg-teal-600/10" },
  { height: "60%", hoverHeight: "75%", color: "bg-teal-600/15" },
  { height: "55%", hoverHeight: "65%", color: "bg-teal-600/20" },
  { height: "80%", hoverHeight: "90%", color: "bg-teal-600/10" },
  { height: "70%", hoverHeight: "85%", color: "bg-teal-600/30" },
  { height: "50%", hoverHeight: "60%", color: "bg-teal-600/10" },
  { height: "95%", hoverHeight: "100%", color: "bg-teal-600/40" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PatientFlowChart = () => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <h3
        className="text-xl font-bold flex items-center gap-2"
        style={{ fontFamily: 'Manrope, sans-serif' }}
      >
        <Icon name="analytics" size={24} color="#005e53" />
        Patient Flow Trend
      </h3>
      <div className="h-64 bg-gray-100 rounded-2xl flex items-end p-8 gap-4 overflow-hidden relative group">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`w-full ${bar.color} rounded-t-xl transition-all group-hover:h-[${bar.hoverHeight}]`}
            style={{ height: bar.height }}
          ></div>
        ))}
        <div className="absolute inset-x-8 bottom-4 flex justify-between text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          {days.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientFlowChart;