import api from './api';

const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },

  // Update profile image
  updateProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await api.put('/user/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/user/change-password', passwordData);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.delete('/user/account', {
      data: { password }
    });
    return response.data;
  },
};

export default userService;