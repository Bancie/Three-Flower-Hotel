import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function Invoices() {
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ma_dat_phong: '' });
  const [editForm, setEditForm] = useState({ tong_tien: '' });

  const load = () => {
    api.get('/hoa-don').then((r) => setItems(r.data));
    api.get('/dat-phong').then((r) => setBookings(r.data));
  };
  useEffect(() => { load(); }, []);

  const existingBookingIds = new Set(items.map((i) => i.ma_dat_phong));
  const availableBookings = bookings.filter(
    (b) => !existingBookingIds.has(b.ma_dat_phong) && b.trang_thai !== 'Đã hủy'
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/hoa-don', { ma_dat_phong: parseInt(form.ma_dat_phong) });
    setModal(false);
    load();
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditForm({ tong_tien: item.tong_tien });
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/hoa-don/${editing.ma_hoa_don}`, { tong_tien: parseFloat(editForm.tong_tien) });
    setEditModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa hóa đơn này?')) return;
    await api.delete(`/hoa-don/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Hóa đơn</h2>
        <button onClick={() => { setForm({ ma_dat_phong: '' }); setModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <HiPlus className="w-4 h-4" /> Lập hóa đơn
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Mã HĐ</th>
              <th className="px-5 py-3 text-left font-medium">Mã ĐP</th>
              <th className="px-5 py-3 text-left font-medium">Khách hàng</th>
              <th className="px-5 py-3 text-left font-medium">Phòng</th>
              <th className="px-5 py-3 text-left font-medium">Tổng tiền</th>
              <th className="px-5 py-3 text-left font-medium">Ngày lập</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.ma_hoa_don} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">#{item.ma_hoa_don}</td>
                <td className="px-5 py-3">#{item.ma_dat_phong}</td>
                <td className="px-5 py-3">{item.ho_ten_khach}</td>
                <td className="px-5 py-3">{item.so_phong}</td>
                <td className="px-5 py-3 font-medium">{Number(item.tong_tien).toLocaleString('vi-VN')} ₫</td>
                <td className="px-5 py-3">{item.ngay_lap}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.ma_hoa_don)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Lập hóa đơn">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đặt phòng *</label>
            <select value={form.ma_dat_phong} onChange={(e) => setForm({ ma_dat_phong: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="">-- Chọn đặt phòng --</option>
              {availableBookings.map((b) => (
                <option key={b.ma_dat_phong} value={b.ma_dat_phong}>
                  #{b.ma_dat_phong} - {b.ho_ten_khach} - {b.so_phong}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500">Tổng tiền sẽ được tính tự động dựa trên loại phòng và số đêm lưu trú.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Lập hóa đơn</button>
          </div>
        </form>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Cập nhật hóa đơn">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền (VNĐ)</label>
            <input type="number" value={editForm.tong_tien} onChange={(e) => setEditForm({ tong_tien: e.target.value })} required min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
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
