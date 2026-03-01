import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Modal from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

const statusColors = {
  'Trống': 'bg-green-100 text-green-700 border-green-200',
  'Đã đặt': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Đang sử dụng': 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function BrowseRooms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ ngay_nhan_phong: '', ngay_tra_phong: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/phong').then((r) => setRooms(r.data));
  }, []);

  const filtered = filter === 'all' ? rooms : rooms.filter((r) => r.trang_thai_phong === filter);

  const openBooking = (room) => {
    setSelected(room);
    setForm({ ngay_nhan_phong: '', ngay_tra_phong: '' });
    setError('');
    setModal(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/dat-phong', {
        ma_khach_hang: user.ma_khach_hang,
        ma_phong: selected.ma_phong,
        ngay_nhan_phong: form.ngay_nhan_phong,
        ngay_tra_phong: form.ngay_tra_phong,
      });
      setModal(false);
      navigate('/khach-hang/dat-phong');
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể đặt phòng');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tìm phòng</h2>
        <div className="flex gap-2">
          {[['all', 'Tất cả'], ['Trống', 'Trống'], ['Đã đặt', 'Đã đặt'], ['Đang sử dụng', 'Đang SD']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === val ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room) => (
          <div key={room.ma_phong} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 text-white">
              <div className="flex items-center gap-3">
                <HiOutlineOfficeBuilding className="w-8 h-8 opacity-80" />
                <div>
                  <h3 className="text-lg font-bold">{room.so_phong}</h3>
                  <p className="text-sm opacity-90">{room.ten_loai_phong}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">
                  {room.gia_phong ? Number(room.gia_phong).toLocaleString('vi-VN') + ' ₫' : '-'}
                </span>
                <span className="text-xs text-gray-500">/ đêm</span>
              </div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[room.trang_thai_phong] || 'bg-gray-100 text-gray-700'}`}>
                {room.trang_thai_phong}
              </span>
              {room.trang_thai_phong === 'Trống' && (
                <button
                  onClick={() => openBooking(room)}
                  className="w-full mt-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Đặt phòng ngay
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">Không có phòng phù hợp</div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={`Đặt phòng ${selected?.so_phong}`}>
        <form onSubmit={handleBook} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p><strong>Phòng:</strong> {selected?.so_phong} - {selected?.ten_loai_phong}</p>
            <p><strong>Giá:</strong> {selected?.gia_phong ? Number(selected.gia_phong).toLocaleString('vi-VN') + ' ₫/đêm' : '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận phòng *</label>
            <input
              type="date"
              value={form.ngay_nhan_phong}
              onChange={(e) => setForm({ ...form, ngay_nhan_phong: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả phòng *</label>
            <input
              type="date"
              value={form.ngay_tra_phong}
              onChange={(e) => setForm({ ...form, ngay_tra_phong: e.target.value })}
              required
              min={form.ngay_nhan_phong || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Xác nhận đặt</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
