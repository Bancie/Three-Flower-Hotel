import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
// NEW: imports for search, filter, sortable table
import useTableControls from '../../hooks/useTableControls';
import TableToolbar, { SortableHeader } from '../../components/TableToolbar';

export default function RoomTypes() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ten_loai_phong: '', gia_phong: '', mo_ta: '' });

  const load = () => api.get('/loai-phong').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  // NEW: table controls for search and sort
  const { search, setSearch, sortKey, sortDir, toggleSort, filtered } = useTableControls(items, {
    searchFields: ['ten_loai_phong', 'mo_ta'],
    defaultSort: 'ma_loai_phong',
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ten_loai_phong: '', gia_phong: '', mo_ta: '' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ten_loai_phong: item.ten_loai_phong, gia_phong: item.gia_phong, mo_ta: item.mo_ta || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, gia_phong: parseFloat(form.gia_phong) };
    if (editing) {
      await api.put(`/loai-phong/${editing.ma_loai_phong}`, data);
    } else {
      await api.post('/loai-phong', data);
    }
    setModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa loại phòng này?')) return;
    await api.delete(`/loai-phong/${id}`);
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Loại phòng</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <HiPlus className="w-4 h-4" /> Thêm loại phòng
        </button>
      </div>

      {/* NEW: search toolbar */}
      <TableToolbar search={search} onSearch={setSearch} />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {/* OLD: <th className="px-5 py-3 text-left font-medium">Mã</th> */}
              <SortableHeader label="Mã" sortKey="ma_loai_phong" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} className="text-left" />
              {/* OLD: <th className="px-5 py-3 text-left font-medium">Tên loại phòng</th> */}
              <SortableHeader label="Tên loại phòng" sortKey="ten_loai_phong" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} className="text-left" />
              {/* OLD: <th className="px-5 py-3 text-left font-medium">Giá phòng</th> */}
              <SortableHeader label="Giá phòng" sortKey="gia_phong" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} className="text-left" />
              <th className="px-5 py-3 text-left font-medium">Mô tả</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* OLD: items.map */}
            {filtered.map((item) => (
              <tr key={item.ma_loai_phong} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{item.ma_loai_phong}</td>
                <td className="px-5 py-3">{item.ten_loai_phong}</td>
                <td className="px-5 py-3">{Number(item.gia_phong).toLocaleString('vi-VN')} ₫</td>
                <td className="px-5 py-3 text-gray-500">{item.mo_ta}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.ma_loai_phong)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Sửa loại phòng' : 'Thêm loại phòng'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại phòng *</label>
            <input type="text" value={form.ten_loai_phong} onChange={set('ten_loai_phong')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá phòng (VNĐ) *</label>
            <input type="number" value={form.gia_phong} onChange={set('gia_phong')} required min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <input type="text" value={form.mo_ta} onChange={set('mo_ta')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Lưu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
