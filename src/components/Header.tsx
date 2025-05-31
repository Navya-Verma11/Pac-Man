import React from 'react';
import { Ghost } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-blue-900 py-4 px-6 flex items-center justify-center">
      <div className="flex items-center">
        <Ghost size={36} className="text-yellow-400 mr-2" />
        <h1 className="text-4xl font-extrabold text-yellow-400 tracking-wide">PAC-MAN</h1>
      </div>
    </header>
  );
};

export default Header;