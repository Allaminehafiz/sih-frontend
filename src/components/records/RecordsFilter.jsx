const RecordsFilter = ({ onSearch, onFilterChange, activeFilter }) => {
  const filters = ["All Records", "Cardiology", "Radiology", "Laboratory", "General Medicine"];

  return (
    <div className="flex flex-wrap items-center gap-4 py-4">
      {/* Recherche */}
      <div className="relative flex-1 max-w-sm">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          type="text"
          placeholder="Search patient name or ID..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 outline-none"
        />
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange && onFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeFilter === filter
                ? "bg-teal-700 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecordsFilter;