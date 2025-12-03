'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export default function ProfileAvatar({ profile, avatarError, editMode, onAvatarError }) {
  return (
    <div className="relative mb-4">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-100 shadow-lg">
        {profile?.avatar && !avatarError ? (
          <div className="relative w-full h-full bg-linear-to-br from-green-500 to-emerald-600">
            <Image
              src={profile.avatar}
              alt={profile.username}
              fill
              className="object-cover"
              onError={onAvatarError}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-5xl font-bold text-white">
              {profile?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      {editMode && (
        <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-full p-2">
          <ImageIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
