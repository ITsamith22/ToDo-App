import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Lock, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import Loading from '../components/layout/Loading';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await userService.updateProfile(profileData);
      if (response.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updateProfileImage(profileImage);
      if (response.success) {
        toast.success('Profile image updated successfully!');
        setProfileImage(null);
        setProfileImagePreview(null);
        // Refresh page to show new image
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile image');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.changePassword(passwordData);
      if (response.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Enter your password to confirm account deletion:');
    if (!password) return;

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        const response = await userService.deleteAccount(password);
        if (response.success) {
          toast.success('Account deleted successfully');
          logout();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Profile Image */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Profile Picture
                  </h3>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profileImagePreview ? (
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : user?.profileImage && user.profileImage !== 'default-profile.png' ? (
                          <img
                            src={`${import.meta.env.VITE_BASE_URL}/uploads/${user.profileImage}`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <label
                        htmlFor="profileImageInput"
                        className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          id="profileImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {user?.username}
                      </h4>
                      <p className="text-sm text-gray-500">
                        JPG, GIF or PNG. Max size of 5MB.
                      </p>
                      {profileImage && (
                        <button
                          onClick={handleImageSubmit}
                          disabled={loading}
                          className="mt-2 btn btn-primary btn-sm"
                        >
                          {loading ? 'Uploading...' : 'Upload Image'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Profile Information
                  </h3>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="input"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Change Password */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input"
                        minLength={6}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input"
                        minLength={6}
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary flex items-center"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Delete Account */}
                <div className="card border-red-200">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="btn btn-danger flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <Loading size="md" text="Processing..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;