import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ReflectionCard from '../../components/portfolio/ReflectionCard';
import { useForm } from 'react-hook-form';
import RichTextEditor from '../../components/shared/RichTextEditor';
import { PlusCircle, Search } from 'lucide-react';

// ReflectionForm component - to be reused for adding/editing reflections
export const ReflectionForm = ({ portfolioId, workId, onReflectionAdded, onReflectionUpdated, currentReflection }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [whatILearned, setWhatILearned] = useState('');
  const [whatIdDoDifferently, setWhatIdDoDifferently] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentReflection) {
      reset(currentReflection);
      setWhatILearned(currentReflection.whatILearned);
      setWhatIdDoDifferently(currentReflection.whatIdDoDifferently);
    } else {
      reset();
      setWhatILearned('');
      setWhatIdDoDifferently('');
    }
  }, [currentReflection, reset]);


  const onSubmit = async (data) => {
    setLoading(true);
    const reflectionData = {
      ...data,
      whatILearned: whatILearned,
      whatIdDoDifferently: whatIdDoDifferently,
      workId: workId,
      portfolioId: portfolioId,
      skillsDemonstrated: data.skillsDemonstrated ? data.skillsDemonstrated.split(',').map(s => s.trim()) : [],
    };

    try {
      if (currentReflection) {
        await API.put(`/reflection/update/${currentReflection._id}`, reflectionData);
        toast.success('Reflection updated successfully!');
        if (onReflectionUpdated) onReflectionUpdated();
      } else {
        await API.post('/reflection/create', reflectionData);
        toast.success('Reflection added successfully!');
        if (onReflectionAdded) onReflectionAdded();
      }
      reset();
      setWhatILearned('');
      setWhatIdDoDifferently('');
    } catch (error) {
      console.error('Error submitting reflection:', error);
      toast.error(error.response?.data?.message || 'Failed to save reflection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="whatILearned" className="block text-sm font-medium text-gray-700">What I Learned</label>
        <RichTextEditor value={whatILearned} onChange={setWhatILearned} />
        {errors.whatILearned && <p className="text-danger text-sm mt-1">{errors.whatILearned.message}</p>}
      </div>

      <div>
        <label htmlFor="whatIdDoDifferently" className="block text-sm font-medium text-gray-700">What I'd Do Differently (Optional)</label>
        <RichTextEditor value={whatIdDoDifferently} onChange={setWhatIdDoDifferently} />
      </div>

      <div>
        <label htmlFor="skillsDemonstrated" className="block text-sm font-medium text-gray-700">Skills Demonstrated (comma-separated)</label>
        <input
          type="text"
          id="skillsDemonstrated"
          {...register('skillsDemonstrated')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
          placeholder="e.g., critical thinking, teamwork"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : currentReflection ? 'Update Reflection' : 'Add Reflection'}
      </Button>
    </form>
  );
};

// Reflections Page component
const Reflections = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [works, setWorks] = useState([]); // To get work titles
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReflection, setCurrentReflection] = useState(null);
  const [currentReflectionWork, setCurrentReflectionWork] = useState(null); // Work associated with the reflection
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReflectionsAndWorks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const portfolioRes = await API.get('/portfolio/mine');
      setPortfolio(portfolioRes.data);

      if (portfolioRes.data?._id) {
        const [reflectionsRes, worksRes] = await Promise.all([
          API.get(`/reflection/list-by-portfolio/${portfolioRes.data._id}`),
          API.get(`/work/list/${portfolioRes.data._id}`),
        ]);
        setReflections(reflectionsRes.data);
        setWorks(worksRes.data);
      }
    } catch (error) {
      console.error('Error fetching reflections or works:', error);
      toast.error(error.response?.data?.message || 'Failed to load reflections.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReflectionsAndWorks();
  }, [user]);

  const getWorkTitle = (workId) => works.find(w => w._id === workId)?.title || 'Unknown Work';

  const handleReflectionAddedOrUpdated = () => {
    setIsModalOpen(false);
    setCurrentReflection(null);
    setCurrentReflectionWork(null);
    fetchReflectionsAndWorks();
  };

  const handleEditReflection = (reflectionId) => {
    const reflectionToEdit = reflections.find(r => r._id === reflectionId);
    setCurrentReflection(reflectionToEdit);
    setCurrentReflectionWork(works.find(w => w._id === reflectionToEdit.workId));
    setIsModalOpen(true);
  };

  const handleDeleteReflection = async (reflectionId) => {
    if (window.confirm('Are you sure you want to delete this reflection?')) {
      try {
        await API.delete(`/reflection/delete/${reflectionId}`);
        toast.success('Reflection deleted successfully!');
        fetchReflectionsAndWorks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete reflection.');
      }
    }
  };



  const filteredReflections = reflections.filter(reflection => {
    const workTitle = getWorkTitle(reflection.workId);
    const matchQuery = searchQuery.toLowerCase();
    return (
      reflection.whatILearned.toLowerCase().includes(matchQuery) ||
      (reflection.whatIdDoDifferently && reflection.whatIdDoDifferently.toLowerCase().includes(matchQuery)) ||
      workTitle.toLowerCase().includes(matchQuery) ||
      (reflection.skillsDemonstrated && reflection.skillsDemonstrated.some(skill => skill.toLowerCase().includes(matchQuery)))
    );
  });

  if (loading) {
    return <div className="text-center py-8">Loading reflections...</div>;
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
        <h1 className="text-3xl font-bold text-gray-800">My Reflections</h1>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search reflections..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredReflections.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredReflections.map((reflection) => (
            <ReflectionCard
              key={reflection._id}
              reflection={reflection}
              workTitle={getWorkTitle(reflection.workId)}
              onEdit={handleEditReflection}
              onDelete={handleDeleteReflection}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <p className="text-lg text-gray-600">You haven't added any reflections yet.</p>
          <p className="text-gray-500 mt-2">Reflections are usually added for specific works. Go to <Link to="/works" className="text-primary hover:underline">My Works</Link> to add or view reflections for your works.</p>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentReflection ? "Edit Reflection" : `Add Reflection for ${currentReflectionWork?.title || 'Work'}`}>
        {currentReflectionWork ? (
          <ReflectionForm 
            portfolioId={portfolio._id} 
            workId={currentReflectionWork._id}
            onReflectionAdded={handleReflectionAddedOrUpdated} 
            onReflectionUpdated={handleReflectionAddedOrUpdated} 
            currentReflection={currentReflection}
          />
        ) : (
          <p className="text-danger">Please select a work to add/edit a reflection.</p>
        )}
      </Modal>
    </div>
  );
};

export default Reflections;

