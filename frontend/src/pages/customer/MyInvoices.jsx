import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function MyInvoices() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/hoa-don').then((r) => setItems(r.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hóa đơn của tôi</h2>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <p className="text-gray-400 text-lg">Bạn chưa có hóa đơn nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((inv) => (
            <div key={inv.ma_hoa_don} className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hóa đơn #{inv.ma_hoa_don}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Phòng: <strong>{inv.so_phong}</strong></p>
                    <p>Mã đặt phòng: <strong>#{inv.ma_dat_phong}</strong></p>
                    <p>Ngày lập: <strong>{inv.ngay_lap}</strong></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    {Number(inv.tong_tien).toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
