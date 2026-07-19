import Icon from "../common/Icon";

const PageHeader = ({ title, description, buttonLabel, buttonIcon, onButtonClick, showButton = true }) => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1
          className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          {title}
        </h1>
        <p className="text-gray-500 max-w-xl text-lg">{description}</p>
      </div>
      {showButton && (
        <button
          onClick={onButtonClick}
          className="bg-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          <Icon name={buttonIcon} size={20} />
          {buttonLabel}
        </button>
      )}
    </section>
  );
};

export default PageHeader;