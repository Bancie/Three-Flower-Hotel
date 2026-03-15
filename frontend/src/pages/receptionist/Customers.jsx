import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
// new code: table controls imports
import useTableControls from '../../hooks/useTableControls';
import TableToolbar, { SortableHeader } from '../../components/TableToolbar';

export default function Customers() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ho_ten: '', so_dien_thoai: '', email: '', so_giay_to: '' });

  const load = () => api.get('/khach-hang').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  // new code: table controls for search and sort
  const { search, setSearch, sortKey, sortDir, toggleSort, filtered } = useTableControls(items, {
    searchFields: ['ho_ten', 'so_dien_thoai', 'email', 'so_giay_to'],
    defaultSort: 'ma_khach_hang',
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ho_ten: '', so_dien_thoai: '', email: '', so_giay_to: '' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ho_ten: item.ho_ten, so_dien_thoai: item.so_dien_thoai || '', email: item.email || '', so_giay_to: item.so_giay_to || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/khach-hang/${editing.ma_khach_hang}`, form);
    } else {
      await api.post('/khach-hang', form);
    }
    setModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa khách hàng này?')) return;
    await api.delete(`/khach-hang/${id}`);
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Khách hàng</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <HiPlus className="w-4 h-4" /> Thêm khách hàng
        </button>
      </div>

      {/* new code: search toolbar */}
      <TableToolbar search={search} onSearch={setSearch} />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {/* old: <th className="px-5 py-3 text-left font-medium">Mã</th> */}
              {/* new code: sortable headers */}
              <SortableHeader label="Mã" sortKey="ma_khach_hang" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              {/* old: <th className="px-5 py-3 text-left font-medium">Họ tên</th> */}
              <SortableHeader label="Họ tên" sortKey="ho_ten" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              {/* old: <th className="px-5 py-3 text-left font-medium">SĐT</th> */}
              <SortableHeader label="SĐT" sortKey="so_dien_thoai" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              {/* old: <th className="px-5 py-3 text-left font-medium">Email</th> */}
              <SortableHeader label="Email" sortKey="email" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <th className="px-5 py-3 text-left font-medium">Giấy tờ</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* old: {items.map((item) => ( */}
            {filtered.map((item) => (
              <tr key={item.ma_khach_hang} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{item.ma_khach_hang}</td>
                <td className="px-5 py-3">{item.ho_ten}</td>
                <td className="px-5 py-3">{item.so_dien_thoai}</td>
                <td className="px-5 py-3">{item.email}</td>
                <td className="px-5 py-3">{item.so_giay_to}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.ma_khach_hang)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Sửa khách hàng' : 'Thêm khách hàng'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
            <input type="text" value={form.ho_ten} onChange={set('ho_ten')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label>
              <input type="text" value={form.so_dien_thoai} onChange={set('so_dien_thoai')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giấy tờ</label>
              <input type="text" value={form.so_giay_to} onChange={set('so_giay_to')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={set('email')}
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
