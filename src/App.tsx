import React from 'react';
import Game from './components/Game';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow flex items-center justify-center w-full p-4">
        <Game />
      </main>
      <Footer />
    </div>
  );
}

export default App;