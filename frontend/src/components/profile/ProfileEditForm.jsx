'use client';

export default function ProfileEditForm({ formData, onInputChange, onAvatarChange }) {
  return (
    <div className="space-y-5 pt-6 border-t border-gray-200">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profile Picture URL
        </label>
        <input
          type="url"
          name="avatar"
          value={formData.avatar}
          onChange={onAvatarChange}
          placeholder="https://example.com/avatar.jpg"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">Enter a URL to your profile picture</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onInputChange}
          minLength={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={onInputChange}
          maxLength={500}
          rows={4}
          placeholder="Tell us about yourself and your eco journey..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">Share your story with the community</p>
          <p className="text-xs text-gray-500 font-medium">
            {formData.bio.length}/500
          </p>
        </div>
      </div>
    </div>
  );
}
