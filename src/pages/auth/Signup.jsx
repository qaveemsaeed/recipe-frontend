import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { createApiUrl, API_ENDPOINTS } from '../../config/api';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(createApiUrl(API_ENDPOINTS.SIGNUP), data);
      
      if (response.data.success) {
        login(response.data.data);
        navigate('/');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                {...register("fullName", { 
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters"
                  }
                })}
                placeholder="Enter your full name"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs">{errors.fullName.message}</span>
              )}
            </div>

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
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                placeholder="Enter your password"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
                placeholder="Confirm your password"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
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
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
