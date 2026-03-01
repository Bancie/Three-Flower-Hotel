import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiXCircle } from 'react-icons/hi';

const statusColors = {
  'Đã xác nhận': 'bg-green-100 text-green-700',
  'Đang chờ': 'bg-yellow-100 text-yellow-700',
  'Đã hủy': 'bg-red-100 text-red-700',
};

export default function MyBookings() {
  const [items, setItems] = useState([]);

  const load = () => api.get('/dat-phong').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc muốn hủy đặt phòng này?')) return;
    await api.delete(`/dat-phong/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đặt phòng của tôi</h2>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <p className="text-gray-400 text-lg">Bạn chưa có đặt phòng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((b) => (
            <div key={b.ma_dat_phong} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Phòng {b.so_phong}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.trang_thai] || 'bg-gray-100 text-gray-700'}`}>
                      {b.trang_thai}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Mã đặt phòng: <strong>#{b.ma_dat_phong}</strong></p>
                    <p>Nhận phòng: <strong>{b.ngay_nhan_phong}</strong></p>
                    <p>Trả phòng: <strong>{b.ngay_tra_phong}</strong></p>
                  </div>
                </div>
                {b.trang_thai !== 'Đã hủy' && (
                  <button
                    onClick={() => handleCancel(b.ma_dat_phong)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <HiXCircle className="w-4 h-4" />
                    Hủy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
