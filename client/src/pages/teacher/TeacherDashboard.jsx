import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get('/portfolio/all');
        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students.filter(student =>
        student.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.userId?.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, students]);

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Student Portfolios</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Student Email</th>
                  <th className="p-3">Visibility</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((portfolio) => (
                  <tr key={portfolio._id}>
                    <td className="p-3 whitespace-nowrap">{portfolio.userId?.name || 'N/A'}</td>
                    <td className="p-3 whitespace-nowrap">{portfolio.userId?.email || 'N/A'}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${portfolio.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {portfolio.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <Link to={`/teacher/student/${portfolio._id}`}>
                        <Button variant="secondary" size="sm">Review Portfolio</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeacherDashboard;