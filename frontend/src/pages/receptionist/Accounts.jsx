import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
// new code: imports for table controls
import useTableControls from '../../hooks/useTableControls';
import TableToolbar, { SortableHeader } from '../../components/TableToolbar';

export default function Accounts() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ten_dang_nhap: '', mat_khau: '', vai_tro: 'le_tan' });
  const [editForm, setEditForm] = useState({ vai_tro: '', trang_thai: '' });

  const load = () => api.get('/tai-khoan').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  // new code: table controls for search, filter, sort
  const { search, setSearch, filters, setFilter, sortKey, sortDir, toggleSort, filtered } = useTableControls(items, {
    searchFields: ['ten_dang_nhap', 'ho_ten'],
    defaultSort: 'ma_tai_khoan',
  });

  const openCreate = () => {
    setForm({ ten_dang_nhap: '', mat_khau: '', vai_tro: 'le_tan' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditForm({ vai_tro: item.vai_tro, trang_thai: item.trang_thai });
    setEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/tai-khoan', form);
    setModal(false);
    load();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/tai-khoan/${editing.ma_tai_khoan}`, editForm);
    setEditModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa tài khoản này?')) return;
    await api.delete(`/tai-khoan/${id}`);
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const roleLabel = { le_tan: 'Lễ tân', khach_hang: 'Khách hàng' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Tài khoản</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <HiPlus className="w-4 h-4" /> Thêm tài khoản
        </button>
      </div>

      {/* new code: TableToolbar for search and filters */}
      <TableToolbar
        search={search}
        onSearch={setSearch}
        filters={filters}
        onFilter={setFilter}
        filterOptions={[
          { key: 'vai_tro', label: 'Vai trò', options: ['le_tan', 'khach_hang'] },
          { key: 'trang_thai', label: 'Trạng thái', options: ['Hoạt động', 'Vô hiệu hóa'] },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {/* old code: <th className="px-5 py-3 text-left font-medium">Mã</th> */}
              {/* new code: sortable headers for Mã, Tên đăng nhập, Họ tên */}
              <SortableHeader label="Mã" sortKey="ma_tai_khoan" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              {/* old code: <th className="px-5 py-3 text-left font-medium">Tên đăng nhập</th> */}
              <SortableHeader label="Tên đăng nhập" sortKey="ten_dang_nhap" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              {/* old code: <th className="px-5 py-3 text-left font-medium">Họ tên</th> */}
              <SortableHeader label="Họ tên" sortKey="ho_ten" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              {/* Vai trò, Trạng thái, Thao tác stay as regular th */}
              <th className="px-5 py-3 text-left font-medium">Vai trò</th>
              <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* old code: {items.map((item) => ( */}
            {/* new code: use filtered instead of items */}
            {filtered.map((item) => (
              <tr key={item.ma_tai_khoan} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{item.ma_tai_khoan}</td>
                <td className="px-5 py-3">{item.ten_dang_nhap}</td>
                <td className="px-5 py-3">{item.ho_ten}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.vai_tro === 'le_tan' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {roleLabel[item.vai_tro] || item.vai_tro}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.trang_thai === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.trang_thai}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.ma_tai_khoan)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Thêm tài khoản">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập *</label>
            <input type="text" value={form.ten_dang_nhap} onChange={set('ten_dang_nhap')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
            <input type="password" value={form.mat_khau} onChange={set('mat_khau')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select value={form.vai_tro} onChange={set('vai_tro')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="le_tan">Lễ tân</option>
              <option value="khach_hang">Khách hàng</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Tạo</button>
          </div>
        </form>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Cập nhật tài khoản">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select value={editForm.vai_tro} onChange={(e) => setEditForm({ ...editForm, vai_tro: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="le_tan">Lễ tân</option>
              <option value="khach_hang">Khách hàng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select value={editForm.trang_thai} onChange={(e) => setEditForm({ ...editForm, trang_thai: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="Hoạt động">Hoạt động</option>
              <option value="Vô hiệu hóa">Vô hiệu hóa</option>
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
