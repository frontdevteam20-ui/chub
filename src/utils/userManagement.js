import { ref, set, get, remove } from 'firebase/database';
import { rtdb } from '../../firebaseConfig';

// Set user role in Firebase Realtime Database
export const setUserRole = async (uid, role) => {
  try {
    const userRef = ref(rtdb, `users/${uid}`);
    await set(userRef, {
      role: role,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

// Get user role from Firebase Realtime Database
export const getUserRole = async (uid) => {
  try {
    const userRef = ref(rtdb, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val().role : null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Get all users with their roles
export const getAllUsers = async () => {
  try {
    const usersRef = ref(rtdb, 'users');
    const snapshot = await get(usersRef);
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error('Error getting all users:', error);
    return {};
  }
};

// Delete user role
export const deleteUserRole = async (uid) => {
  try {
    const userRef = ref(rtdb, `users/${uid}`);
    await remove(userRef);
    return true;
  } catch (error) {
    console.error('Error deleting user role:', error);
    return false;
  }
};

// Update user role
export const updateUserRole = async (uid, newRole) => {
  try {
    const userRef = ref(rtdb, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      await set(userRef, {
        ...userData,
        role: newRole,
        updatedAt: new Date().toISOString()
      });
    } else {
      await setUserRole(uid, newRole);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

// Role validation
export const isValidRole = (role) => {
  const validRoles = ['admin', 'editor', 'viewer'];
  return validRoles.includes(role);
};

// Get role hierarchy level
export const getRoleLevel = (role) => {
  const roleHierarchy = {
    'admin': 3,
    'editor': 2,
    'viewer': 1
  };
  return roleHierarchy[role] || 0;
}; 