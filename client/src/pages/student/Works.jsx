import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import WorkCard from '../../components/portfolio/WorkCard';
import { useForm } from 'react-hook-form';
import FileUploader from '../../components/shared/FileUploader';
import RichTextEditor from '../../components/shared/RichTextEditor';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// WorkForm component - to be reused for adding/editing works
export const WorkForm = ({ portfolioId, onWorkAdded, onWorkUpdated, currentWork }) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentWork) {
      reset(currentWork);
      setDescription(currentWork.description);
      setSelectedFile({ name: currentWork.fileName, url: currentWork.fileUrl, type: currentWork.fileType });
    } else {
      reset();
      setDescription('');
      setSelectedFile(null);
    }
  }, [currentWork, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    for (const key in data) {
      if (key === 'tags') {
        formData.append(key, JSON.stringify(data[key].split(',').map(tag => tag.trim())));
      } else if (key !== 'file') { // Don't append file field directly, handle selectedFile separately
        formData.append(key, data[key]);
      }
    }
    formData.append('description', description);
    if (selectedFile instanceof File) { // Only append if it's a new file object
      formData.append('file', selectedFile);
    } else if (currentWork && currentWork.fileUrl && !selectedFile) { 
      // If there was a file but now removed, clear it on backend
      formData.append('clearFile', 'true');
    }

    formData.append('portfolioId', portfolioId);

    try {
      if (currentWork) {
        await API.put(`/work/update/${currentWork._id}`, formData);
        toast.success('Work updated successfully!');
        if (onWorkUpdated) onWorkUpdated();
      } else {
        await API.post('/work/upload', formData);
        toast.success('Work added successfully!');
        if (onWorkAdded) onWorkAdded();
      }
      reset();
      setDescription('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting work:', error);
      toast.error(error.response?.data?.message || 'Failed to save work.');
    } finally {
      setLoading(false);
    }
  };



  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .doc, .docx
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xls, .xlsx
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .ppt, .pptx
    'text/plain',
    'video/mp4', 'video/webm', 'video/ogg', 
  ];

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
        {errors.title && <p className="text-danger text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
        >
          <option value="">Select a category</option>
          <option value="academic">Academic</option>
          <option value="skill">Skill</option>
          <option value="extracurricular">Extracurricular</option>
          <option value="project">Project</option>
        </select>
        {errors.category && <p className="text-danger text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          {...register('tags')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
          placeholder="e.g., react, nodejs, web development"
        />
      </div>

      <FileUploader 
        onFileSelect={setSelectedFile} 
        initialFile={currentWork ? { name: currentWork.fileName, url: currentWork.fileUrl, type: currentWork.fileType } : null}
        label="Upload Work File (Image, PDF, Doc, Video etc.)"
        allowedTypes={allowedFileTypes}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : currentWork ? 'Update Work' : 'Add Work'}
      </Button>
    </form>
  );
};

// Works Page component
const Works = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWork, setCurrentWork] = useState(null);

  const fetchWorks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const portfolioRes = await API.get('/portfolio/mine');
      setPortfolio(portfolioRes.data);

      if (portfolioRes.data?._id) {
        const worksRes = await API.get(`/work/list/${portfolioRes.data._id}`);
        setWorks(worksRes.data);
      }
    } catch (error) {
      console.error('Error fetching works:', error);
      toast.error(error.response?.data?.message || 'Failed to load works.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchWorks();
  }, [user]);

  const handleWorkAddedOrUpdated = () => {
    setIsModalOpen(false);
    setCurrentWork(null);
    fetchWorks();
  };

  const handleAddWorkClick = () => {
    setCurrentWork(null);
    setIsModalOpen(true);
  };

  const handleEditWork = (workId) => {
    setCurrentWork(works.find(work => work._id === workId));
    setIsModalOpen(true);
  };

  const handleDeleteWork = async (workId) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      try {
        await API.delete(`/work/delete/${workId}`);
        toast.success('Work deleted successfully!');
        fetchWorks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete work.');
      }
    }
  };


  if (loading) {
    return <div className="text-center py-8">Loading works...</div>;
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Works</h1>
        <Button onClick={handleAddWorkClick}><PlusCircle size={20} className="mr-2" /> Add New Work</Button>
      </div>

      {works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard
              key={work._id}
              work={work}
              onEdit={handleEditWork}
              onDelete={handleDeleteWork}
              onViewReflection={() => toast.info('Reflections are managed from My Portfolio page')}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <p className="text-lg text-gray-600">You haven't added any works yet.</p>
          <Button onClick={handleAddWorkClick} className="mt-4"><PlusCircle size={20} className="mr-2" /> Add Your First Work</Button>
        </Card>
      )}


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentWork ? "Edit Work" : "Add New Work"}>
        <WorkForm 
          portfolioId={portfolio._id} 
          onWorkAdded={handleWorkAddedOrUpdated} 
          onWorkUpdated={handleWorkAddedOrUpdated} 
          currentWork={currentWork}
        />
      </Modal>
    </div>
  );
};

export default Works;

