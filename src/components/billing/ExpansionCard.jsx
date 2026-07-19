const ExpansionCard = ({ image, title, description }) => {
  return (
    <div className="relative rounded-xl overflow-hidden group min-h-[250px]">
      <img
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-teal-700/80 to-transparent flex items-end p-10">
        <div>
          <h4 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {title}
          </h4>
          <p className="text-white/80 text-sm max-w-xs">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpansionCard;