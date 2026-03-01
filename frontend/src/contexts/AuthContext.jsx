import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (ten_dang_nhap, mat_khau) => {
    const res = await api.post('/auth/login', { ten_dang_nhap, mat_khau });
    const { access_token, vai_tro, ho_ten } = res.data;
    localStorage.setItem('token', access_token);

    const me = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(me.data));
    setUser(me.data);
    return me.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { access_token } = res.data;
    localStorage.setItem('token', access_token);

    const me = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(me.data));
    setUser(me.data);
    return me.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
