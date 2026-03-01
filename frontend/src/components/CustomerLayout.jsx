import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineLogout,
} from 'react-icons/hi';

const navItems = [
  { to: '/khach-hang', icon: HiOutlineHome, label: 'Trang chủ', end: true },
  { to: '/khach-hang/tim-phong', icon: HiOutlineSearch, label: 'Tìm phòng' },
  { to: '/khach-hang/dat-phong', icon: HiOutlineCalendar, label: 'Đặt phòng của tôi' },
  { to: '/khach-hang/hoa-don', icon: HiOutlineDocumentText, label: 'Hóa đơn của tôi' },
];

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-lg font-bold text-primary-700">🏨 Three Flower Hotel</h1>
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Xin chào, <strong>{user?.ho_ten || 'Khách'}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <HiOutlineLogout className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
