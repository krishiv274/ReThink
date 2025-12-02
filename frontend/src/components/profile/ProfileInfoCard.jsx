'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import ProfileEditForm from './ProfileEditForm';

export default function ProfileInfoCard({ 
  profile, 
  editMode, 
  formData, 
  avatarError,
  onInputChange,
  onAvatarChange,
  onAvatarError,
  onDeleteClick
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2"
    >
      {/* Avatar & Basic Info Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatar 
            profile={profile} 
            avatarError={avatarError}
            editMode={editMode}
            onAvatarError={onAvatarError}
          />
          
          <h2 className="text-2xl font-bold text-gray-900">{profile?.username}</h2>
          <p className="text-gray-500">{profile?.email}</p>
          {profile?.bio && !editMode && (
            <p className="mt-3 text-gray-600 max-w-md">{profile.bio}</p>
          )}
        </div>

        {editMode && (
          <div className="mt-8">
            <ProfileEditForm 
              formData={formData}
              onInputChange={onInputChange}
              onAvatarChange={onAvatarChange}
            />
          </div>
        )}

        {/* Danger Zone */}
        <div className="mt-auto pt-8 border-t border-gray-200">
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={onDeleteClick}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-xs"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
