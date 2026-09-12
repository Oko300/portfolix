import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import WorkCard from '../../components/portfolio/WorkCard';
import GoalCard from '../../components/portfolio/GoalCard';
import FeedbackItem from '../../components/portfolio/FeedbackItem';
import { FolderDot, Target, Award, Eye } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { WorkForm } from '../student/Works';
import { GoalForm } from '../student/Goals';
import { BadgeForm } from '../student/Badges';

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [works, setWorks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [badgesCount, setBadgesCount] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioRes = await API.get('/portfolio/mine');
        setPortfolio(portfolioRes.data);

        const portfolioId = portfolioRes.data._id;

        const [worksRes, goalsRes, feedbackRes, badgesRes] = await Promise.all([
          API.get(`/work/list/${portfolioId}`),
          API.get(`/goal/list/${portfolioId}`),
          API.get(`/feedback/portfolio/${portfolioId}`),
          API.get(`/badge/count/${portfolioId}`),
        ]);

        setWorks(worksRes.data.slice(0, 3)); // Show last 3 works
        setGoals(goalsRes.data.slice(0, 3)); // Show 3 goals
        setFeedback(feedbackRes.data.slice(0, 3)); // Show last 3 feedback items
        setBadgesCount(badgesRes.data.count);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error(error.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);
  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600 mb-6 text-center">It looks like you haven't created your portfolio yet.</p>
        <Link to="/portfolio">
          <Button>Create My Portfolio</Button>
        </Link>
      </div>
    );
  }

  const handleWorkAdded = () => {
    setIsWorkModalOpen(false);
    toast.success('Work added successfully!');
    // Re-fetch all dashboard data to update counts and lists
    const refetchData = async () => {
      try {
        const portfolioRes = await API.get('/portfolio/mine');
        const portfolioId = portfolioRes.data._id;
        const [worksRes, goalsRes, feedbackRes, badgesRes] = await Promise.all([
          API.get(`/work/list/${portfolioId}`),
          API.get(`/goal/list/${portfolioId}`),
          API.get(`/feedback/portfolio/${portfolioId}`),
          API.get(`/badge/count/${portfolioId}`),
        ]);
        setWorks(worksRes.data.slice(0, 3));
        setGoals(goalsRes.data.slice(0, 3));
        setFeedback(feedbackRes.data.slice(0, 3));
        setBadgesCount(badgesRes.data.count);
      } catch (error) {
        console.error('Error refetching dashboard data:', error);
        toast.error(error.response?.data?.message || 'Failed to refetch dashboard data.');
      }
    };
    refetchData();
  };

  const handleGoalAdded = () => {
    setIsGoalModalOpen(false);
    toast.success('Goal added successfully!');
    const refetchData = async () => {
      try {
        const portfolioRes = await API.get('/portfolio/mine');
        const portfolioId = portfolioRes.data._id;
        const [worksRes, goalsRes, feedbackRes, badgesRes] = await Promise.all([
          API.get(`/work/list/${portfolioId}`),
          API.get(`/goal/list/${portfolioId}`),
          API.get(`/feedback/portfolio/${portfolioId}`),
          API.get(`/badge/count/${portfolioId}`),
        ]);
        setWorks(worksRes.data.slice(0, 3));
        setGoals(goalsRes.data.slice(0, 3));
        setFeedback(feedbackRes.data.slice(0, 3));
        setBadgesCount(badgesRes.data.count);
      } catch (error) {
        console.error('Error refetching dashboard data:', error);
        toast.error(error.response?.data?.message || 'Failed to refetch dashboard data.');
      }
    };
    refetchData();
  };

  const handleBadgeAdded = () => {
    setIsBadgeModalOpen(false);
    toast.success('Badge added successfully!');
    const refetchData = async () => {
      try {
        const portfolioRes = await API.get('/portfolio/mine');
        const portfolioId = portfolioRes.data._id;
        const [worksRes, goalsRes, feedbackRes, badgesRes] = await Promise.all([
          API.get(`/work/list/${portfolioId}`),
          API.get(`/goal/list/${portfolioId}`),
          API.get(`/feedback/portfolio/${portfolioId}`),
          API.get(`/badge/count/${portfolioId}`),
        ]);
        setWorks(worksRes.data.slice(0, 3));
        setGoals(goalsRes.data.slice(0, 3));
        setFeedback(feedbackRes.data.slice(0, 3));
        setBadgesCount(badgesRes.data.count);
      } catch (error) {
        console.error('Error refetching dashboard data:', error);
        toast.error(error.response?.data?.message || 'Failed to refetch dashboard data.');
      }
    };
    refetchData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name.split(' ')[0]} 👋</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <FolderDot size={32} className="text-primary mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-800">{works.length}</p>
          <p className="text-gray-600">Total Works</p>
        </Card>
        <Card className="text-center">
          <Target size={32} className="text-success mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-800">{goals.filter(g => g.status === 'completed').length}</p>
          <p className="text-gray-600">Goals Completed</p>
        </Card>
        <Card className="text-center">
          <Award size={32} className="text-accent mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-800">{badgesCount}</p>
          <p className="text-gray-600">Badges Earned</p>
        </Card>
        <Card className="text-center">
          <Eye size={32} className="text-gray-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-800">{portfolio.views}</p>
          <p className="text-gray-600">Portfolio Views</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setIsWorkModalOpen(true)}>+ Add Work</Button>
          <Button onClick={() => setIsGoalModalOpen(true)}>+ Add Goal</Button>
          <Button onClick={() => setIsBadgeModalOpen(true)}>+ Add Badge</Button>
          <Link to="/portfolio"><Button variant="outline">Share Portfolio</Button></Link>
        </div>
      </Card>

      {/* Recent Works */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Works</h3>
        {works.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <WorkCard key={work._id} work={work} showActions={false} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent works found. Add your first work!</p>
        )}
        <div className="text-right mt-4">
          <Link to="/works"><Button variant="ghost">View All Works</Button></Link>
        </div>
      </Card>

      {/* Goals Progress */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Goals Progress</h3>
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} showActions={false} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No goals set yet. Start tracking your progress!</p>
        )}
        <div className="text-right mt-4">
          <Link to="/goals"><Button variant="ghost">View All Goals</Button></Link>
        </div>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Feedback</h3>
        {feedback.length > 0 ? (
          <div className="space-y-4">
            {feedback.map((item) => (
              <FeedbackItem key={item._id} feedback={item} showActions={false} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No feedback received yet.</p>
        )}
      </Card>

      {/* Modals for Quick Actions */}
      <Modal isOpen={isWorkModalOpen} onClose={() => setIsWorkModalOpen(false)} title="Add New Work">
        <WorkForm portfolioId={portfolio?._id} onWorkAdded={handleWorkAdded} />
      </Modal>

      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Add New Goal">
        <GoalForm portfolioId={portfolio?._id} onGoalAdded={handleGoalAdded} />
      </Modal>

      <Modal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} title="Add New Badge">
        <BadgeForm portfolioId={portfolio?._id} onBadgeAdded={handleBadgeAdded} />
      </Modal>
    </div>
  );
};

export default Dashboard;