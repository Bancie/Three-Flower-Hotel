import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Statistics() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    api.get('/thong-ke/dat-phong', { params: { nam: year } }).then((r) => setData(r.data));
  }, [year]);

  const totalBookings = data.reduce((s, d) => s + d.so_luong, 0);
  const totalRevenue = data.reduce((s, d) => s + d.doanh_thu, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Thống kê đặt phòng</h2>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">Tổng đặt phòng ({year})</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">Tổng doanh thu ({year})</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalRevenue.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Số lượng đặt phòng theo tháng</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="thang" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="so_luong" name="Số lượng" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="thang" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(val) => `${Number(val).toLocaleString('vi-VN')} ₫`} />
              <Legend />
              <Bar dataKey="doanh_thu" name="Doanh thu (₫)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Tháng</th>
              <th className="px-5 py-3 text-left font-medium">Số lượng đặt phòng</th>
              <th className="px-5 py-3 text-left font-medium">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((d) => (
              <tr key={d.thang} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{d.thang}</td>
                <td className="px-5 py-3">{d.so_luong}</td>
                <td className="px-5 py-3">{Number(d.doanh_thu).toLocaleString('vi-VN')} ₫</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
