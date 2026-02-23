import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useRBAC } from './contexts/RBACContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboards from './components/Dashboards';
import Blogs from './components/blogs/Blogs';
import CreateBlog from './components/blogs/CreateBlog';
import EditBlog from './components/blogs/EditBlog';
import Brochures from './components/brochures/Brochures';
import Forms from './components/forms/Forms';
import Pricing from './components/pricing/Pricing';
import Users from './components/users/Users';
import Leads from './components/leads/Leads';
import ImportLeads from './components/leads/ImportLeads';
import WebAnalytics from './components/analytics/WebAnalytics';
import CalendlyDemos from './components/analytics/CalendlyDemos';
import UserRoleManagement from './components/UserRoleManagement';
import GeoView from './components/analytics/GeoView';
import Acquisition from './components/analytics/Acquisition';
import Chatbot from './components/Chatbot';
import MailChimp from './components/MailChimp';
import WhatsApp from './components/WhatsApp';
import EditorDashboard from './components/dashboard/EditorDashboard';

function EditBlogWrapper(props) {
  const { id } = useParams();
  return <EditBlog {...props} blogId={id} />;
}

export default function AppRoutes({ user, handleLogout, authInitialized, setUser, auth }) {
  const { userRole, loading: rbacLoading } = useRBAC();

  if (!authInitialized || rbacLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/admin/overview" replace /> : <Login auth={auth} setUser={setUser} />
      } />
      <Route path="/admin/overview" element={
        <ProtectedRoute user={user}>
          {userRole === 'admin' ? (
            <Dashboards handleLogout={handleLogout} user={user} />
          ) : (
            <EditorDashboard handleLogout={handleLogout} user={user} />
          )}
        </ProtectedRoute>
      } />
      <Route path="/admin/blogs" element={
        <ProtectedRoute user={user}>
          <Blogs handleLogout={handleLogout} user={user} />
        </ProtectedRoute>
      } />
      <Route path="/blogs/create" element={
        <ProtectedRoute user={user}>
          <CreateBlog handleLogout={handleLogout} user={user} />
        </ProtectedRoute>
      } />
      <Route path="/blogs/edit/:id" element={
        <ProtectedRoute user={user}>
          <EditBlogWrapper handleLogout={handleLogout} user={user} />
        </ProtectedRoute>
      } />
      <Route path="/admin/leads" element={
        (userRole === 'admin' || userRole !== 'editor') ? (
          <ProtectedRoute user={user}>
            <Leads handleLogout={handleLogout} />
          </ProtectedRoute>
        ) : (
          <Navigate to="/admin/dashboard" replace />
        )
      } />
      <Route path="/admin/leads/import" element={
        (userRole === 'admin' || userRole !== 'editor') ? (
          <ProtectedRoute user={user}>
            <ImportLeads handleLogout={handleLogout} />
          </ProtectedRoute>
        ) : (
          <Navigate to="/admin/dashboard" replace />
        )
      } />
   
      <Route path="/admin/analytics" element={
        <ProtectedRoute user={user}>
          <WebAnalytics handleLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics/geo" element={
        <ProtectedRoute user={user}>
          <GeoView handleLogout={handleLogout} />
        </ProtectedRoute>
      } />

        <Route path="/admin/analytics/acquisition" element={
        <ProtectedRoute user={user}>
            <Acquisition handleLogout={handleLogout} />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute user={user}>
          <Users handleLogout={handleLogout} user={user} />
        </ProtectedRoute>
      } />
       


      <Route path="/admin/brochures" element={
        <ProtectedRoute user={user}>
          <Brochures handleLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/admin/forms" element={
        <ProtectedRoute user={user}>
          <Forms handleLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/admin/pricing" element={
        <ProtectedRoute user={user}>
          <Pricing handleLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/admin/calendly-demos" element={
        (userRole === 'admin' || userRole !== 'editor') ? (
          <ProtectedRoute user={user}>
            <CalendlyDemos handleLogout={handleLogout} />
          </ProtectedRoute>
        ) : (
          <Navigate to="/admin/dashboard" replace />
        )
      } />
      <Route path="/admin/chatbot" element={
        (userRole === 'admin' || userRole !== 'editor') ? (
          <ProtectedRoute user={user}>
            <Chatbot handleLogout={handleLogout} user={user} />
          </ProtectedRoute>
        ) : (
          <Navigate to="/admin/dashboard" replace />
        )
      } />
      <Route path="/admin/mailchimp" element={
        (userRole === 'admin' || userRole !== 'editor') ? (
          <ProtectedRoute user={user}>
            <MailChimp handleLogout={handleLogout} user={user} />
          </ProtectedRoute>
        ) : (
          <Navigate to="/admin/dashboard" replace />
        )
      } />
      <Route path="/admin/whatsapp" element={
        (userRole === 'admin' || userRole !== 'editor') ? (
          <ProtectedRoute user={user}>
            <WhatsApp handleLogout={handleLogout} user={user} />
          </ProtectedRoute>
        ) : (
          <Navigate to="/admin/dashboard" replace />
        )
      } />
      <Route path="/admin/user-management" element={
        <ProtectedRoute user={user}>
          <UserRoleManagement />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to={user ? "/admin/dashboard" : "/login"} replace />} />
    </Routes>
  );
}