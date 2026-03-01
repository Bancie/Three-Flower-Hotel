import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ReceptionistLayout from './components/ReceptionistLayout';
import CustomerLayout from './components/CustomerLayout';

import Login from './pages/Login';
import Register from './pages/Register';

import RDashboard from './pages/receptionist/Dashboard';
import RRoomTypes from './pages/receptionist/RoomTypes';
import RRooms from './pages/receptionist/Rooms';
import RCustomers from './pages/receptionist/Customers';
import RBookings from './pages/receptionist/Bookings';
import RInvoices from './pages/receptionist/Invoices';
import RPayments from './pages/receptionist/Payments';
import RStatistics from './pages/receptionist/Statistics';
import RAccounts from './pages/receptionist/Accounts';

import CDashboard from './pages/customer/Dashboard';
import CBrowseRooms from './pages/customer/BrowseRooms';
import CMyBookings from './pages/customer/MyBookings';
import CMyInvoices from './pages/customer/MyInvoices';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/le-tan"
            element={
              <ProtectedRoute role="le_tan">
                <ReceptionistLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RDashboard />} />
            <Route path="loai-phong" element={<RRoomTypes />} />
            <Route path="phong" element={<RRooms />} />
            <Route path="khach-hang" element={<RCustomers />} />
            <Route path="dat-phong" element={<RBookings />} />
            <Route path="hoa-don" element={<RInvoices />} />
            <Route path="thanh-toan" element={<RPayments />} />
            <Route path="thong-ke" element={<RStatistics />} />
            <Route path="tai-khoan" element={<RAccounts />} />
          </Route>

          <Route
            path="/khach-hang"
            element={
              <ProtectedRoute role="khach_hang">
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CDashboard />} />
            <Route path="tim-phong" element={<CBrowseRooms />} />
            <Route path="dat-phong" element={<CMyBookings />} />
            <Route path="hoa-don" element={<CMyInvoices />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
