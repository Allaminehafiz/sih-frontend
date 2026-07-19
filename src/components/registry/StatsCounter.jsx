import Icon from "../common/Icon";

const StatsCounter = ({ value, label, trend, icon }) => {
  return (
    <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 flex justify-between items-center relative overflow-hidden group">
      <div className="z-10">
        <p className="text-gray-500 text-sm font-semibold mb-1">{label}</p>
        <h3 className="text-5xl font-extrabold text-teal-700 tracking-tighter">{value}</h3>
        {trend && (
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full w-fit">
            <Icon name="trending_up" size={16} />
            {trend}
          </div>
        )}
      </div>
      <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
        <Icon name={icon} size={120} />
      </div>
    </div>
  );
};

export default StatsCounter;