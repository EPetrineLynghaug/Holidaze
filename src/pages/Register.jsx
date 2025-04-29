import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import useForm from '../hooks/useForm';
import { register as registerService, login as loginService, isLoggedIn } from '../services/authService';
import Logo from '../components/ui/Logo';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (isLoggedIn()) navigate('/', { replace: true });
  }, [navigate]);


  const storedType = localStorage.getItem('venueManager');
  const initialVenueManager = storedType === 'true';


  const validate = (field, value) => {
    if (field === 'venueManager') return '';
    const v = String(value);
    const emailRegex = /^[^@\s]+@stud\.noroff\.no$/i;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    switch (field) {
      case 'name':
        return v.trim() ? '' : 'Name is required';
      case 'email':
        return emailRegex.test(v)
          ? ''
          : 'Email must be a stud.noroff.no address';
      case 'password':
        return passwordRegex.test(v)
          ? ''
          : 'Password must be at least 8 characters, include uppercase, lowercase and a number';
      default:
        return '';
    }
  };

  // Submit handler: register then login
  const onSubmit = async (values, setErrors) => {
    try {
      // Register new user
      await registerService({
        name: values.name,
        email: values.email,
        password: values.password
      });
    
      localStorage.setItem('venueManager', JSON.stringify(values.venueManager));
   
      await loginService({
        email: values.email,
        password: values.password,
        remember: true
      });
      navigate('/', { replace: true });
    } catch (err) {
      const message = err.message || 'Registration failed';
      setErrors(prev => ({ ...prev, general: message }));
    }
  };

  const {
    values: form,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      venueManager: initialVenueManager,
    },
    validate,
    onSubmit,
  });

  // Profile type selector
  const handleSelectType = isManager => {
    setFieldValue('venueManager', isManager);
    localStorage.setItem('venueManager', JSON.stringify(isManager));
  };

  return (
    <div className="min-h-screen bg-[var(--color-BGcolor)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Logo className="mx-auto h-24 text-5xl" />
        <h2 className="text-base font-medium text-black tracking-tight">
          Create your account
        </h2>

        <div className="text-xs text-gray-700 mb-8 bg-white/75 backdrop-blur-sm px-4 py-2 rounded-2xl border border-[#D1D1D1] shadow-lg">
          What type of account would you like to create?
        </div>

        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={() => handleSelectType(false)}
            className="flex-1 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition"
          >
            <div className="relative h-36">
              <img
                src="/images/traveler.png"
                alt="Traveler"
                className="w-full h-full object-cover"
              />
              <span
                className={`material-symbols-outlined icon-gray text-xs absolute -bottom-4 left-1/2 -translate-x-1/2 p-1 rounded-full bg-white transition-colors ${
                  !form.venueManager ? 'filled' : ''
                }`}
              >
                person
              </span>
            </div>
            <div className="text-center pt-6 pb-3 text-xs font-medium text-black">
              Become a Traveler
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleSelectType(true)}
            className="flex-1 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition"
          >
            <div className="relative h-36">
              <img
                src="/images/hosting-key.png"
                alt="Host"
                className="w-full h-full object-cover"
              />
              <span
                className={`material-symbols-outlined icon-gray text-xs absolute -bottom-4 left-1/2 -translate-x-1/2 p-1 rounded-full bg-white transition-colors ${
                  form.venueManager ? 'filled' : ''
                }`}
              >
                family_home
              </span>
            </div>
            <div className="text-center pt-6 pb-3 text-xs font-medium text-black">
              Start Hosting
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Field */}
          <div className="flex items-center border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">person</span>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>
          {touched.name && errors.name && (
            <p id="name-error" className="text-red-500 text-xs text-left">{errors.name}</p>
          )}

          {/* Email Field */}
          <div className="flex items-center border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <span className="material-symbols-outlined icon-gray text-xs mr-2">email</span>
            <input
              name="email"
              type="email"
              placeholder="eksempel@stud.noroff.no"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>
          {touched.email && errors.email && (
            <p id="email-error" className="text-red-500 text-xs text-left">{errors.email}</p>
          )}

          {/* Password Field */}
          <div className="flex items-center justify-between border rounded-md px-2 py-2 focus-within:ring-1 focus-within:ring-[var(--color-btn-light)]">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
              required
              className="w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="material-symbols-outlined text-xs ml-2 focus:outline-none transition-colors"
            >
              {showPassword ? 'visibility' : 'visibility_off'}
            </button>
          </div>
          {touched.password && errors.password && (
            <p id="password-error" className="text-red-500 text-xs text-left">{errors.password}</p>
          )}

          {/* General Error */}
          {errors.general && (
            <p className="text-red-500 text-xs text-center min-h-[1.25rem]" role="alert">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--color-btn-light)] hover:bg-[var(--color-btn-dark)] text-white font-semibold text-sm py-3 rounded-md transition tracking-wide disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-black mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-btn-light)] hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
