import Icon from "../common/Icon";

const WeeklySummary = ({ satisfactionChange = "4.2%", successRate = "98.4" }) => {
  return (
    <div className="bg-[#005e53] p-6 rounded-2xl relative overflow-hidden text-white">
      <div className="relative z-10">
        <h4 className="text-lg font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Weekly Summary
        </h4>
        <p className="text-sm text-teal-200 mb-6">
          Patient satisfaction is up {satisfactionChange} from last week. Keep up the precision care!
        </p>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
            <Icon name="trending_up" size={24} color="white" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-widest text-teal-200">Success Rate</p>
            <p className="text-xl font-bold">{successRate}%</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16"></div>
    </div>
  );
};

export default WeeklySummary;