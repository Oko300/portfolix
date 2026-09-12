import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { UploadCloud, Target, Share2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-gray-800">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 lg:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-accent mb-4">
            Showcase Your Growth, Not Just Your Grades
          </h1>
          <p className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            A digital portfolio for students to collect work, track skills, and open doors.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">Get Started Free</Button>
            </Link>
            <Link to="/portfolio/demo-slug"> {/* Placeholder for a public demo portfolio */}
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                View Demo Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-md text-center">
              <UploadCloud size={60} className="text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Upload Work</h3>
              <p className="text-gray-600">Easily upload assignments, projects, and achievements in various formats.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-md text-center">
              <Target size={60} className="text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Track Goals</h3>
              <p className="text-gray-600">Set and monitor your learning goals with progress tracking.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-md text-center">
              <Share2 size={60} className="text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Share Portfolio</h3>
              <p className="text-gray-600">Generate public links and export your portfolio as a professional PDF.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16 lg:py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-5xl font-bold text-primary">500+</p>
              <p className="text-gray-600 text-lg">Students</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary">20+</p>
              <p className="text-gray-600 text-lg">Schools</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary">100%</p>
              <p className="text-gray-600 text-lg">Free</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;