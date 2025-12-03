'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ProfileStats from '@/components/profile/ProfileStats';
import DeleteAccountModal from '@/components/profile/DeleteAccountModal';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    avatar: '',
    bio: '',
  });

  useEffect(() => {
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      const profileResult = await api.fetchProfile();
      if (profileResult.user) {
        setProfile(profileResult.user);
        setFormData({
          username: profileResult.user.username || '',
          avatar: profileResult.user.avatar || '',
          bio: profileResult.user.bio || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      if (err.message?.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    handleChange(e);
    setAvatarError(false);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const result = await api.updateProfile(formData);
      if (result.user) {
        setProfile(result.user);
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username || '',
      avatar: profile.avatar || '',
      bio: profile.bio || '',
    });
    setEditMode(false);
    setError('');
    setAvatarError(false);
  };

  const handleDeleteSuccess = () => {
    router.push('/login?deleted=true');
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-green-50">
      <Sidebar activeSection="profile" />
      
      <div className="flex-1 ml-64">
        <Header user={user} />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Success/Error Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
              >
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              formData={formData}
              editMode={editMode}
              avatarError={avatarError}
              setAvatarError={setAvatarError}
              onAvatarChange={handleAvatarChange}
              onEdit={() => setEditMode(true)}
              onSave={handleSave}
              onCancel={handleCancel}
              saving={saving}
            />

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Info */}
              <ProfileInfoCard
                profile={profile}
                formData={formData}
                editMode={editMode}
                avatarError={avatarError}
                onInputChange={handleChange}
                onAvatarChange={handleAvatarChange}
                onAvatarError={setAvatarError}
              />

              {/* Stats Card */}
              <ProfileStats profile={profile} />
            </div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-red-200"
            >
              <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        username={profile?.username}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
