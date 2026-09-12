import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FileUploader from '../../components/shared/FileUploader';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [isPublic, setIsPublic] = useState(false);
  const [portfolioId, setPortfolioId] = useState(null);
  const [publicSlug, setPublicSlug] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'portfolio'

  const { register: registerProfile, handleSubmit: handleSubmitProfile, setValue: setValueProfile, reset: resetProfile, formState: { errors: errorsProfile } } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: errorsPassword } } = useForm();
  const { register: registerPortfolio, handleSubmit: handleSubmitPortfolio, setValue: setValuePortfolio, formState: { errors: errorsPortfolio } } = useForm();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        institution: user.institution || '',
        department: user.department || '',
        level: user.level || '',
        linkedIn: user.linkedIn || '',
        github: user.github || '',
        website: user.website || '',
      });
      setAvatarPreview(user.avatar || '');
      fetchPortfolioStatus();
    }
  }, [user, resetProfile]);

  const fetchPortfolioStatus = async () => {
    try {
      const res = await API.get('/portfolio/mine');
      if (res.data) {
        setIsPublic(res.data.isPublic);
        setPortfolioId(res.data._id);
        setPublicSlug(res.data.publicSlug || '');
        setValuePortfolio('template', res.data.template || 'default');
      }
    } catch (error) {
      console.error('Error fetching portfolio status:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch portfolio status.');
    }
  };

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(user?.avatar || '');
    }
  };

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await API.put('/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUser(res.data); // Update user context
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePassword = async (data) => {
    setLoading(true);
    try {
      await API.put('/auth/change-password', data);
      toast.success('Password updated successfully!');
      resetPassword();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePortfolioSettings = async (data) => {
    if (!portfolioId) {
      toast.error('Portfolio not found.');
      return;
    }
    setLoading(true);
    try {
      await API.put(`/portfolio/update`, { portfolioId, ...data });
      toast.success('Portfolio settings updated successfully!');
    } catch (error) {
      console.error('Error updating portfolio settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update portfolio settings.');
    } finally {
      setLoading(false);
    }
  };

  const onTogglePortfolioVisibility = async () => {
    if (!portfolioId) {
      toast.error('Portfolio not found.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.put(`/portfolio/visibility/${portfolioId}`, { isPublic: !isPublic });
      setIsPublic(res.data.isPublic);
      setPublicSlug(res.data.publicSlug || '');
      toast.success(`Portfolio visibility set to ${res.data.isPublic ? 'Public' : 'Private'}`);
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle portfolio visibility.');
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = () => {
    if (publicSlug) {
      const link = `${window.location.origin}/portfolio/${publicSlug}`;
      navigator.clipboard.writeText(link);
      toast.success('Public portfolio link copied to clipboard!');
    } else {
      toast.error('Public portfolio link not available.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatarUrl || 'https://via.placeholder.com/150'}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover mb-3 border border-gray-300"
            />
            <FileUploader onFileUpload={handleAvatarUpload} fileType="image" buttonText="Upload Avatar" />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              {...registerProfile('name', { required: 'Name is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
            />
            {errorsProfile.name && <p className="text-danger text-sm mt-1">{errorsProfile.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              {...registerProfile('email', { required: 'Email is required', pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
            />
            {errorsProfile.email && <p className="text-danger text-sm mt-1">{errorsProfile.email.message}</p>}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
        <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              {...registerPassword('currentPassword', { required: 'Current password is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
            />
            {errorsPassword.currentPassword && <p className="text-danger text-sm mt-1">{errorsPassword.currentPassword.message}</p>}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
            />
            {errorsPassword.newPassword && <p className="text-danger text-sm mt-1">{errorsPassword.newPassword.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...registerPassword('confirmPassword', { required: 'Please confirm your new password', validate: (value) => value === document.getElementById('newPassword').value || 'Passwords do not match' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
            />
            {errorsPassword.confirmPassword && <p className="text-danger text-sm mt-1">{errorsPassword.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Change Password'}
          </Button>
        </form>
      </Card>

      {/* Portfolio Visibility */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Visibility</h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-700">Make your portfolio {isPublic ? 'public' : 'private'}:</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={isPublic} onChange={onTogglePortfolioVisibility} disabled={loading} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{isPublic ? 'Public' : 'Private'}</span>
          </label>
        </div>
        {isPublic && portfolioId && (
          <p className="text-sm text-gray-500 mt-2">Your public portfolio link: <Link to={`/portfolio/public/${portfolioId}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Public Portfolio</Link></p>
        )}
      </Card>
    </div>
  );
};

export default Settings;
