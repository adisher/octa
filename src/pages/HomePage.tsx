// src/pages/HomePage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const HomePage: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>HR Platform</h1>
                <p>Manage meetings and document signatures in one place</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <p>Loading...</p>
                </div>
            ) : (
                !isAuthenticated && <AuthForm />
            )}
        </div>
    );
};

export default HomePage;