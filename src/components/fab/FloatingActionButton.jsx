import Icon from "../common/Icon";

const FloatingActionButton = ({ onClick, icon = "add" }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-[#005e53] text-white shadow-lg hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center"
    >
      <Icon name={icon} size={28} color="white" />
    </button>
  );
};

export default FloatingActionButton;