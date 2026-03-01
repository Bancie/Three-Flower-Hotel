import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineSearch, HiOutlineCalendar, HiOutlineDocumentText } from 'react-icons/hi';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get('/dat-phong').then((r) => setBookings(r.data));
    api.get('/phong').then((r) => setRooms(r.data));
  }, []);

  const activeBookings = bookings.filter((b) => b.trang_thai !== 'Đã hủy');
  const availableRooms = rooms.filter((r) => r.trang_thai_phong === 'Trống');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Xin chào, {user?.ho_ten || 'Khách hàng'}!
        </h1>
        <p className="text-gray-500 mt-1">Chào mừng bạn đến với Three Flower Hotel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/khach-hang/tim-phong"
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group"
        >
          <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <HiOutlineSearch className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Tìm phòng</h3>
          <p className="text-sm text-gray-500">{availableRooms.length} phòng đang trống</p>
        </Link>

        <Link
          to="/khach-hang/dat-phong"
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group"
        >
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <HiOutlineCalendar className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Đặt phòng của tôi</h3>
          <p className="text-sm text-gray-500">{activeBookings.length} đặt phòng</p>
        </Link>

        <Link
          to="/khach-hang/hoa-don"
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group"
        >
          <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
            <HiOutlineDocumentText className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Hóa đơn của tôi</h3>
          <p className="text-sm text-gray-500">Xem lịch sử hóa đơn</p>
        </Link>
      </div>

      {activeBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-5 border-b">
            <h3 className="font-semibold text-gray-900">Đặt phòng gần đây</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Phòng</th>
                  <th className="px-5 py-3 text-left font-medium">Nhận phòng</th>
                  <th className="px-5 py-3 text-left font-medium">Trả phòng</th>
                  <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeBookings.slice(0, 5).map((b) => (
                  <tr key={b.ma_dat_phong} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium">{b.so_phong}</td>
                    <td className="px-5 py-3">{b.ngay_nhan_phong}</td>
                    <td className="px-5 py-3">{b.ngay_tra_phong}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        b.trang_thai === 'Đã xác nhận' ? 'bg-green-100 text-green-700' :
                        b.trang_thai === 'Đang chờ' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {b.trang_thai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
