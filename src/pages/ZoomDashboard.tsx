// src/pages/ZoomDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MeetingsList from '../components/meetings/MeetingsList';
import CreateMeetingForm from '../components/meetings/CreateMeetingForm';

const ZoomDashboard: React.FC = () => {
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [zoomAuthenticated, setZoomAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkZoomAuth = async () => {
            try {
                // Check with the server if zoom is connected
                const response = await axios.get('http://localhost:4000/api/auth/status', {
                    withCredentials: true
                });

                setZoomAuthenticated(response.data.zoomConnected);
                setLoading(false);
            } catch (error) {
                console.error('Error checking Zoom auth:', error);
                setZoomAuthenticated(false);
                setLoading(false);
            }
        };

        checkZoomAuth();
    }, []);

    const connectWithZoom = () => {
        window.location.href = 'http://localhost:4000/api/auth/zoom';
    };

    const handleMeetingCreated = () => {
        setShowCreateForm(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Zoom Meetings Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            backgroundColor: '#f5f5f5',
                            color: '#333',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Main Dashboard
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2>Loading...</h2>
                    <p>Please wait while we check your Zoom connection.</p>
                </div>
            ) : !zoomAuthenticated ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h2>Connect with Zoom</h2>
                    <p style={{ marginBottom: '20px' }}>You need to connect your Zoom account to manage meetings.</p>
                    <button
                        onClick={connectWithZoom}
                        style={{
                            backgroundColor: '#2D8CFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            margin: '0 auto'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM16.5 16.5H7.5V7.5H16.5V16.5Z" fill="white" />
                            <path d="M14.25 10.5H9.75V13.5H14.25V10.5Z" fill="#2D8CFF" />
                        </svg>
                        Connect with Zoom
                    </button>
                </div>
            ) : (
                <>
                    {showCreateForm ? (
                        <div>
                            <CreateMeetingForm onMeetingCreated={handleMeetingCreated} />
                            <button
                                onClick={() => setShowCreateForm(false)}
                                style={{
                                    marginTop: '20px',
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    padding: '8px 16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                style={{
                                    marginBottom: '20px',
                                    backgroundColor: '#2D8CFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '8px 16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Create New Meeting
                            </button>
                            <MeetingsList />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ZoomDashboard;