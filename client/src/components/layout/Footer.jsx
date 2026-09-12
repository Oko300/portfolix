import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white p-4 text-center mt-auto shadow-inner">
      <div className="container mx-auto">
        <p className="text-sm">© {new Date().getFullYear()} Portfolix. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;