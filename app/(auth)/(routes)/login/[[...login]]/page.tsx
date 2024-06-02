// pages/login.tsx
'use client'

import { useState } from 'react';
import axiosInstance from '@/service/axiosInstance';
import { setAuthToken } from '@/service/auth';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      setAuthToken(response.data.data.accessToken);
      // Перенаправление после успешного входа
      console.log('Token saved:', localStorage.getItem('authToken'));
      router.push('/teacher/courses');
    } catch (error) {
      console.error('Login error', error);
      // Обработка ошибок
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
