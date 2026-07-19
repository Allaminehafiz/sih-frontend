const StatCard = ({ title, value, subtitle, color = "default", progress = null }) => {
  const styles = {
    default: {
      bg: "bg-gray-100",
      text: "text-gray-900",
      subtext: "text-gray-500",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-700",
      subtext: "text-red-500",
    },
  };

  const currentStyle = styles[color] || styles.default;

  return (
    <div className={`${currentStyle.bg} rounded-xl p-6 flex flex-col justify-center`}>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </p>
      <h4
        className={`text-2xl font-bold ${currentStyle.text}`}
        style={{ fontFamily: 'Manrope, sans-serif' }}
      >
        {value}
      </h4>

      {progress !== null && (
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-cyan-600 h-full rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {subtitle && (
        <p className={`text-[10px] mt-2 ${currentStyle.subtext}`}>{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;