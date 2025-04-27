// src/pages/Login.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useForm from '../hooks/useForm';
import useAuthApi from '../hooks/useAuthApi';
import { UserContext } from '../components/context/UserContext';
import Logo from '../components/ui/Logo';

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { login } = useAuthApi();               
  const [showPassword, setShowPassword] = useState(false);

  const validate = (field, value) => {
    const trimmed = value.trim();
    if (!trimmed) return field === 'email' ? 'Email is required' : 'Password is required';
    if (field === 'email' && !trimmed.includes('@')) return 'Invalid email address';
    if (field === 'password' && trimmed.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const loginCallback = async ({ email, password }, setErrors) => {
    try {
      const data = await login({ email, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/profile');
    } catch (err) {
      if (err.code === 'EMAIL_NOT_FOUND') {
        setErrors(prev => ({ ...prev, email: err.message }));
      } else if (err.code === 'INVALID_PASSWORD') {
        setErrors(prev => ({ ...prev, password: err.message }));
      } else {
        setErrors(prev => ({ ...prev, general: err.message }));
      }
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm({
    initialValues: { email: '', password: '' },
    validate,
    onSubmit: loginCallback,
  });

  return (
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Logo className="mx-auto h-24 text-5xl" />
        <h2 className="text-base font-medium text-black tracking-tight">
          Log in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">email</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>
          {touched.email && errors.email && (
            <p id="email-error" className="text-red-500 text-xs text-left min-h-[1.25rem]">
              {errors.email}
            </p>
          )}

          {/* Password Field */}
          <div className="flex items-center border rounded-md px-2 py-2 border-[var(--color-border)] focus-within:ring-1 focus-within:ring-[var(--color-btn-light)] relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
            {values.password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`material-symbols-outlined icon-gray text-xs ml-2 focus:outline-none transition-colors ${
                  showPassword ? 'text-black' : 'text-gray-400'
                }`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            )}
          </div>
          {touched.password && errors.password && (
            <p id="password-error" className="text-red-500 text-xs text-left min-h-[1.25rem]">
              {errors.password}
            </p>
          )}

          {/* General Error */}
          {errors.general && (
            <p className="text-red-500 text-xs text-center min-h-[1.25rem]" role="alert">
              {errors.general}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}             
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-3 rounded-md transition tracking-wide disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}  
          </button>
        </form>

        <p className="text-center text-xs text-black mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
