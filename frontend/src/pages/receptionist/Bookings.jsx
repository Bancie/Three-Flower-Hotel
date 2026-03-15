import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiXCircle } from 'react-icons/hi';
// NEW: imports for table controls
import useTableControls from '../../hooks/useTableControls';
import TableToolbar, { SortableHeader } from '../../components/TableToolbar';

const statusColors = {
  'Đã xác nhận': 'bg-green-100 text-green-700',
  'Đang chờ': 'bg-yellow-100 text-yellow-700',
  'Đã hủy': 'bg-red-100 text-red-700',
};

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ma_khach_hang: '', ma_phong: '', ngay_nhan_phong: '', ngay_tra_phong: '' });
  const [editForm, setEditForm] = useState({ trang_thai: '' });

  const load = () => {
    api.get('/dat-phong').then((r) => setItems(r.data));
    api.get('/phong').then((r) => setRooms(r.data));
    api.get('/khach-hang').then((r) => setCustomers(r.data));
  };
  useEffect(() => { load(); }, []);

  // NEW: table controls for search, filter, sort
  const { search, setSearch, filters, setFilter, sortKey, sortDir, toggleSort, filtered } = useTableControls(items, {
    searchFields: ['ho_ten_khach', 'so_phong'],
    defaultSort: 'ma_dat_phong',
    defaultDir: 'desc',
  });

  const openCreate = () => {
    setForm({ ma_khach_hang: '', ma_phong: '', ngay_nhan_phong: '', ngay_tra_phong: '' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditForm({ trang_thai: item.trang_thai });
    setEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/dat-phong', {
      ...form,
      ma_khach_hang: parseInt(form.ma_khach_hang),
      ma_phong: parseInt(form.ma_phong),
    });
    setModal(false);
    load();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/dat-phong/${editing.ma_dat_phong}`, editForm);
    setEditModal(false);
    load();
  };

  const handleCancel = async (id) => {
    if (!confirm('Xác nhận hủy đặt phòng này?')) return;
    await api.delete(`/dat-phong/${id}`);
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Đặt phòng</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <HiPlus className="w-4 h-4" /> Tạo đặt phòng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* NEW: TableToolbar for search and filter */}
        <TableToolbar
          search={search}
          onSearch={setSearch}
          filters={filters}
          onFilter={setFilter}
          filterOptions={[
            { key: 'trang_thai', label: 'Trạng thái', options: ['Đang chờ', 'Đã xác nhận', 'Đã hủy'] },
          ]}
        />
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {/* OLD: <th className="px-5 py-3 text-left font-medium">Mã</th> */}
              <SortableHeader label="Mã" sortKey="ma_dat_phong" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Khách hàng" sortKey="ho_ten_khach" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Phòng" sortKey="so_phong" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Nhận phòng" sortKey="ngay_nhan_phong" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Trả phòng" sortKey="ngay_tra_phong" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* OLD: items.map */}
            {filtered.map((item) => (
              <tr key={item.ma_dat_phong} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">#{item.ma_dat_phong}</td>
                <td className="px-5 py-3">{item.ho_ten_khach}</td>
                <td className="px-5 py-3">{item.so_phong}</td>
                <td className="px-5 py-3">{item.ngay_nhan_phong}</td>
                <td className="px-5 py-3">{item.ngay_tra_phong}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.trang_thai] || 'bg-gray-100 text-gray-700'}`}>
                    {item.trang_thai}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><HiPencil className="w-4 h-4" /></button>
                  {item.trang_thai !== 'Đã hủy' && (
                    <button onClick={() => handleCancel(item.ma_dat_phong)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><HiXCircle className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Tạo đặt phòng mới">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng *</label>
            <select value={form.ma_khach_hang} onChange={set('ma_khach_hang')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="">-- Chọn khách hàng --</option>
              {customers.map((c) => (
                <option key={c.ma_khach_hang} value={c.ma_khach_hang}>{c.ho_ten} - {c.so_dien_thoai}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phòng *</label>
            <select value={form.ma_phong} onChange={set('ma_phong')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="">-- Chọn phòng --</option>
              {rooms.filter(r => r.trang_thai_phong === 'Trống').map((r) => (
                <option key={r.ma_phong} value={r.ma_phong}>{r.so_phong} - {r.ten_loai_phong}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận phòng *</label>
              <input type="date" value={form.ngay_nhan_phong} onChange={set('ngay_nhan_phong')} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả phòng *</label>
              <input type="date" value={form.ngay_tra_phong} onChange={set('ngay_tra_phong')} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Tạo</button>
          </div>
        </form>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Cập nhật trạng thái">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select value={editForm.trang_thai} onChange={(e) => setEditForm({ trang_thai: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="Đang chờ">Đang chờ</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Lưu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
