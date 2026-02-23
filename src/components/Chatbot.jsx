import React from 'react';
import { MdChat } from 'react-icons/md';
import ComingSoon from './ComingSoon';

const Chatbot = ({ handleLogout, user }) => {
  return (
    <ComingSoon 
      title="AI Chatbot"
      description="Our intelligent chatbot will help automate customer support, lead qualification, and provide 24/7 assistance to your website visitors."
      icon={MdChat}
      handleLogout={handleLogout}
      user={user}
    />
  );
};

export default Chatbot;
