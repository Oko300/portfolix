import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import WorkCard from '../../components/portfolio/WorkCard';
import GoalCard from '../../components/portfolio/GoalCard';
import BadgeCard from '../../components/portfolio/BadgeCard';
import ReflectionCard from '../../components/portfolio/ReflectionCard';
import { format } from 'date-fns';

const PublicPortfolio = () => {
  const { slug } = useParams(); // Using 'slug' as defined in the route /portfolio/:slug
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/portfolio/public/${slug}`);
        setPortfolio(res.data);

        // Increment view count - fire and forget, no need to wait or handle errors explicitly
        API.post(`/portfolio/view-count/${slug}`).catch(err => console.error("Failed to increment view count", err));

      } catch (error) {
        console.error('Error fetching public portfolio:', error);
        toast.error(error.response?.data?.message || 'Failed to load portfolio.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPublicPortfolio();
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center py-8">Loading portfolio...</div>;
  }

  if (!portfolio) {
    return <div className="text-center py-8 text-danger">Portfolio not found or is private.</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10">
        <img
          src={portfolio.userId?.avatar || 'https://via.placeholder.com/150'}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary-500 shadow-lg"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{portfolio.userId?.name}'s Portfolio</h1>
        <p className="text-xl text-gray-600">{portfolio.title || 'Digital Portfolio'}</p>
        {portfolio.description && <p className="text-md text-gray-700 mt-2 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: portfolio.description }}></p>}
        <p className="text-sm text-gray-500 mt-4">Views: {portfolio.viewCount}</p>
      </header>

      <main className="flex-1 space-y-10">
        {portfolio.works.length > 0 && (
          <section>
            <Card>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.works.map(work => <WorkCard key={work._id} work={work} isPublicView={true} />)}
              </div>
            </Card>
          </section>
        )}

        {portfolio.goals.length > 0 && (
          <section>
            <Card>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.goals.map(goal => <GoalCard key={goal._id} goal={goal} isPublicView={true} />)}
              </div>
            </Card>
          </section>
        )}

        {portfolio.badges.length > 0 && (
          <section>
            <Card>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">Badges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.badges.filter(badge => badge.isVerified).map(badge => <BadgeCard key={badge._id} badge={badge} isPublicView={true} />)}
              </div>
            </Card>
          </section>
        )}

        {portfolio.reflections.length > 0 && (
          <section>
            <Card>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">Reflections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.reflections.map(reflection => <ReflectionCard key={reflection._id} reflection={reflection} isPublicView={true} />)}
              </div>
            </Card>
          </section>
        )}

        {portfolio.feedback.length > 0 && (
          <section>
            <Card>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">Feedback</h2>
              <div className="space-y-4">
                {portfolio.feedback.map(f => (
                  <div key={f._id} className="border p-4 rounded-md bg-gray-50">
                    <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: f.content }}></p>
                    <p className="text-sm text-gray-500 mt-2">By {f.teacherId?.name} on {format(new Date(f.createdAt), 'PPP')}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}
      </main>

      <footer className="text-center mt-10 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {portfolio.userId?.name}'s Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;