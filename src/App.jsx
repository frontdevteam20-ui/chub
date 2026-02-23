import { useState, useRef } from 'react'
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import reactLogo from './assets/react.svg';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './components/Login';
import Dashboards from './components/Dashboards';
import ProtectedRoute from './components/ProtectedRoute';
import Blogs from './components/blogs/Blogs';
import CreateBlog from './components/blogs/CreateBlog';
import EditBlog from './components/blogs/EditBlog';
import UserRoleManagement from './components/UserRoleManagement';
import Footer from './components/Footer';
import { RBACProvider, useRBAC } from './contexts/RBACContext';
import { ref as dbRef, push as dbPush, set as dbSet } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import AppRoutes from './AppRoutes';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3Ln4ByzURA8drIrvka2PYQbPRF_NbVAw",
  authDomain: "tech-cloud-erp-1532582683650.firebaseapp.com",
  databaseURL: "https://tech-cloud-erp-1532582683650.firebaseio.com",
  projectId: "tech-cloud-erp-1532582683650",
  storageBucket: "tech-cloud-erp-1532582683650.firebasestorage.app",
  messagingSenderId: "595044081279",
  appId: "1:595044081279:web:3320af7c412fbc33bb694a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setAuthInitialized(true);
      } else {
        setUser(null);
        setAuthInitialized(true);
        // Clear any existing auth state
        localStorage.removeItem('userRole');
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (user) {
        // Log logout event in IST
        try {
          const logRef = dbRef(rtdb, `loginLogs/${user.uid}`);
          const newLogRef = dbPush(logRef);
          // Get IST time
          const now = new Date();
          const istOffset = 5.5 * 60 * 60 * 1000;
          const istTime = new Date(now.getTime() + istOffset);
          await dbSet(newLogRef, {
            email: user.email,
            logoutAt: istTime.toISOString(),
          });
        } catch (logError) {
          console.error('Error logging logout event:', logError);
          // Continue with logout even if logging fails
        }
      }
      
      // Clear local storage and state first
      localStorage.removeItem('userRole');
      setUser(null);
      
      // Then sign out from Firebase
      await signOut(auth);
      console.log('User successfully logged out');
      
      // Force reload to ensure clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout by clearing user state even if signOut fails
      localStorage.removeItem('userRole');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    
      <RBACProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">
              <AppRoutes user={user} handleLogout={handleLogout} authInitialized={authInitialized} setUser={setUser} auth={auth} />
            </div>
            <Footer />
          </div>
        </Router>
      </RBACProvider>
    
  );
}

// Helper wrapper to use useParams in route element
function EditBlogWrapper(props) {
  const { id } = useParams();
  return <EditBlog {...props} blogId={id} />;
}

export default App