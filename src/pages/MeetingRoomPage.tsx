// src/pages/MeetingRoomPage.tsx
import React, { useRef, useEffect, useState } from 'react';
import uitoolkit, { CustomizationOptions } from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MeetingRoomPage: React.FC = () => {
    const sessionContainerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { isAuthenticated } = useAuth();

    // Default config (will be updated with authenticated JWT)
    const [config, setConfig] = useState<CustomizationOptions>({
        videoSDKJWT: "",
        sessionName: "test",
        userName: "React User",
        sessionPasscode: "123",
        featuresOptions: {
            preview: {
                enable: true,
            },
            virtualBackground: {
                enable: true,
                virtualBackgrounds: [
                    {
                        url: "https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop",
                    },
                ],
            },
        },
    });

    const getAuthenticatedJWT = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                'http://localhost:4000/authenticated',
                {
                    sessionName: config.sessionName,
                    role: 1
                },
                { withCredentials: true }
            );

            if (response.data.signature) {
                setConfig(prev => ({
                    ...prev,
                    videoSDKJWT: response.data.signature,
                    userName: `${response.data.user.firstName} ${response.data.user.lastName}`
                }));

                joinSession(response.data.signature);
            } else {
                setError('Failed to get authentication token');
            }
        } catch (err: any) {
            // Check if the error was about Zoom not being connected
            if (err.response?.data?.error?.includes('Zoom integration not connected')) {
                setError('Your account is not connected to Zoom. Please connect with Zoom first.');
            } else {
                setError(`Authentication error: ${err.response?.data?.error || err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const joinSession = (jwt: string) => {
        if (sessionContainerRef.current) {
            // Update config with JWT
            const updatedConfig = {
                ...config,
                videoSDKJWT: jwt
            };

            // Initialize UI toolkit with session container and config
            uitoolkit.joinSession(sessionContainerRef.current, updatedConfig);

            // Set callbacks
            uitoolkit.onSessionClosed(() => {
                console.log("session closed");
            });

            uitoolkit.onSessionDestroyed(() => {
                console.log("session destroyed");
                uitoolkit.destroy();
            });
        }
    };

    // Initialize when component mounts if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            getAuthenticatedJWT();
        }

        // Clean up on unmount
        return () => {
            uitoolkit.destroy();
        };
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Please log in with Zoom</h2>
                <p>You need to authenticate with Zoom to join the meeting.</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2>Initializing Meeting...</h2>
                    <p>Please wait while we set up your meeting room.</p>
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            )}

            <div
                ref={sessionContainerRef}
                id="sessionContainer"
                style={{ width: '100%', height: '100%' }}
            ></div>
        </div>
    );
};

export default MeetingRoomPage;