import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  FolderDot, 
  Lightbulb, 
  Goal, 
  Award, 
  Settings, 
  Users, 
  MessageSquareText 
} from 'lucide-react';

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null; // Only show sidebar if authenticated

  const studentNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Portfolio', icon: FolderDot, path: '/portfolio' },
    { name: 'Works', icon: Lightbulb, path: '/works' },
    { name: 'Reflections', icon: MessageSquareText, path: '/reflections' },
    { name: 'Goals', icon: Goal, path: '/goals' },
    { name: 'Badges', icon: Award, path: '/badges' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const teacherNavItems = [
    { name: 'Teacher Dashboard', icon: LayoutDashboard, path: '/teacher' },
    { name: 'All Students', icon: Users, path: '/teacher' }, // Points to same dashboard for now
  ];

  const navItems = user?.role === 'student' ? studentNavItems : user?.role === 'teacher' ? teacherNavItems : [];

  return (
    <aside className="w-64 bg-card shadow-lg p-4 h-full hidden md:flex flex-col border-r border-gray-200">
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors 
                  ${isActive ? 'bg-primary text-white hover:bg-primary' : ''}`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;