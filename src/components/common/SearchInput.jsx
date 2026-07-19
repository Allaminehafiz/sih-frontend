import Icon from "./Icon";

const SearchInput = ({ placeholder = "Search...", value, onChange }) => {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon name="search" size={20} />
      </span>
      <input
        className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-[#005e53]/20 placeholder:text-gray-400 outline-none"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;