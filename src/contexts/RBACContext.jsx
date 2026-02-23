import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const RBACContext = createContext();

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

export const RBACProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    if (!uid) return null;
    try {
      const userDoc = await getDoc(doc(db, 'users_manage', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.role || 'viewer'; // Default to viewer if no role
      }
      return 'viewer';
    } catch (error) {
      console.error('Error fetching user role from Firestore:', error);
      return 'viewer';
    }
  };

  // Listen for auth state changes and fetch role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setLoading(true);
        let role = localStorage.getItem('userRole');
        if (!role) {
          role = await fetchUserRole(user.uid);
          localStorage.setItem('userRole', role);
        }
        setUserRole(role);
        setLoading(false);
      } else {
        setUserRole(null);
        localStorage.removeItem('userRole');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check if user has specific permission
  const hasPermission = (requiredRole) => {
    if (!userRole) return false;
    const roleHierarchy = {
      'admin': 3,
      'editor': 2,
      'viewer': 1
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  const value = {
    userRole,
    loading,
    hasPermission,
    hasRole,
    fetchUserRole
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}; 