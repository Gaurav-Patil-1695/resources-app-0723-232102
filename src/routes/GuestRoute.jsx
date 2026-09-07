import { Navigate, Outlet } from 'react-router-dom';

const getToken = () => localStorage.getItem('token');

const GuestRoute = ({ redirectTo = '/' }) => {
  const token = getToken();

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
