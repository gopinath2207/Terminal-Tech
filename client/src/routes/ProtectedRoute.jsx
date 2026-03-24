import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <Spinner fullPage />;
    if (!user) return <Navigate to="/admin/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
