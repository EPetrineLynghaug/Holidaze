// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Logo from '../components/ui/Logo';
import useForm from '../hooks/useForm';
import { login as loginService } from '../services/authService';

// simple validation function
const validate = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return 'Invalid email address';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return '';
    default:
      return '';
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values, setErrors) => {
    try {
      await loginService({ email: values.email, password: values.password, remember: true });
      navigate('/', { replace: true });
    } catch (err) {
      const message = err.message || 'Login failed';
      setErrors(prev => ({ ...prev, general: message }));
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
    onSubmit
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
          <div className="flex items-center border-[var(--color-border)] border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">email</span>
            <input
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
            <p id="email-error" className="text-red-500 text-xs text-left">
              {errors.email}
            </p>
          )}

          {/* Password Field */}
          <div className="flex items-center border-[var(--color-border)] border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-[var(--color-btn-light)] relative">
            <input
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className={`material-symbols-outlined icon-gray text-xs ml-2 focus:outline-none transition-colors ${
                  showPassword ? 'text-black' : 'text-gray-400'
                }`}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </button>
            )}
          </div>
          {touched.password && errors.password && (
            <p id="password-error" className="text-red-500 text-xs text-left">
              {errors.password}
            </p>
          )}

          {/* General Error */}
          {errors.general && (
            <p className="text-red-500 text-xs text-center" role="alert">
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
