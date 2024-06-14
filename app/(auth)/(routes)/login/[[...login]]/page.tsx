// pages/login.tsx
'use client'

import { useState } from 'react';
import axiosInstance from '@/service/axiosInstance';
import { setAuthToken } from '@/service/auth';
import { useRouter } from 'next/navigation';
import { Logo } from '@/app/(dashboard)/_components/logo';

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
    <div className="flex h-screen">
      <div className="flex items-center justify-center w-full min-h-screen bg-black rounded-xl">
        <div className="text-white p-10 flex flex-col items-center">
          <div className="flex items-center mb-9">
            <div>
              <Logo />
            </div>
            <span className="ml-2 text-3xl font-bold">Platform-X</span>
          </div>
          <h2 className="text-3xl font-medium ">
            Platform for 
          </h2>
          <h2 className="text-7xl text-red-500 mb-6 whitespace-pre-line leading-relaxed font-medium animate-pulse ">
            Everyone
          </h2>
          {/* <div className="flex justify-center items-center">
            <div className="flex items-center justify-center">
              <Image width={500} height={373} src={illustration} alt="illustration" />
            </div>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col items-center w-full justify-center bg-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">login</h2>
        <form>
          <div className="mb-4 flex flex-col items-center justify-center">
            <label className="block text-black text-sm font-bold mb-2 mr-auto" htmlFor="username">
              Email
            </label>
            <input
              className="
                shadow 
                appearance-none 
                border 
                rounded-xl 
                w-full 
                py-3 px-6 
                text-black 
                leading-tight 
                focus:outline-none 
                focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-6 flex flex-col items-center justify-center">
            <label className="block text-black text-sm font-bold mb-2 mr-auto" htmlFor="password">
              Password
            </label>
            <input
              className="
                shadow 
                appearance-none 
                border 
                rounded-xl 
                w-full 
                py-3 px-6 
                text-black 
                mb-3 
                leading-tight 
                focus:outline-none 
                focus:shadow-outline"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
          </div>
          
          <div className="flex mt-6 justify-center">
            <button
              className="
                flex
                items-center
                bg-black 
                hover:bg-red-500 
                text-white 
                font-bold 
                rounded-2xl
                py-3 px-9 
                focus:outline-none 
                focus:shadow-outline"
              type="submit"
              onClick={handleLogin}
            >
              Log In
              {/* <FaArrowRight className="ml-2" /> */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
