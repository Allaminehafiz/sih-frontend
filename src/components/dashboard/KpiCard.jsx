import Icon from "../common/Icon";

const colorStyles = {
  primary: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    trend: "text-teal-600",
  },
  tertiary: {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    trend: "text-cyan-600",
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-600",
    trend: "text-red-600",
  },
};

const KpiCard = ({ title, value, trend, subtitle, icon, color = "primary" }) => {
  const styles = colorStyles[color] || colorStyles.primary;

  return (
    <div className="bg-white p-6 rounded-xl relative overflow-hidden group border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <Icon name={icon} size={60} color={styles.text} />
      </div>

      <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
        {title}
      </p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {value}
        </span>
        <span className={`text-sm font-bold ${styles.trend}`}>
          {trend}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2 italic">{subtitle}</p>
    </div>
  );
};

export default KpiCard;