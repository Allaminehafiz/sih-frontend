const ShiftsCard = ({ onViewRota }) => {
  return (
    <div className="bg-cyan-50 p-6 rounded-xl border-l-4 border-cyan-600">
      <h4
        className="font-bold text-cyan-700 mb-2"
        style={{ fontFamily: 'Manrope, sans-serif' }}
      >
        Upcoming Shifts
      </h4>
      <p className="text-sm text-gray-500 leading-relaxed">
        Night shift rotation starts in 4 hours. 3 administrative staff on standby.
      </p>
      <button
        onClick={onViewRota}
        className="mt-4 text-xs font-bold text-cyan-700 uppercase tracking-widest hover:underline"
      >
        View Rota
      </button>
    </div>
  );
};

export default ShiftsCard;