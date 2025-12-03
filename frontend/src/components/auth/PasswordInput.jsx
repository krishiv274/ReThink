'use client';

import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ id, name, label, value, onChange, required = true, minLength }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative border-b border-gray-300 focus-within:border-green-600 transition-colors">
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="peer block w-full border-0 bg-transparent py-2.5 pr-10 text-gray-900 placeholder:text-transparent focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
        placeholder={label}
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-3.5 text-sm font-medium text-gray-900 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-900"
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        aria-label="Toggle password visibility"
        className="absolute right-2 top-2 text-gray-400 hover:text-green-600 transition-colors"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
