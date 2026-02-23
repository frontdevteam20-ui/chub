import React from 'react';
import { MdMessage } from 'react-icons/md';
import ComingSoon from './ComingSoon';

const WhatsApp = ({ handleLogout, user }) => {
  return (
    <ComingSoon 
      title="WhatsApp Integration"
      description="Connect your WhatsApp Business account to manage customer conversations, send automated messages, and provide seamless customer support directly from your dashboard."
      icon={MdMessage}
      handleLogout={handleLogout}
      user={user}
    />
  );
};

export default WhatsApp;
