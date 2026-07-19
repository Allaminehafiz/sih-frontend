const filters = [
  { label: "Medical Staff", id: "medical" },
  { label: "Administrative", id: "admin" },
  { label: "Laboratory", id: "lab" },
];

const QuickFilters = ({ selected = "medical", onSelect }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-xl">
      <h4
        className="font-bold text-gray-900 mb-4"
        style={{ fontFamily: 'Manrope, sans-serif' }}
      >
        Quick Filters
      </h4>
      <div className="space-y-4">
        {filters.map((filter) => (
          <label
            key={filter.id}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelect && onSelect(filter.id)}
          >
            <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-teal-600 transition-colors flex items-center justify-center">
              {selected === filter.id && (
                <div className="w-2.5 h-2.5 bg-teal-600 rounded-sm"></div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-600">{filter.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;