import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/student/Dashboard';
import MyPortfolio from './pages/student/MyPortfolio';
import Works from './pages/student/Works';
import Reflections from './pages/student/Reflections';
import Goals from './pages/student/Goals';
import Badges from './pages/student/Badges';
import Settings from './pages/student/Settings';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ReviewStudent from './pages/teacher/ReviewStudent';
import PublicPortfolio from './pages/public/PublicPortfolio';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// ProtectedRoute component
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect based on role if not authorized for the specific route
    if (role === 'student') return <Navigate to="/dashboard" replace />;
    if (role === 'teacher') return <Navigate to="/teacher" replace />;
    if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portfolio/:slug" element={<PublicPortfolio />} />

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<MyPortfolio />} />
              <Route path="/works" element={<Works />} />
              <Route path="/reflections" element={<Reflections />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/badges" element={<Badges />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Teacher Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/student/:id" element={<ReviewStudent />} />
            </Route>

            {/* Admin Protected Routes - Add later if needed */}
            {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route> */}

            {/* Catch-all for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;