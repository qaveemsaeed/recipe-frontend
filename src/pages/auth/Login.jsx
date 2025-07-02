import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import loginpic from '../../assets/auth.png'; // Make sure this path is correct
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { createApiUrl, API_ENDPOINTS } from '../../config/api';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(createApiUrl(API_ENDPOINTS.LOGIN), data);
      
      if (response.data.success) {
        login(response.data.data);
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left image section */}
      <div className="hidden md:block md:w-1/2">
        <img src={loginpic} alt="Cover" className="w-full h-screen object-cover object-center" />
      </div>

      {/* Right form section */}
      <div className="w-full md:w-1/2 flex flex-col relative bg-gray-50">
        {/* Top-left Recipe Basket */}
        <div className="absolute top-6 left-6 text-2xl font-semibold text-orange-500">
          Recipe Basket
        </div>

        {/* Centered login form */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-[400px]">
            <h1 className="text-2xl font-bold text-center text-orange-500 mb-6">Login</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  placeholder="Enter your email"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-1 relative">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  placeholder="Enter your password"
                  className="border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div
                  className="absolute right-3 top-[60%] transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs">{errors.password.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Signup link */}
              <p className="text-center text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-orange-500 hover:text-orange-600">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
