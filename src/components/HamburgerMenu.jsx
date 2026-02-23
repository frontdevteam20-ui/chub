import React, { useState } from 'react';
import { HamburgerButton, Sidebar } from './sidebar';

function HamburgerMenu({ handleLogout, user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <HamburgerButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
      />
      <Sidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        handleLogout={handleLogout}
        user={user}
      />
    </>
  );
}

export default HamburgerMenu;