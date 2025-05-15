// src/pages/MainDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainDashboard: React.FC = () => {
    const { userProfile, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>HR Platform Dashboard</h1>
                <button
                    onClick={() => logout()}
                    style={{
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>

            {userProfile && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h2>Welcome, {userProfile.first_name} {userProfile.last_name}</h2>
                    <p>Email: {userProfile.email}</p>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ marginBottom: '20px' }}>Select a Feature</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {/* Zoom Meetings Feature Card */}
                    <div
                        style={{
                            padding: '20px',
                            backgroundColor: '#f0f9ff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/zoom-dashboard')}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: '#2D8CFF',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM16.5 16.5H7.5V7.5H16.5V16.5Z" fill="white" />
                                    <path d="M14.25 10.5H9.75V13.5H14.25V10.5Z" fill="#2D8CFF" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '18px' }}>Zoom Meetings</h3>
                        </div>
                        <p style={{ color: '#4a5568' }}>Schedule and manage video conferences with your team</p>
                        <div style={{
                            marginTop: '15px',
                            padding: '10px 0',
                            textAlign: 'center',
                            backgroundColor: '#2D8CFF',
                            color: 'white',
                            borderRadius: '4px'
                        }}>
                            {userProfile?.zoomConnected ? "Manage Meetings" : "Connect with Zoom"}
                        </div>
                    </div>

                    {/* Document Signing Feature Card */}
                    <div
                        style={{
                            padding: '20px',
                            backgroundColor: '#f0fff4',
                            borderRadius: '8px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/documents')}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: '#4CAF50',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H5V4H19V20Z" />
                                    <path d="M12 18.5L16 14.5H13V10.5H11V14.5H8L12 18.5Z" />
                                    <path d="M11 6.5H13V8.5H11V6.5Z" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '18px' }}>Document Signing</h3>
                        </div>
                        <p style={{ color: '#4a5568' }}>Upload, send, and sign important documents electronically</p>
                        <div style={{
                            marginTop: '15px',
                            padding: '10px 0',
                            textAlign: 'center',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            borderRadius: '4px'
                        }}>
                            Manage Documents
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;