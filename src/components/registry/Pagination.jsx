import Icon from "../common/Icon";

const Pagination = ({ currentPage = 1, totalPages = 3, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="p-8 flex justify-center bg-white">
      <nav className="flex gap-2">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Icon name="chevron_left" size={22} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
              page === currentPage
                ? "bg-teal-700 text-white font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Icon name="chevron_right" size={22} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;