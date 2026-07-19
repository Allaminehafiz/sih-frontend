const FilterBar = ({ filters = [], activeFilter, onFilterChange, totalPatients, showingRange }) => {
  return (
    <section className="flex flex-wrap items-center gap-4 py-2">
      {filters.map((filter, index) => (
        <button
          key={index}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
            activeFilter === filter
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-500 hover:text-teal-600"
          }`}
        >
          {index === 0 && <span className="material-symbols-outlined text-sm">filter_list</span>}
          {filter}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-4">
        <p className="text-xs text-gray-400 italic">
          Showing {showingRange} of {totalPatients} patients
        </p>
      </div>
    </section>
  );
};

export default FilterBar;