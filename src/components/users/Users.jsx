import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, serverTimestamp, deleteDoc, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import Navbar from '../Navbar';
import HamburgerMenu from "../HamburgerMenu";
import UserForm from "./UserForm";
import UserList from "./UserList";
import UserSearch from "./UserSearch";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3Ln4ByzURA8drIrvka2PYQbPRF_NbVAw",
  authDomain: "tech-cloud-erp-1532582683650.firebaseapp.com",
  databaseURL: "https://tech-cloud-erp-1532582683650.firebaseio.com",
  projectId: "tech-cloud-erp-1532582683650",
  storageBucket: "tech-cloud-erp-1532582683650.firebasestorage.app",
  messagingSenderId: "595044081279",
  appId: "1:595044081279:web:3320af7c412fbc33bb694a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const USERS_COLLECTION = 'users_manage';

function Users({ handleLogout, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'Active',
    role: 'editor', 
    lastLogin: new Date().toLocaleString(),
    createdAt: serverTimestamp()
  });
  
  const [errors, setErrors] = useState({});
  
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Ensure password is included in the user data
        usersList.push({ 
          id: doc.id, 
          ...userData,
          password: userData.password || '' // Include password in the returned data
        });
      });
      setUsers(usersList);
      return usersList;
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error("Error in initial data load:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any existing errors for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Create a copy of form data to work with
    const formDataCopy = { ...formData };
    
    // Validate form
    const validationErrors = {};
    if (!formDataCopy.name.trim()) validationErrors.name = 'Name is required';
    if (!formDataCopy.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formDataCopy.email.trim())) {
      validationErrors.email = 'Email is invalid';
    }
    
    // Only validate password if it's a new user
    if (!editingUser && !formDataCopy.password) {
      validationErrors.password = 'Password is required';
    } else if (formDataCopy.password && formDataCopy.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }
    
    try {
      setIsLoading(true);
      setErrors({});
      
      // Store the password before it gets cleared
      const password = formDataCopy.password;
      
      // Prepare user data
      const userData = { 
        name: formDataCopy.name.trim(),
        email: formDataCopy.email.trim(),
        phone: formDataCopy.phone ? formDataCopy.phone.trim() : '',
        status: formDataCopy.status || 'Active',
        password: formDataCopy.password,
        role: formDataCopy.role || 'editor',
        updatedAt: serverTimestamp()
      };
      
      if (editingUser) {
        console.log('Updating user:', editingUser.id, userData);
        // Update existing user
        await setDoc(doc(db, USERS_COLLECTION, editingUser.id), userData, { merge: true });
      } else {
        console.log('Creating new user with email:', formDataCopy.email);
        
        // Create new user in Firebase Auth with the stored password
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formDataCopy.email.trim(), 
          password
        );
        
        console.log('User created in Auth, UID:', userCredential.user.uid);
        
        // Add user data to Firestore including the password
        await setDoc(doc(db, USERS_COLLECTION, userCredential.user.uid), {
          ...userData,
          password: password, // Include the password in Firestore
          uid: userCredential.user.uid,
          createdAt: serverTimestamp(),
        });
        
        console.log('User data saved to Firestore');
      }
      
      // Refresh users list
      await fetchUsers();
      
      // Close modal and reset form
      closeModal();
      
      // Show success message
      alert(`User ${editingUser ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving user:', error);
      let errorMessage = 'An error occurred while saving the user.';
      
      // More specific error messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use by another account.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to perform this action.';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user edit
  const handleEdit = (user) => {
    setEditingUser(user);
    
    // Convert Firestore Timestamp to Date if needed
    let lastLogin = user.lastLogin;
    if (lastLogin && typeof lastLogin.toDate === 'function') {
      lastLogin = lastLogin.toDate().toISOString();
    } else if (typeof lastLogin === 'string') {
      lastLogin = new Date(lastLogin).toISOString();
    } else if (!lastLogin) {
      lastLogin = new Date().toISOString();
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '', // Don't show password for security
      status: user.status || 'Active',
      role: user.role || 'editor', // Ensure role is properly set when editing
      lastLogin: lastLogin,
      createdAt: user.createdAt || serverTimestamp()
    });
    setIsModalOpen(true);
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        // Get the user document to check if it has a UID (Firebase Auth user)
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // If user has a UID, delete from Firebase Auth
          if (userData.uid) {
            try {
              // Important: We can only delete the currently signed-in user
              // For admin user management, we'll just delete from Firestore
              // and the user won't be able to log in anymore
              console.log('Skipping Firebase Auth deletion - can only delete current user');
            } catch (authError) {
              console.error('Error handling user deletion from Auth:', authError);
            }
          }
          
          // Delete from Firestore
          await deleteDoc(doc(db, USERS_COLLECTION, userId));
          
          // Update local state
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
          
          // Show success message
          alert('User deleted successfully');
        }
      } catch (error) {
        console.error("Error deleting user: ", error);
        alert('Error deleting user: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset form to initial state
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    console.log('Closing modal...');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'Active',
      role: 'editor', // Reset to default role 'editor' when closing
      lastLogin: new Date().toLocaleString(),
      createdAt: serverTimestamp()
    });
    setEditingUser(null);
    setErrors({});
    setIsModalOpen(false);
  };

  const openModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'Active',
      role: 'editor',
      lastLogin: new Date().toLocaleString(),
      createdAt: serverTimestamp()
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSearchChange = (value) => setSearchTerm(value);

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      <Navbar handleLogout={handleLogout} />
      <HamburgerMenu handleLogout={handleLogout} />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-500">Manage your users and their permissions</p>
        </div>
        <UserSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddUser={openModal}
        />
        <UserList 
          users={users}
          searchTerm={searchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingUser 
                    ? 'Update the user details below' 
                    : 'Fill in the details to create a new user'}
                </p>
              </div>
              <button 
                onClick={closeModal}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200 disabled:opacity-50"
                aria-label="Close"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <UserForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClose={closeModal}
              isSubmitting={isLoading}
              errors={errors}
              editingUser={!!editingUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
