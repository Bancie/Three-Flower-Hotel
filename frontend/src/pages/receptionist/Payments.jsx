import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
// new code: table controls imports
import useTableControls from '../../hooks/useTableControls';
import TableToolbar, { SortableHeader } from '../../components/TableToolbar';

const statusColors = {
  'Đã thanh toán': 'bg-green-100 text-green-700',
  'Chờ thanh toán': 'bg-yellow-100 text-yellow-700',
  'Đã hủy': 'bg-red-100 text-red-700',
};

export default function Payments() {
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ma_hoa_don: '', phuong_thuc: 'Tiền mặt', so_tien: '' });
  const [editForm, setEditForm] = useState({ trang_thai: '', phuong_thuc: '' });

  const load = () => {
    api.get('/thanh-toan').then((r) => setItems(r.data));
    api.get('/hoa-don').then((r) => setInvoices(r.data));
  };
  useEffect(() => { load(); }, []);

  // new code: table controls for search, filter, sort
  const { search, setSearch, filters, setFilter, sortKey, sortDir, toggleSort, filtered } = useTableControls(items, {
    searchFields: ['ma_hoa_don', 'phuong_thuc'],
    defaultSort: 'ma_thanh_toan',
    defaultDir: 'desc',
  });

  const openCreate = () => {
    setForm({ ma_hoa_don: '', phuong_thuc: 'Tiền mặt', so_tien: '' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditForm({ trang_thai: item.trang_thai, phuong_thuc: item.phuong_thuc });
    setEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/thanh-toan', {
      ma_hoa_don: parseInt(form.ma_hoa_don),
      phuong_thuc: form.phuong_thuc,
      so_tien: parseFloat(form.so_tien),
    });
    setModal(false);
    load();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/thanh-toan/${editing.ma_thanh_toan}`, editForm);
    setEditModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa thanh toán này?')) return;
    await api.delete(`/thanh-toan/${id}`);
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Thanh toán</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <HiPlus className="w-4 h-4" /> Thêm thanh toán
        </button>
      </div>

      {/* new code: TableToolbar for search and filters */}
      <TableToolbar
        search={search}
        onSearch={setSearch}
        filters={filters}
        onFilter={setFilter}
        filterOptions={[
          { key: 'trang_thai', label: 'Trạng thái', options: ['Đã thanh toán', 'Chờ thanh toán', 'Đã hủy'] },
          { key: 'phuong_thuc', label: 'Phương thức', options: ['Tiền mặt', 'Chuyển khoản', 'Thẻ tín dụng'] },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {/* new code: sortable headers for Mã TT, Mã HĐ, Ngày TT, Số tiền */}
              <SortableHeader label="Mã TT" sortKey="ma_thanh_toan" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Mã HĐ" sortKey="ma_hoa_don" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Ngày TT" sortKey="ngay_thanh_toan" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <th className="px-5 py-3 text-left font-medium">Phương thức</th>
              <SortableHeader label="Số tiền" sortKey="so_tien" currentSort={sortKey} currentDir={sortDir} onSort={toggleSort} />
              <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item) => (
              <tr key={item.ma_thanh_toan} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">#{item.ma_thanh_toan}</td>
                <td className="px-5 py-3">#{item.ma_hoa_don}</td>
                <td className="px-5 py-3">{item.ngay_thanh_toan}</td>
                <td className="px-5 py-3">{item.phuong_thuc}</td>
                <td className="px-5 py-3 font-medium">{Number(item.so_tien).toLocaleString('vi-VN')} ₫</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.trang_thai] || 'bg-gray-100 text-gray-700'}`}>
                    {item.trang_thai}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.ma_thanh_toan)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Thêm thanh toán">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hóa đơn *</label>
            <select value={form.ma_hoa_don} onChange={set('ma_hoa_don')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="">-- Chọn hóa đơn --</option>
              {invoices.map((inv) => (
                <option key={inv.ma_hoa_don} value={inv.ma_hoa_don}>
                  #{inv.ma_hoa_don} - {inv.ho_ten_khach} - {Number(inv.tong_tien).toLocaleString('vi-VN')} ₫
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức *</label>
            <select value={form.phuong_thuc} onChange={set('phuong_thuc')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
              <option value="Thẻ tín dụng">Thẻ tín dụng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ) *</label>
            <input type="number" value={form.so_tien} onChange={set('so_tien')} required min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Thanh toán</button>
          </div>
        </form>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Cập nhật thanh toán">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức</label>
            <select value={editForm.phuong_thuc} onChange={(e) => setEditForm({ ...editForm, phuong_thuc: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
              <option value="Thẻ tín dụng">Thẻ tín dụng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select value={editForm.trang_thai} onChange={(e) => setEditForm({ ...editForm, trang_thai: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Chờ thanh toán">Chờ thanh toán</option>
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
