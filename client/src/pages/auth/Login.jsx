import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const response = await login(data.email, data.password);
    if (response.success) {
      if (response.user?.role === 'student') {
        navigate('/dashboard');
      } else if (response.user?.role === 'teacher') {
        navigate('/teacher');
      } else if (response.user?.role === 'admin') {
        navigate('/admin-dashboard'); // Assuming an admin dashboard exists
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Login to Portfolix</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address' } })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-primary focus:border-primary"
            />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" size="lg">Login</Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;