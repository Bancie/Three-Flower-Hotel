import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    api.get('/thong-ke/tong-quan').then((r) => setStats(r.data));
    api.get('/dat-phong').then((r) => setRecentBookings(r.data.slice(0, 5)));
  }, []);

  const cards = stats
    ? [
        { label: 'Tổng phòng', value: stats.tong_phong, icon: HiOutlineOfficeBuilding, color: 'bg-blue-500' },
        { label: 'Phòng trống', value: stats.phong_trong, icon: HiOutlineCheckCircle, color: 'bg-green-500' },
        { label: 'Đặt phòng hiện tại', value: stats.dat_phong_hien_tai, icon: HiOutlineCalendar, color: 'bg-amber-500' },
        { label: 'Tổng doanh thu', value: stats.tong_doanh_thu?.toLocaleString('vi-VN') + ' ₫', icon: HiOutlineCash, color: 'bg-purple-500' },
      ]
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-4">
              <div className={`${c.color} p-3 rounded-lg text-white`}>
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Đặt phòng gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Mã</th>
                <th className="px-5 py-3 text-left font-medium">Khách hàng</th>
                <th className="px-5 py-3 text-left font-medium">Phòng</th>
                <th className="px-5 py-3 text-left font-medium">Nhận phòng</th>
                <th className="px-5 py-3 text-left font-medium">Trả phòng</th>
                <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentBookings.map((b) => (
                <tr key={b.ma_dat_phong} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">#{b.ma_dat_phong}</td>
                  <td className="px-5 py-3">{b.ho_ten_khach}</td>
                  <td className="px-5 py-3">{b.so_phong}</td>
                  <td className="px-5 py-3">{b.ngay_nhan_phong}</td>
                  <td className="px-5 py-3">{b.ngay_tra_phong}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.trang_thai} />
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Đã xác nhận': 'bg-green-100 text-green-700',
    'Đang chờ': 'bg-yellow-100 text-yellow-700',
    'Đã hủy': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
