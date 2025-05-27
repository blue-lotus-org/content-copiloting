import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
        <p>Made by Blue Lotus (<a href="https://lotuschain.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">Lotus Chain Organization</a>) &copy; 2023 - {currentYear}.</p>
        <p className="mt-1">Work by using Gemini. For demonstration purposes.</p>
      </div>
    </footer>
  );
};

export default Footer;