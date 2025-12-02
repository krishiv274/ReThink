'use client';

import { motion } from 'framer-motion';
import ProfileAvatar from './ProfileAvatar';
import ProfileEditForm from './ProfileEditForm';

export default function ProfileInfoCard({ 
  profile, 
  editMode, 
  formData, 
  avatarError,
  onInputChange,
  onAvatarChange,
  onAvatarError
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      {/* Avatar & Basic Info Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full">
        <div className="flex flex-col items-center text-center h-full justify-center">
          <ProfileAvatar 
            profile={profile} 
            avatarError={avatarError}
            editMode={editMode}
            onAvatarError={onAvatarError}
          />
          
          <h2 className="text-2xl font-bold text-gray-900 mt-4">{profile?.username}</h2>
          <p className="text-gray-500 mt-1">{profile?.email}</p>
          {profile?.bio && !editMode && (
            <p className="mt-4 text-gray-600 max-w-md">{profile.bio}</p>
          )}

          {editMode && (
            <div className="mt-8 w-full">
              <ProfileEditForm 
                formData={formData}
                onInputChange={onInputChange}
                onAvatarChange={onAvatarChange}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
