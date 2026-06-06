'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  savedColleges: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  toggleSaveCollege: (collegeId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Ensure axios sends cookies
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: any) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', data);
    setUser(res.data.user);
    router.push('/');
  };

  const register = async (data: any) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', data);
    setUser(res.data.user);
    router.push('/');
  };

  const logout = async () => {
    await axios.post('http://localhost:5000/api/auth/logout');
    setUser(null);
    router.push('/login');
  };

  const toggleSaveCollege = async (collegeId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const isSaved = user.savedColleges.includes(collegeId);
      if (isSaved) {
        const res = await axios.delete(`http://localhost:5000/api/user/save-college/${collegeId}`);
        setUser({ ...user, savedColleges: res.data.savedColleges });
      } else {
        const res = await axios.post('http://localhost:5000/api/user/save-college', { collegeId });
        setUser({ ...user, savedColleges: res.data.savedColleges });
      }
    } catch (error) {
      console.error('Error saving college:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleSaveCollege }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
