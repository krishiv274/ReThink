"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import FormInput from '@/components/auth/FormInput';
import PasswordInput from '@/components/auth/PasswordInput';
import SubmitButton from '@/components/auth/SubmitButton';
import GoogleButton from '@/components/auth/GoogleButton';
import ErrorMessage from '@/components/auth/ErrorMessage';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.signup(formData);
      if (result.message === "Signup successful") {
        router.push("/home");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Create Account" subtitle="Join ReTh!nk today" />

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-6">
          <FormInput
            id="username"
            name="username"
            type="text"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={5}
          />

          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
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
            minLength={6}
          />

          <div className="space-y-4">
            <SubmitButton loading={loading} text="Sign Up" loadingText="Signing up..." />
            <GoogleButton text="Sign up with Google" />
          </div>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold leading-6 text-black hover:underline">
          Log In
        </Link>
      </p>
    </AuthCard>
  );
}
