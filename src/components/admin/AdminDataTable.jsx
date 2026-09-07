import React, { useState, useMemo } from 'react';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';

/**
 * AdminDataTable - Reusable sortable / paginated table for admin list views
 *
 * Props:
 *   columns     {array}  - [{ key, label, sortable?, render? }]
 *   data        {array}  - array of row objects
 *   pageSize    {number} - rows per page (default 10)
 *   onEdit      {function}  - (row) => void (optional)
 *   onDelete    {function}  - (row) => void (optional)
 *   loading     {boolean}
 *   emptyText   {string}
 */
const AdminDataTable = ({
  columns = [],
  data = [],
  pageSize = 10,
  onEdit,
  onDelete,
  loading = false,
  emptyText = 'No records found.',
}) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);
  const hasActions = onEdit || onDelete;

  const SortIndicator = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) {
      return <span className="ml-1 text-gray-300">↕</span>;
    }
    return (
      <img
        src={chevronDownIcon}
        alt={sortDir}
        className={`inline-block w-3 h-3 ml-1 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`}
      />
    );
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 font-semibold text-gray-600 whitespace-nowrap select-none ${
                    col.sortable ? 'cursor-pointer hover:text-gray-900' : ''
                  }`}
                >
                  {col.label}
                  <SortIndicator col={col} />
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  Loading…
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-800">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <img src={editIcon} alt="Edit" className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete"
                          >
                            <img src={trashIcon} alt="Delete" className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {page} of {totalPages} &mdash; {sorted.length} record{sorted.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1.5">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      item === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDataTable;
