import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { LogOut, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? (user.role === 'student' ? '/dashboard' : '/teacher') : '/'} className="text-2xl font-bold text-accent">
          Portfolix
        </Link>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:block">Welcome, {user?.name.split(' ')[0]}</span>
              <Link to="/settings" className="flex items-center gap-1 hover:text-accent transition-colors">
                <UserCircle size={20} />
                <span className="hidden md:block">Profile</span>
              </Link>
              <Button variant="ghost" onClick={logout} className="flex items-center gap-1">
                <LogOut size={20} />
                <span className="hidden md:block">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;