import Icon from "../common/Icon";

const iconStyles = {
  primary: { bg: "bg-teal-100", text: "text-teal-600" },
  tertiary: { bg: "bg-cyan-100", text: "text-cyan-600" },
  error: { bg: "bg-red-100", text: "text-red-600" },
};

const ActivityItem = ({ icon, iconColor = "primary", action, patientName, timeAgo }) => {
  const styles = iconStyles[iconColor] || iconStyles.primary;

  return (
    <div className="flex gap-4">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${styles.bg}`}>
        <Icon name={icon} size={20} color={styles.text} />
      </div>
      <div>
        <p className="text-sm text-gray-800 leading-tight font-medium">
          {action} <span className="font-bold">{patientName}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
      </div>
    </div>
  );
};

export default ActivityItem;