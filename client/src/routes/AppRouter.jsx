import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import ProtectedRoute from './ProtectedRoute';

// ── Public Pages ──────────────────────────────────────────────────────────────
const HomePage = lazy(() => import('../pages/public/HomePage'));
const PostPage = lazy(() => import('../pages/public/PostPage'));
const ProductPage = lazy(() => import('../pages/public/ProductPage'));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage'));


// ── Admin Pages ───────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const PostsPage = lazy(() => import('../pages/admin/PostsPage'));
const PostFormPage = lazy(() => import('../pages/admin/PostFormPage'));
const ProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
const ProductFormPage = lazy(() => import('../pages/admin/ProductFormPage'));

const AppRouter = () => (
    <BrowserRouter>
        <Suspense fallback={<Spinner fullPage />}>
            <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:slug" element={<PostPage />} />
                <Route path="/products/:slug" element={<ProductPage />} />


                {/* Admin auth */}
                <Route path="/admin/login" element={<LoginPage />} />

                {/* Protected admin routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<DashboardPage />} />
                    <Route path="/admin/posts" element={<PostsPage />} />
                    <Route path="/admin/posts/new" element={<PostFormPage />} />
                    <Route path="/admin/posts/edit/:id" element={<PostFormPage />} />
                    <Route path="/admin/products" element={<ProductsPage />} />
                    <Route path="/admin/products/new" element={<ProductFormPage />} />
                    <Route path="/admin/products/edit/:id" element={<ProductFormPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    </BrowserRouter>
);

export default AppRouter;
