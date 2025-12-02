'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ProfileStats from '@/components/profile/ProfileStats';
import DeleteAccountModal from '@/components/profile/DeleteAccount';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
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
      const authResult = await api.getProfile();
      if (authResult.user) {
        setUser(authResult.user);
      }

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

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== profile?.username) {
      setError('Username does not match. Please type your username correctly.');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await api.deleteAccount();
      await api.logout();
      router.push('/signup?deleted=true');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection="profile" onSectionChange={(section) => router.push('/dashboard')} />
      
      <div className="flex-1 ml-64">
        <Header user={user} />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <ProfileHeader 
              editMode={editMode}
              saving={saving}
              onEdit={() => setEditMode(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
              >
                {success}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProfileInfoCard 
                profile={profile}
                editMode={editMode}
                formData={formData}
                avatarError={avatarError}
                onInputChange={handleChange}
                onAvatarChange={handleAvatarChange}
                onAvatarError={() => setAvatarError(true)}
                onDeleteClick={() => setShowDeleteModal(true)}
              />

              <ProfileStats profile={profile} />
            </div>

            <DeleteAccountModal 
              isOpen={showDeleteModal}
              profile={profile}
              deleteConfirm={deleteConfirm}
              deleting={deleting}
              error={error}
              onConfirmChange={setDeleteConfirm}
              onDelete={handleDeleteAccount}
              onClose={() => {
                setShowDeleteModal(false);
                setDeleteConfirm('');
                setError('');
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
