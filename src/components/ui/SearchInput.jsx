import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchInput = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search...',
  className = '',
}) => (
  <div className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}>
    <div className="relative flex-1">
      <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch()}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink-200 bg-ink-50 py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </div>
    <div className="flex gap-2">
      {onSearch && (
        <button
          onClick={onSearch}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
        >
          Search
        </button>
      )}
      {onClear && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50"
        >
          <FaTimes className="text-xs" /> Clear
        </button>
      )}
    </div>
  </div>
);

export default SearchInput;
