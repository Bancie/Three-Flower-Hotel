import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineHome,
  HiOutlineViewGrid,
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineChartBar,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from 'react-icons/hi';

const navItems = [
  { to: '/le-tan', icon: HiOutlineHome, label: 'Tổng quan', end: true },
  { to: '/le-tan/loai-phong', icon: HiOutlineViewGrid, label: 'Loại phòng' },
  { to: '/le-tan/phong', icon: HiOutlineOfficeBuilding, label: 'Phòng' },
  { to: '/le-tan/khach-hang', icon: HiOutlineUsers, label: 'Khách hàng' },
  { to: '/le-tan/dat-phong', icon: HiOutlineCalendar, label: 'Đặt phòng' },
  { to: '/le-tan/hoa-don', icon: HiOutlineDocumentText, label: 'Hóa đơn' },
  { to: '/le-tan/thanh-toan', icon: HiOutlineCreditCard, label: 'Thanh toán' },
  { to: '/le-tan/thong-ke', icon: HiOutlineChartBar, label: 'Thống kê' },
  { to: '/le-tan/tai-khoan', icon: HiOutlineUserCircle, label: 'Tài khoản' },
];

export default function ReceptionistLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-lg font-bold tracking-wide">🏨 Three Flower Hotel</h1>
          <p className="text-xs text-gray-400 mt-1">Hệ thống quản lý</p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-medium">
              {user?.ho_ten?.[0] || 'L'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.ho_ten || 'Lễ tân'}</p>
              <p className="text-xs text-gray-400">Lễ tân</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <HiOutlineLogout className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
