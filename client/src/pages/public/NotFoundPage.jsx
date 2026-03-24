import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';
import SEOHead from '../../components/ui/SEOHead';

const NotFoundPage = () => (
    <>
        <SEOHead title="404 — Page Not Found" />
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <p className="font-mono text-matrix text-8xl font-bold mb-4">404</p>
            <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or was moved.</p>
            <Link to="/" className="btn-matrix">
                <HomeIcon size={16} />
                Back to Home
            </Link>
        </div>
    </>
);

export default NotFoundPage;
