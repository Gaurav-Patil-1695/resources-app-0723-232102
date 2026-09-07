import { Navigate, Outlet, useLocation } from 'react-router-dom';

const getToken = () => localStorage.getItem('token');

const ProtectedRoute = () => {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
