import Icon from "../common/Icon";

const AiInsights = ({ title, description, linkLabel, onExplore }) => {
  return (
    <div className="bg-teal-50 rounded-xl p-10 flex items-start gap-8">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
        <Icon name="auto_awesome" size={36} color="#005e53" />
      </div>
      <div>
        <h4 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {title}
        </h4>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {description}
        </p>
        <button
          onClick={onExplore}
          className="text-teal-600 font-bold text-xs border-b-2 border-teal-600/20 hover:border-teal-600 transition-all pb-0.5"
        >
          {linkLabel}
        </button>
      </div>
    </div>
  );
};

export default AiInsights;