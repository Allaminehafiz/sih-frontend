import Icon from "../common/Icon";

const RevenueCard = ({ amount = "$142,850.00", growth = "12.4%" }) => {
  return (
    <div className="md:col-span-2 bg-white rounded-xl p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden group">
      {/* Contenu principal */}
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Monthly Revenue</p>
            <h3 className="text-5xl font-extrabold text-teal-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {amount}
            </h3>
          </div>
          <div className="flex items-center text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <Icon name="trending_up" size={16} />
            {growth}
          </div>
        </div>
      </div>

      {/* Graphique simplifié */}
      <div className="mt-8 flex items-end gap-1 h-24 relative z-10">
        <div className="flex-1 bg-teal-600/10 h-1/2 rounded-t-sm"></div>
        <div className="flex-1 bg-teal-600/15 h-3/4 rounded-t-sm"></div>
        <div className="flex-1 bg-teal-600/20 h-2/3 rounded-t-sm"></div>
        <div className="flex-1 bg-teal-600/25 h-full rounded-t-sm"></div>
        <div className="flex-1 bg-teal-600/30 h-4/5 rounded-t-sm"></div>
        <div className="flex-1 bg-teal-600/40 h-5/6 rounded-t-sm"></div>
        <div className="flex-1 bg-teal-700 h-full rounded-t-sm"></div>
      </div>

      {/* Icône décorative */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Icon name="payments" size={120} />
      </div>
    </div>
  );
};

export default RevenueCard;