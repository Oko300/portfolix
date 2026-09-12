import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios'; // Assuming API instance is in this path
import { toast } from 'react-toastify';

const ReviewStudent = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [works, setWorks] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student portfolio data
        const portfolioRes = await API.get(`/portfolio/user/${studentId}`);
        setPortfolio(portfolioRes.data);

        // Fetch student user details for name
        const studentRes = await API.get(`/user/${studentId}`);
        setStudent(studentRes.data);

        // Fetch student works
        const worksRes = await API.get(`/work/user/${studentId}`);
        setWorks(worksRes.data);

      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load student data.');
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [studentId]);
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Feedback cannot be empty.');
      return;
    }
    setSubmittingFeedback(true);
    try {
      await API.post('/feedback', {
        studentId,
        teacherId: 'YOUR_TEACHER_ID_HERE', // This should come from auth context in a real app
        portfolioId: portfolio?._id,
        feedbackText: feedback,
      });
      toast.success('Feedback submitted successfully!');
      setFeedback(''); // Clear the feedback form
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback.');
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading student portfolio...</div>;
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-lg p-4">
        <p className="text-red-500 mb-4">No portfolio found for this student.</p>
        <p>Please ensure the student has created a portfolio.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Review Student: {student?.firstName} {student?.lastName}</h1>
        <p className="text-gray-600 mb-4">Portfolio ID: {portfolio?._id}</p>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Student Information</h2>
          <p className="text-gray-700"><span className="font-medium">Name:</span> {student?.firstName} {student?.lastName}</p>
          <p className="text-gray-700"><span className="font-medium">Bio:</span> {portfolio?.bio || 'N/A'}</p>
          <p className="text-gray-700"><span className="font-medium">Academic Year:</span> {portfolio?.academicYear || 'N/A'}</p>
          <p className="text-gray-700"><span className="font-medium">Program:</span> {portfolio?.program || 'N/A'}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Works</h2>
        {works.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <div key={work._id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{work.title}</h3>
                <p className="text-gray-600">{work.description}</p>
                {/* Add more work details if needed */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No works submitted by this student yet.</p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Provide Feedback</h2>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              id="feedback"
              rows="6"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submittingFeedback}
          >
            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewStudent;




