import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-3 px-6 bg-blue-900 text-center">
      <p className="text-sm text-yellow-300">
        Created with React & Tailwind CSS | {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;