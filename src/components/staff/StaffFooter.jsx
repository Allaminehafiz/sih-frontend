const stats = [
  { label: "Medical", value: 28, width: "65%", color: "bg-teal-600" },
  { label: "Support", value: 9, width: "30%", color: "bg-cyan-600" },
  { label: "On Call", value: 5, width: "15%", color: "bg-blue-600" },
  { label: "Training", value: 2, width: "10%", color: "bg-red-600" },
];

const StaffFooter = () => {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            {stat.label}
          </p>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${stat.color} rounded-full`}
              style={{ width: stat.width }}
            ></div>
          </div>
          <p
            className="text-sm font-bold text-gray-900 mt-2"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {stat.value} Personnel
          </p>
        </div>
      ))}
    </footer>
  );
};

export default StaffFooter;