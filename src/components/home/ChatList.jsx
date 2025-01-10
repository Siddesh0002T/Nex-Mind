import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const navigate = useNavigate();

  // Handle navigation on list item click
  const handleChatClick = (chatType) => {
    if (chatType === 'girlfriend') {
      navigate('/girlfriend-ai');
    } else if (chatType === 'friend') {
      navigate('/friend-ai');
    } else if (chatType === 'doppelganger') {
      navigate('/doppelganger-ai');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-lobster text-center text-pink-600 mb-6 animate-fadeIn">Choose Your AI Chat</h2>
      <ul>
        <li
          className="flex items-center justify-center bg-pink-500 text-white text-xl py-4 px-6 rounded-xl shadow-lg mb-6 hover:bg-pink-400 hover:scale-105 cursor-pointer transition-transform duration-300 animate-bounce"
          onClick={() => handleChatClick('girlfriend')}
        >
          <span className="text-3xl mr-4">❤️</span> Girlfriend AI
        </li>
        <li
          className="flex items-center justify-center bg-pink-500 text-white text-xl py-4 px-6 rounded-xl shadow-lg mb-6 hover:bg-pink-400 hover:scale-105 cursor-pointer transition-transform duration-300 animate-bounce"
          onClick={() => handleChatClick('friend')}
        >
          <span className="text-3xl mr-4">🤝</span> Friend AI
        </li>
        <li
          className="flex items-center justify-center bg-pink-500 text-white text-xl py-4 px-6 rounded-xl shadow-lg mb-6 hover:bg-pink-400 hover:scale-105 cursor-pointer transition-transform duration-300 animate-bounce"
          onClick={() => handleChatClick('doppelganger')}
        >
          <span className="text-3xl mr-4">👤</span> Doppelgänger AI
        </li>
      </ul>
    </div>
  );
};

export default ChatList;
