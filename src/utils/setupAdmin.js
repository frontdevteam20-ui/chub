import { getAuth } from 'firebase/auth';
import { setUserRole } from './userManagement';

// Function to set up the first admin user
export const setupFirstAdmin = async (email) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently logged in');
    }
    
    // Set the current user as admin
    const success = await setUserRole(user.uid, 'admin');
    
    if (success) {
      console.log('Successfully set up admin user:', user.email);
      return true;
    } else {
      throw new Error('Failed to set user role');
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
    return false;
  }
};

// Function to check if any admin exists
export const checkAdminExists = async () => {
  try {
    const { getAllUsers } = await import('./userManagement');
    const users = await getAllUsers();
    
    // Check if any user has admin role
    const hasAdmin = Object.values(users).some(user => user.role === 'admin');
    return hasAdmin;
  } catch (error) {
    console.error('Error checking for admin users:', error);
    return false;
  }
}; 