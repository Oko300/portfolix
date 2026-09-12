import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import GoalCard from '../../components/portfolio/GoalCard';
import { useForm } from 'react-hook-form';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming Link is used for navigation


// GoalForm component - to be reused for adding/editing goals
export const GoalForm = ({ portfolioId, onGoalAdded, onGoalUpdated, currentGoal }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentGoal) {
      // Set form values for editing
      reset({ ...currentGoal, targetDate: currentGoal.targetDate ? currentGoal.targetDate.split('T')[0] : '' });
    } else {
      // Reset form for adding new goal
      reset({
        title: '',
        category: 'Academic', // Default category
        status: 'not-started', // Default status
        progressPercent: 0,
        targetDate: '',
        notes: ''
      });
    }
  }, [currentGoal, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const goalData = {
      ...data,
      portfolioId: portfolioId,
      progressPercent: parseInt(data.progressPercent, 10),
    };

    try {
      if (currentGoal) {
        await API.put(`/goal/update/${currentGoal._id}`, goalData);
        toast.success('Goal updated successfully!');
        if (onGoalUpdated) onGoalUpdated();
      } else {
        await API.post('/goal/create', goalData);
        toast.success('Goal added successfully!');
        if (onGoalAdded) onGoalAdded();
      }
      reset();
    } catch (error) {
      console.error('Error submitting goal:', error);
      toast.error(error.response?.data?.message || 'Failed to save goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        >
          <option value="Academic">Academic</option>
          <option value="Career">Career</option>
          <option value="Personal">Personal</option>
          <option value="Skills">Skills</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          {...register('status', { required: 'Status is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
      </div>

      <div>
        <label htmlFor="progressPercent" className="block text-sm font-medium text-gray-700">Progress (%)</label>
        <input
          type="number"
          id="progressPercent"
          {...register('progressPercent', { required: 'Progress is required', min: 0, max: 100 })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        />
        {errors.progressPercent && <p className="text-red-500 text-sm mt-1">{errors.progressPercent.message}</p>}
      </div>

      <div>
        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">Target Date (Optional)</label>
        <input
          type="date"
          id="targetDate"
          {...register('targetDate')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea
          id="notes"
          rows="3"
          {...register('notes')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        ></textarea>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Saving...' : currentGoal ? 'Update Goal' : 'Add Goal'}
      </Button>
    </form>
  );
};

const Goals = () => {
  const { user, portfolio } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGoals = async () => {
    if (!portfolio?._id) {
      setLoading(false);
      return;
    }
    try {
      const response = await API.get(`/goal/list/${portfolio._id}`);
      setGoals(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [portfolio, user]); // Added user to dependency array as portfolio might depend on user being loaded

  const handleGoalAddedOrUpdated = () => {
    setIsModalOpen(false);
    setCurrentGoal(null);
    fetchGoals();
  };

  const handleAddGoalClick = () => {
    setCurrentGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goalId) => {
    setCurrentGoal(goals.find(goal => goal._id === goalId));
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await API.delete(`/goal/delete/${goalId}`);
        toast.success('Goal deleted successfully!');
        fetchGoals();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete goal.');
      }
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchQuery = searchQuery.toLowerCase();
    return (
      goal.title.toLowerCase().includes(matchQuery) ||
      goal.category.toLowerCase().includes(matchQuery) ||
      goal.status.toLowerCase().includes(matchQuery) ||
      (goal.notes && goal.notes.toLowerCase().includes(matchQuery))
    );
  });

  if (loading) {
    return <div className="text-center py-8">Loading goals...</div>;
  }

  if (!portfolio) {
    return (
      <div className="text-center py-8">
        <p>Please create your portfolio first to add goals.</p>
        {/* Assuming there's a route to create/view portfolio */}
        <Link to="/portfolio"><Button className="mt-4">Go to My Portfolio</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">My Goals</h1>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search goals..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <p className="text-lg text-gray-600">You haven't set any goals yet.</p>
          <Button onClick={handleAddGoalClick} className="mt-4"><PlusCircle size={20} className="mr-2" /> Set Your First Goal</Button>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentGoal ? "Edit Goal" : "Add New Goal"}>
        <GoalForm 
          portfolioId={portfolio._id} 
          onGoalAdded={handleGoalAddedOrUpdated} 
          onGoalUpdated={handleGoalAddedOrUpdated} 
          currentGoal={currentGoal}
        />
      </Modal>
    </div>
  );
};

export default Goals;