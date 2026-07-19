const badgeVariants = {
  primary: {
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-600",
  },
  tertiary: {
    bg: "bg-cyan-100",
    text: "text-cyan-800",
    dot: "bg-cyan-600",
  },
  slate: {
    bg: "bg-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-500",
  },
  secondary: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-600",
  },
};

const Badge = ({ label, variant = "primary", withDot = false }) => {
  const styles = badgeVariants[variant] || badgeVariants.primary;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${styles.bg} ${styles.text}`}
    >
      {withDot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>}
      {label}
    </span>
  );
};

export default Badge;