import React, { useState, useEffect } from 'react';
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
import { PlusCircle } from 'lucide-react';

const MyPortfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [works, setWorks] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [goals, setGoals] = useState([]);
  const [badges, setBadges] = useState([]);
  const [activeTab, setActiveTab] = useState('works');
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [currentWork, setCurrentWork] = useState(null);
  const [currentReflection, setCurrentReflection] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [currentBadge, setCurrentBadge] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const res = await API.get('/portfolio/mine');
        setPortfolio(res.data);
        const id = res.data._id;
        const [w, r, g, b] = await Promise.all([
          API.get('/work/list/' + id),
          API.get('/reflection/list-by-portfolio/' + id),
          API.get('/goal/list/' + id),
          API.get('/badge/list/' + id),
        ]);
        setWorks(w.data || []);
        setReflections(r.data || []);
        setGoals(g.data || []);
        setBadges(b.data || []);
      } catch (err) {
        toast.error('Failed to load portfolio content.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const reload = async () => {
    if (!portfolio) return;
    const id = portfolio._id;
    const [w, r, g, b] = await Promise.all([
      API.get('/work/list/' + id),
      API.get('/reflection/list-by-portfolio/' + id),
      API.get('/goal/list/' + id),
      API.get('/badge/list/' + id),
    ]);
    setWorks(w.data || []);
    setReflections(r.data || []);
    setGoals(g.data || []);
    setBadges(b.data || []);
  };

  if (loading) return <div className="text-center py-8">Loading portfolio...</div>;
  if (!portfolio) return (
    <div className="text-center py-8">
      <p className="text-lg text-gray-600">No portfolio found.</p>
    </div>
  );

  const portfolioId = portfolio._id;
  const tabs = ['works', 'reflections', 'goals', 'badges'];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">My Portfolio</h1>
      <div className="flex border-b mb-6">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 capitalize font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'works' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Works</h2>
            <Button onClick={() => { setCurrentWork(null); setIsWorkModalOpen(true); }}><PlusCircle size={20} className="mr-2" />Add New Work</Button>
          </div>
          {works.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map(w => <WorkCard key={w._id} work={w} onEdit={(id) => { setCurrentWork(works.find(x => x._id === id)); setIsWorkModalOpen(true); }} onDelete={async (id) => { if(window.confirm('Delete?')) { await API.delete('/work/delete/'+id); reload(); }}} />)}
            </div>
          ) : (
            <Card className="text-center p-8"><p className="text-gray-600">No works yet.</p><Button onClick={() => setIsWorkModalOpen(true)} className="mt-4">Add Your First Work</Button></Card>
          )}
        </div>
      )}

      {activeTab === 'reflections' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Reflections</h2>
            <Button onClick={() => { setCurrentReflection(null); setIsReflectionModalOpen(true); }}><PlusCircle size={20} className="mr-2" />Add New Reflection</Button>
          </div>
          {reflections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reflections.map(r => <ReflectionCard key={r._id} reflection={r} onEdit={(id) => { setCurrentReflection(reflections.find(x => x._id === id)); setIsReflectionModalOpen(true); }} onDelete={async (id) => { if(window.confirm('Delete?')) { await API.delete('/reflection/delete/'+id); reload(); }}} />)}
            </div>
          ) : (
            <Card className="text-center p-8"><p className="text-gray-600">No reflections yet.</p><Button onClick={() => setIsReflectionModalOpen(true)} className="mt-4">Add Your First Reflection</Button></Card>
          )}
        </div>
      )}

      {activeTab === 'goals' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Goals</h2>
            <Button onClick={() => { setCurrentGoal(null); setIsGoalModalOpen(true); }}><PlusCircle size={20} className="mr-2" />Add New Goal</Button>
          </div>
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(g => <GoalCard key={g._id} goal={g} onEdit={(id) => { setCurrentGoal(goals.find(x => x._id === id)); setIsGoalModalOpen(true); }} onDelete={async (id) => { if(window.confirm('Delete?')) { await API.delete('/goal/delete/'+id); reload(); }}} />)}
            </div>
          ) : (
            <Card className="text-center p-8"><p className="text-gray-600">No goals yet.</p><Button onClick={() => setIsGoalModalOpen(true)} className="mt-4">Set Your First Goal</Button></Card>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Badges</h2>
            <Button onClick={() => { setCurrentBadge(null); setIsBadgeModalOpen(true); }}><PlusCircle size={20} className="mr-2" />Add New Badge</Button>
          </div>
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map(b => <BadgeCard key={b._id} badge={b} onEdit={(id) => { setCurrentBadge(badges.find(x => x._id === id)); setIsBadgeModalOpen(true); }} onDelete={async (id) => { if(window.confirm('Delete?')) { await API.delete('/badge/delete/'+id); reload(); }}} />)}
            </div>
          ) : (
            <Card className="text-center p-8"><p className="text-gray-600">No badges yet.</p><Button onClick={() => setIsBadgeModalOpen(true)} className="mt-4">Add Your First Badge</Button></Card>
          )}
        </div>
      )}

      <Modal isOpen={isWorkModalOpen} onClose={() => setIsWorkModalOpen(false)} title={currentWork ? 'Edit Work' : 'Add New Work'}>
        <WorkForm portfolioId={portfolioId} onWorkAdded={() => { setIsWorkModalOpen(false); reload(); }} onWorkUpdated={() => { setIsWorkModalOpen(false); reload(); }} currentWork={currentWork} />
      </Modal>
      <Modal isOpen={isReflectionModalOpen} onClose={() => setIsReflectionModalOpen(false)} title={currentReflection ? 'Edit Reflection' : 'Add New Reflection'}>
        <ReflectionForm portfolioId={portfolioId} onReflectionAdded={() => { setIsReflectionModalOpen(false); reload(); }} onReflectionUpdated={() => { setIsReflectionModalOpen(false); reload(); }} currentReflection={currentReflection} />
      </Modal>
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={currentGoal ? 'Edit Goal' : 'Add New Goal'}>
        <GoalForm portfolioId={portfolioId} onGoalAdded={() => { setIsGoalModalOpen(false); reload(); }} onGoalUpdated={() => { setIsGoalModalOpen(false); reload(); }} currentGoal={currentGoal} />
      </Modal>
      <Modal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} title={currentBadge ? 'Edit Badge' : 'Add New Badge'}>
        <BadgeForm portfolioId={portfolioId} onBadgeAdded={() => { setIsBadgeModalOpen(false); reload(); }} onBadgeUpdated={() => { setIsBadgeModalOpen(false); reload(); }} currentBadge={currentBadge} />
      </Modal>
    </div>
  );
};

export default MyPortfolio;
