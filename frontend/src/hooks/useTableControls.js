import { useState, useMemo } from 'react';

export default function useTableControls(items, { searchFields = [], defaultSort = '', defaultDir = 'asc' } = {}) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(defaultSort);
  const [sortDir, setSortDir] = useState(defaultDir);

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...items];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((f) => String(item[f] ?? '').toLowerCase().includes(q))
      );
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value) result = result.filter((item) => String(item[key]) === value);
    }

    if (sortKey) {
      result.sort((a, b) => {
        let va = a[sortKey] ?? '';
        let vb = b[sortKey] ?? '';
        if (typeof va === 'string' && typeof vb === 'string') {
          return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        va = Number(va) || 0;
        vb = Number(vb) || 0;
        return sortDir === 'asc' ? va - vb : vb - va;
      });
    }

    return result;
  }, [items, search, filters, sortKey, sortDir, searchFields]);

  return { search, setSearch, filters, setFilter, sortKey, sortDir, toggleSort, filtered };
}
