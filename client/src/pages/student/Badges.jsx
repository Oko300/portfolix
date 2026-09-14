import { Link } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import BadgeCard from '../../components/portfolio/BadgeCard';
import FileUploader from '../../components/shared/FileUploader';
import { useForm } from 'react-hook-form';
import { PlusCircle, Search } from 'lucide-react';

// BadgeForm component - to be reused for adding/editing badges
export const BadgeForm = ({ portfolioId, onBadgeAdded, onBadgeUpdated, currentBadge }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (currentBadge) {
      reset(currentBadge);
      setImageUrl(currentBadge.imageUrl);
    } else {
      reset();
      setImageUrl('');
    }
  }, [currentBadge, reset]);

  const handleImageUpload = (url) => {
    setImageUrl(url);
    setValue('imageUrl', url, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const badgeData = {
      ...data,
      portfolioId: portfolioId,
      imageUrl: imageUrl,
      skillsAwarded: data.skillsAwarded ? data.skillsAwarded.split(',').map(s => s.trim()) : [],
    };

    try {
      if (currentBadge) {
        await API.put(`/badge/update/${currentBadge._id}`, badgeData);
        toast.success('Badge updated successfully!');
        if (onBadgeUpdated) onBadgeUpdated();
      } else {
        await API.post('/badge/create', badgeData);
        toast.success('Badge added successfully!');
        if (onBadgeAdded) onBadgeAdded();
      }
      reset();
      setImageUrl('');
    } catch (error) {
      console.error('Error submitting badge:', error);
      toast.error(error.response?.data?.message || 'Failed to save badge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Badge Name</label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Badge name is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        />
        {errors.name && <p className="text-danger text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          id="description"
          rows="3"
          {...register('description')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        ></textarea>
      </div>

      <div>
        <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">Issuer</label>
        <input
          type="text"
          id="issuer"
          {...register('issuer', { required: 'Issuer is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        />
        {errors.issuer && <p className="text-danger text-sm mt-1">{errors.issuer.message}</p>}
      </div>

      <div>
        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
        <input
          type="date"
          id="issueDate"
          {...register('issueDate', { required: 'Issue date is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        />
        {errors.issueDate && <p className="text-danger text-sm mt-1">{errors.issueDate.message}</p>}
      </div>

      <div>
        <label htmlFor="skillsAwarded" className="block text-sm font-medium text-gray-700">Skills Awarded (comma-separated, Optional)</label>
        <input
          type="text"
          id="skillsAwarded"
          {...register('skillsAwarded')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
          placeholder="e.g., leadership, communication"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Badge Image</label>
        {imageUrl && (
          <div className="mt-2 mb-4">
            <img src={imageUrl} alt="Badge" className="max-h-40 object-contain" />
          </div>
        )}
        <FileUploader onFileUpload={handleImageUpload} fileType="image" />
        {errors.imageUrl && <p className="text-danger text-sm mt-1">{errors.imageUrl.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : currentBadge ? 'Update Badge' : 'Add Badge'}
      </Button>
    </form>
  );
};

// Badges Page component
const Badges = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBadges = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const portfolioRes = await API.get('/portfolio/mine');
      setPortfolio(portfolioRes.data);

      if (portfolioRes.data?._id) {
        const badgesRes = await API.get(`/badge/list/${portfolioRes.data._id}`);
        setBadges(badgesRes.data);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error(error.response?.data?.message || 'Failed to load badges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, [user]);

  const handleBadgeAddedOrUpdated = () => {
    setIsModalOpen(false);
    setCurrentBadge(null);
    fetchBadges();
  };

  const handleAddBadgeClick = () => {
    setCurrentBadge(null);
    setIsModalOpen(true);
  };

  const handleEditBadge = (badgeId) => {
    setCurrentBadge(badges.find(badge => badge._id === badgeId));
    setIsModalOpen(true);
  };

  const handleDeleteBadge = async (badgeId) => {
    if (window.confirm('Are you sure you want to delete this badge?')) {
      try {
        await API.delete(`/badge/delete/${badgeId}`);
        toast.success('Badge deleted successfully!');
        fetchBadges();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete badge.');
      }
    }
  };

  const filteredBadges = badges.filter(badge => {
    const matchQuery = searchQuery.toLowerCase();
    return (
      badge.name.toLowerCase().includes(matchQuery) ||
      badge.issuer.toLowerCase().includes(matchQuery) ||
      (badge.description && badge.description.toLowerCase().includes(matchQuery)) ||
      (badge.skillsAwarded && badge.skillsAwarded.some(skill => skill.toLowerCase().includes(matchQuery)))
    );
  });

  if (loading) {
    return <div className="text-center py-8">Loading badges...</div>;
  }

  if (!portfolio) {
    return (
      <div className="text-center py-8">
        <p>Please create your portfolio first.</p>
        <Link to="/portfolio"><Button className="mt-4">Go to My Portfolio</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">My Badges</h1>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search badges..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredBadges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge._id}
              badge={badge}
              onEdit={handleEditBadge}
              onDelete={handleDeleteBadge}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <p className="text-lg text-gray-600">You haven't earned any badges yet.</p>
          <Button onClick={handleAddBadgeClick} className="mt-4"><PlusCircle size={20} className="mr-2" /> Add Your First Badge</Button>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentBadge ? "Edit Badge" : "Add New Badge"}>
        <BadgeForm 
          portfolioId={portfolio._id} 
          onBadgeAdded={handleBadgeAddedOrUpdated} 
          onBadgeUpdated={handleBadgeAddedOrUpdated} 
          currentBadge={currentBadge}
        />
      </Modal>
    </div>
  );
};

export default Badges;


