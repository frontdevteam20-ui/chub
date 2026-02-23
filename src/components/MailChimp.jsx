import React from 'react';
import { MdEmail } from 'react-icons/md';
import ComingSoon from './ComingSoon';

const MailChimp = ({ handleLogout, user }) => {
  return (
    <ComingSoon 
      title="MailChimp Integration"
      description="Seamlessly integrate with MailChimp to manage email campaigns, subscriber lists, and automated marketing workflows directly from your dashboard."
      icon={MdEmail}
      handleLogout={handleLogout}
      user={user}
    />
  );
};

export default MailChimp;
