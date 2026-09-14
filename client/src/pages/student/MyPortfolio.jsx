import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { WorkForm } from '../student/Works';
import { ReflectionForm } from '../student/Reflections';
import { BadgeForm } from '../student/Badges';
import { GoalForm } from '../student/Goals';
import WorkCard from '../../components/portfolio/WorkCard';
import ReflectionCard from '../../components/portfolio/ReflectionCard';
import GoalCard from '../../components/portfolio/GoalCard';
import BadgeCard from '../../components/portfolio/BadgeCard';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'; // Assuming a Tabs component
import { PlusCircle } from 'lucide-react';

const MyPortfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);

  const [activeTab, setActiveTab] = useState('works');
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  const [currentWork, setCurrentWork] = useState(null);
  const [currentReflection, setCurrentReflection] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [currentBadge, setCurrentBadge] = useState(null);

  const [works, setWorks] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [goals, setGoals] = useState([]);
  const [badges, setBadges] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);


  const fetchPortfolioContent = useCallback(async (currentPortfolioId) => {
    if (!currentPortfolioId) {
      setContentLoading(false);
      return;
    }
    setContentLoading(true);
    try {
      const [worksRes, reflectionsRes, goalsRes, badgesRes] = await Promise.all([
        API.get(`/work/list/${currentPortfolioId}`),
        API.get(`/reflection/list/${currentPortfolioId}`),
        API.get(`/goal/list/${currentPortfolioId}`),
        API.get(`/badge/list/${currentPortfolioId}`),
      ]);
      setWorks(worksRes.data);
      setReflections(reflectionsRes.data);
      setGoals(goalsRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load portfolio content.');
      console.error('Error fetching portfolio content:', error);
    } finally {
      setContentLoading(false);
    }
  }, []);

  
  useEffect(() => {
    const getPortfolioAndContent = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const res = await API.get('/portfolio/mine');
        setPortfolio(res.data);
        const id = res.data._id;
        fetchPortfolioContent(id);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        toast.error(error.response?.data?.message || 'Failed to load portfolio.');
        setContentLoading(false);
      }
    };

    getPortfolioAndContent();
  }, [fetchPortfolioContent, navigate, user]);

  // Handlers for successful form submissions (add/update)
  const handleWorkFormSuccess = () => {
    setIsWorkModalOpen(false);
    setCurrentWork(null);
    fetchPortfolioContent();
  };

  const handleReflectionFormSuccess = () => {
    setIsReflectionModalOpen(false);
    setCurrentReflection(null);
    fetchPortfolioContent();
  };

  const handleGoalFormSuccess = () => {
    setIsGoalModalOpen(false);
    setCurrentGoal(null);
    fetchPortfolioContent();
  };

  const handleBadgeFormSuccess = () => {
    setIsBadgeModalOpen(false);
    setCurrentBadge(null);
    fetchPortfolioContent();
  };

  // Handlers for opening modals for adding new items
  const handleAddWorkClick = () => {
    setCurrentWork(null);
    setIsWorkModalOpen(true);
  };

  const handleAddReflectionClick = () => {
    setCurrentReflection(null);
    setIsReflectionModalOpen(true);
  };

  const handleAddGoalClick = () => {
    setCurrentGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleAddBadgeClick = () => {
    setCurrentBadge(null);
    setIsBadgeModalOpen(true);
  };
  // Handlers for opening modals for editing existing items
  const handleEditWork = (workId) => {
    setCurrentWork(works.find(work => work._id === workId));
    setIsWorkModalOpen(true);
  };

  const handleEditReflection = (reflectionId) => {
    setCurrentReflection(reflections.find(reflection => reflection._id === reflectionId));
    setIsReflectionModalOpen(true);
  };

  const handleEditGoal = (goalId) => {
    setCurrentGoal(goals.find(goal => goal._id === goalId));
    setIsGoalModalOpen(true);
  };

  const handleEditBadge = (badgeId) => {
    setCurrentBadge(badges.find(badge => badge._id === badgeId));
    setIsBadgeModalOpen(true);
  };

  // Handlers for deleting items
  const handleDeleteWork = async (workId) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      try {
        await API.delete(`/work/delete/${workId}`);
        toast.success('Work deleted successfully!');
        fetchPortfolioContent();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete work.');
      }
    }
  };

  const handleDeleteReflection = async (reflectionId) => {
    if (window.confirm('Are you sure you want to delete this reflection?')) {
      try {
        await API.delete(`/reflection/delete/${reflectionId}`);
        toast.success('Reflection deleted successfully!');
        fetchPortfolioContent();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete reflection.');
      }
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await API.delete(`/goal/delete/${goalId}`);
        toast.success('Goal deleted successfully!');
        fetchPortfolioContent();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete goal.');
      }
    }
  };

  const handleDeleteBadge = async (badgeId) => {
    if (window.confirm('Are you sure you want to delete this badge?')) {
      try {
        await API.delete(`/badge/delete/${badgeId}`);
        toast.success('Badge deleted successfully!');
        fetchPortfolioContent();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete badge.');
      }
    }
  };



  if (authLoading || contentLoading) {
    return <div className="text-center py-8">Loading portfolio...</div>;
  }

  if (!portfolio) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">You don't have a portfolio yet.</p>
        <Button onClick={() => navigate('/create-portfolio')} className="mt-4">Create My Portfolio</Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">My Portfolio</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="works">Works</TabsTrigger>
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="works" className="py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Works</h2>
            <Button onClick={handleAddWorkClick}><PlusCircle size={20} className="mr-2" /> Add New Work</Button>
          </div>
          {works.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <WorkCard key={work._id} work={work} onEdit={handleEditWork} onDelete={handleDeleteWork} />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <p className="text-lg text-gray-600">You haven't added any works yet.</p>
              <Button onClick={handleAddWorkClick} className="mt-4"><PlusCircle size={20} className="mr-2" /> Add Your First Work</Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reflections" className="py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Reflections</h2>
            <Button onClick={handleAddReflectionClick}><PlusCircle size={20} className="mr-2" /> Add New Reflection</Button>
          </div>
          {reflections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reflections.map((reflection) => (
                <ReflectionCard key={reflection._id} reflection={reflection} onEdit={handleEditReflection} onDelete={handleDeleteReflection} />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <p className="text-lg text-gray-600">You haven't added any reflections yet.</p>
              <Button onClick={handleAddReflectionClick} className="mt-4"><PlusCircle size={20} className="mr-2" /> Add Your First Reflection</Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Goals</h2>
            <Button onClick={handleAddGoalClick}><PlusCircle size={20} className="mr-2" /> Add New Goal</Button>
          </div>
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <p className="text-lg text-gray-600">You haven't set any goals yet.</p>
              <Button onClick={handleAddGoalClick} className="mt-4"><PlusCircle size={20} className="mr-2" /> Set Your First Goal</Button>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="badges" className="py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Badges</h2>
            <Button onClick={handleAddBadgeClick}><PlusCircle size={20} className="mr-2" /> Add New Badge</Button>
          </div>
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <BadgeCard key={badge._id} badge={badge} onEdit={handleEditBadge} onDelete={handleDeleteBadge} />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <p className="text-lg text-gray-600">You haven't added any badges yet.</p>
              <Button onClick={handleAddBadgeClick} className="mt-4"><PlusCircle size={20} className="mr-2" /> Add Your First Badge</Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals for Add/Edit Forms */}
      <Modal isOpen={isWorkModalOpen} onClose={() => setIsWorkModalOpen(false)} title={currentWork ? "Edit Work" : "Add New Work"}>
        <WorkForm portfolioId={portfolio?._id} onWorkAdded={handleWorkFormSuccess} onWorkUpdated={handleWorkFormSuccess} currentWork={currentWork} />
      </Modal>

      <Modal isOpen={isReflectionModalOpen} onClose={() => setIsReflectionModalOpen(false)} title={currentReflection ? "Edit Reflection" : "Add New Reflection"}>
        <ReflectionForm portfolioId={portfolio?._id} onReflectionAdded={handleReflectionFormSuccess} onReflectionUpdated={handleReflectionFormSuccess} currentReflection={currentReflection} />
      </Modal>

      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={currentGoal ? "Edit Goal" : "Add New Goal"}>
        <GoalForm portfolioId={portfolio?._id} onGoalAdded={handleGoalFormSuccess} onGoalUpdated={handleGoalFormSuccess} currentGoal={currentGoal} />
      </Modal>

      <Modal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} title={currentBadge ? "Edit Badge" : "Add New Badge"}>
        <BadgeForm portfolioId={portfolio?._id} onBadgeAdded={handleBadgeFormSuccess} onBadgeUpdated={handleBadgeFormSuccess} currentBadge={currentBadge} />
      </Modal>
    </div>
  );
};

export default MyPortfolio;

