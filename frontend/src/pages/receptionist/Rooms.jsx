import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

const statusColors = {
  'Trống': 'bg-green-100 text-green-700',
  'Đã đặt': 'bg-yellow-100 text-yellow-700',
  'Đang sử dụng': 'bg-blue-100 text-blue-700',
};

export default function Rooms() {
  const [items, setItems] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ so_phong: '', ma_loai_phong: '', trang_thai_phong: 'Trống' });

  const load = () => {
    api.get('/phong').then((r) => setItems(r.data));
    api.get('/loai-phong').then((r) => setRoomTypes(r.data));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ so_phong: '', ma_loai_phong: roomTypes[0]?.ma_loai_phong || '', trang_thai_phong: 'Trống' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ so_phong: item.so_phong, ma_loai_phong: item.ma_loai_phong, trang_thai_phong: item.trang_thai_phong });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, ma_loai_phong: parseInt(form.ma_loai_phong) };
    if (editing) {
      await api.put(`/phong/${editing.ma_phong}`, data);
    } else {
      await api.post('/phong', data);
    }
    setModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa phòng này?')) return;
    await api.delete(`/phong/${id}`);
    load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Phòng</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <HiPlus className="w-4 h-4" /> Thêm phòng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Mã</th>
              <th className="px-5 py-3 text-left font-medium">Số phòng</th>
              <th className="px-5 py-3 text-left font-medium">Loại phòng</th>
              <th className="px-5 py-3 text-left font-medium">Giá</th>
              <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.ma_phong} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{item.ma_phong}</td>
                <td className="px-5 py-3 font-medium">{item.so_phong}</td>
                <td className="px-5 py-3">{item.ten_loai_phong}</td>
                <td className="px-5 py-3">{item.gia_phong ? Number(item.gia_phong).toLocaleString('vi-VN') + ' ₫' : '-'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.trang_thai_phong] || 'bg-gray-100 text-gray-700'}`}>
                    {item.trang_thai_phong}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.ma_phong)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Sửa phòng' : 'Thêm phòng'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số phòng *</label>
            <input type="text" value={form.so_phong} onChange={set('so_phong')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng *</label>
            <select value={form.ma_loai_phong} onChange={set('ma_loai_phong')} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="">-- Chọn loại phòng --</option>
              {roomTypes.map((rt) => (
                <option key={rt.ma_loai_phong} value={rt.ma_loai_phong}>{rt.ten_loai_phong} - {Number(rt.gia_phong).toLocaleString('vi-VN')} ₫</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select value={form.trang_thai_phong} onChange={set('trang_thai_phong')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="Trống">Trống</option>
              <option value="Đã đặt">Đã đặt</option>
              <option value="Đang sử dụng">Đang sử dụng</option>
            </select>
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
