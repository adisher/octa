// src/components/auth/AuthCallback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallback: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Completing authentication...');
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuthData } = useAuth();

    useEffect(() => {
        const completeAuth = async () => {
            try {
                const params = new URLSearchParams(location.search);

                // Check for error
                if (params.get('error')) {
                    setError('An error occurred during authentication. Please try again.');
                    return;
                }

                // Look for user data in URL
                const userParam = params.get('user');
                if (userParam) {
                    try {
                        // Use decodeURIComponent instead of base64
                        const userData = JSON.parse(decodeURIComponent(userParam));
                        console.log('User data from URL:', userData);

                        // Store in context/localStorage
                        setAuthData(userData.id, userData);

                        setStatusMessage('Authentication successful! Redirecting...');
                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 1000);
                    } catch (parseErr: unknown) {
                        console.error('Error parsing user data:', parseErr);
                        setError('Failed to parse authentication data. Error: ' +
                            (parseErr instanceof Error ? parseErr.message : 'Unknown error'));
                    }
                } else {
                    setError('No authentication data found in URL.');
                }
            } catch (err: unknown) {
                console.error('Auth callback error:', err);
                setError(`Authentication error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        };

        completeAuth();
    }, [location.search, navigate, setAuthData]);

    // Redirect after delay if error
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error, navigate]);

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            {error ? (
                <div>
                    <h2>Authentication Error</h2>
                    <p>{error}</p>
                    <p>Redirecting to home page in 5 seconds...</p>
                </div>
            ) : (
                <div>
                    <h2>Zoom Authentication</h2>
                    <p>{statusMessage}</p>
                </div>
            )}
        </div>
    );
};

export default AuthCallback;