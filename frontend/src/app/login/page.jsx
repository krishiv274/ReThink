"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import FormInput from '@/components/auth/FormInput';
import PasswordInput from '@/components/auth/PasswordInput';
import SubmitButton from '@/components/auth/SubmitButton';
import GoogleButton from '@/components/auth/GoogleButton';
import ErrorMessage from '@/components/auth/ErrorMessage';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login({ identifier: formData.identifier, password: formData.password });
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      router.push('/home');
    } catch (err) {
      setError(err?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome back!" subtitle="Please enter your details" />

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-6">
          <FormInput
            id="identifier"
            name="identifier"
            type="text"
            label="Username or Email"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember for 30 days
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot" className="font-medium text-gray-400 hover:text-gray-900">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <SubmitButton loading={loading} text="Log In" loadingText="Logging in..." />
            <GoogleButton text="Log in with Google" />
          </div>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold leading-6 text-black hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthCard>
  );
};

export default LoginPage;