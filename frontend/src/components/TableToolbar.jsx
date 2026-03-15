import { HiSearch, HiFilter } from 'react-icons/hi';

export default function TableToolbar({ search, onSearch, filterOptions = [], filters = {}, onFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Tìm kiếm..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>
      {filterOptions.map((f) => (
        <div key={f.key} className="flex items-center gap-1.5">
          <HiFilter className="w-4 h-4 text-gray-400" />
          <select
            value={filters[f.key] || ''}
            onChange={(e) => onFilter(f.key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export function SortableHeader({ label, sortKey, currentSort, currentDir, onSort, className = '' }) {
  const active = currentSort === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`px-5 py-3 text-left font-medium cursor-pointer select-none hover:bg-gray-100 transition-colors ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          <span className="text-primary-600">{currentDir === 'asc' ? '↑' : '↓'}</span>
        ) : (
          <span className="text-gray-300">↕</span>
        )}
      </span>
    </th>
  );
}
