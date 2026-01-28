'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar,
  Target,
  Check,
  Lightbulb,
  Package,
  Edit2,
  Save,
  X,
  Loader2,
  Trash2,
  AtSign,
  Key,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    avatar: '',
    bio: '',
    monthlyGoal: 10,
  });

  const [usernameData, setUsernameData] = useState({
    username: '',
  });

  // Calculate progress
  const monthlyGoal = profile?.monthlyGoal || 10;
  const monthlyCompleted = profile?.monthlyCompleted || 0;
  const progressPercent = Math.min(100, Math.round((monthlyCompleted / monthlyGoal) * 100));
  
  // Days remaining
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysRemaining = lastDay.getDate() - now.getDate();

  // Display name (fallback to username)
  const displayName = profile?.displayName || profile?.username || 'User';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileResult = await api.fetchProfile();
      if (profileResult.user) {
        setProfile(profileResult.user);
        setFormData({
          displayName: profileResult.user.displayName || profileResult.user.username || '',
          avatar: profileResult.user.avatar || '',
          bio: profileResult.user.bio || '',
          monthlyGoal: profileResult.user.monthlyGoal || 10,
        });
        setUsernameData({
          username: profileResult.user.username || '',
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

  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setUsernameData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const result = await api.updateProfile(formData);
      if (result.user) {
        setProfile(result.user);
        setSuccess('Profile updated!');
        setEditMode(false);
        setTimeout(() => setSuccess(''), 3000);
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUsername = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    // Validate username
    if (!usernameData.username || usernameData.username.length < 5) {
      setError('Username must be at least 5 characters');
      setSaving(false);
      return;
    }

    try {
      const result = await api.updateProfile({ username: usernameData.username });
      if (result.user) {
        setProfile(result.user);
        setSuccess('Username updated!');
        setEditingUsername(false);
        setTimeout(() => setSuccess(''), 3000);
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Username already taken or invalid');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: profile.displayName || profile.username || '',
      avatar: profile.avatar || '',
      bio: profile.bio || '',
      monthlyGoal: profile.monthlyGoal || 10,
    });
    setEditMode(false);
    setError('');
    setAvatarError(false);
  };

  const handleCancelUsername = () => {
    setUsernameData({ username: profile?.username || '' });
    setEditingUsername(false);
    setError('');
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      router.push('/login?deleted=true');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8faf8]">
      <Sidebar activeSection="profile" />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <Header user={user} />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              {!editMode && !editingUsername ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : editMode ? (
                <div className="flex gap-2">
                  <button onClick={handleCancel} className="p-2 hover:bg-white rounded-lg transition-colors">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              ) : null}
            </div>

            {/* Messages */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> {success}
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {/* User Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-100 flex-shrink-0">
                  {profile?.avatar && !avatarError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl">
                      {displayName[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {editMode ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleChange}
                          placeholder="How you want to be called"
                          className="text-lg font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">This name is shown throughout the app</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 truncate">{displayName}</h2>
                    </>
                  )}
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                    <Mail className="w-3.5 h-3.5" /> {profile?.email}
                  </p>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> 
                    Member since {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {editMode && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="A short bio about yourself..."
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Avatar URL</label>
                    <input
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {profile?.bio && !editMode && (
                <p className="mt-4 text-sm text-gray-600 pt-4 border-t border-gray-100">{profile.bio}</p>
              )}
            </motion.div>

            {/* Monthly Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900">Monthly Goal</h3>
                </div>
                <span className="text-xs text-gray-400">{daysRemaining} days left</span>
              </div>

              <div className="flex items-center gap-6">
                {/* Progress Circle */}
                <div 
                  className="relative w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `conic-gradient(#22c55e ${progressPercent}%, #f3f4f6 0)`
                  }}
                >
                  <div className="bg-white w-20 h-20 rounded-full flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{progressPercent}%</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-bold text-green-600">{monthlyCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Goal</span>
                    {editMode ? (
                      <input
                        type="number"
                        name="monthlyGoal"
                        value={formData.monthlyGoal}
                        onChange={handleChange}
                        min={1}
                        max={100}
                        className="w-16 text-right font-bold bg-gray-50 border border-gray-200 rounded px-2 py-0.5"
                      />
                    ) : (
                      <span className="font-bold text-gray-900">{monthlyGoal}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-bold text-gray-400">{Math.max(0, monthlyGoal - monthlyCompleted)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* All-Time Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-medium">Items Uploaded</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile?.itemsUploaded || 0}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-xs font-medium">Ideas Completed</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile?.totalIdeasCompleted || 0}</div>
              </div>
            </motion.div>

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900">Account Settings</h4>
              </div>
              
              <div className="space-y-4">
                {/* Username Section */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Username</label>
                      {editingUsername ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-400">@</span>
                          <input
                            type="text"
                            name="username"
                            value={usernameData.username}
                            onChange={handleUsernameChange}
                            className="px-2 py-1 bg-white border border-gray-200 rounded text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                            placeholder="username"
                          />
                        </div>
                      ) : (
                        <p className="font-medium text-gray-700 flex items-center gap-1 mt-0.5">
                          <AtSign className="w-3.5 h-3.5 text-gray-400" />
                          {profile?.username}
                        </p>
                      )}
                    </div>
                    {editingUsername ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelUsername}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={handleSaveUsername}
                          disabled={saving}
                          className="px-3 py-1.5 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingUsername(true)}
                        className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200 rounded transition-colors"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Unique username for your profile</p>
                </div>

                {/* Email Section */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="text-xs font-medium text-gray-500">Email</label>
                  <p className="font-medium text-gray-700 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {profile?.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Contact support to change your email.</p>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-red-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently remove your account and data</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Account?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
