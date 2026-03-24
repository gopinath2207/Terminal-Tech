import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import queryClient from './lib/queryClient';
import AppRouter from './routes/AppRouter';
import './index.css';

function App() {
    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );
}

export default App;
