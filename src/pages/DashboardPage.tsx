// src/pages/DashboardPage.tsx (updated)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { useAuth } from '../context/AuthContext';
import MeetingsList from '../components/meetings/MeetingsList';
import CreateMeetingForm from '../components/meetings/CreateMeetingForm';

const DashboardPage: React.FC = () => {
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const { userProfile, logout, loading } = useAuth();
    const [pageReady, setPageReady] = useState<boolean>(false);
    const navigate = useNavigate(); // Add this

    // Add a check to ensure userProfile is loaded
    useEffect(() => {
        if (userProfile && !loading) {
            console.log("Dashboard has user profile:", userProfile);
            setPageReady(true);
        } else {
            console.log("Dashboard waiting for user profile...");
        }
    }, [userProfile, loading]);

    const handleMeetingCreated = () => {
        setShowCreateForm(false);
        // You would typically refresh the meetings list here
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Loading...</h2>
            <p>Please wait while we prepare your dashboard.</p>
        </div>
    );

    if (!pageReady) return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Preparing Dashboard</h2>
            <p>Setting up your Zoom integration...</p>
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>HR Platform Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Add Navigation Buttons */}
                    <button
                        onClick={() => navigate('/documents')}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            cursor: 'pointer'
                        }}
                    >
                        Documents
                    </button>
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
            </div>

            {userProfile && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h2>Welcome, {userProfile.first_name} {userProfile.last_name}</h2>
                    <p>Email: {userProfile.email}</p>
                    <p>User ID: {userProfile.id}</p>
                </div>
            )}

            <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
                <h3>Platform Features</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <div
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        style={{
                            padding: '15px',
                            backgroundColor: '#2D8CFF',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flex: 1,
                            textAlign: 'center'
                        }}
                    >
                        <h4>Zoom Meetings</h4>
                        <p style={{ fontSize: '14px' }}>Schedule and manage video calls</p>
                    </div>
                    <div
                        onClick={() => navigate('/documents')}
                        style={{
                            padding: '15px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flex: 1,
                            textAlign: 'center'
                        }}
                    >
                        <h4>Document Signing</h4>
                        <p style={{ fontSize: '14px' }}>Upload and sign important documents</p>
                    </div>
                </div>
            </div>

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Your Zoom Meetings</h3>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            style={{
                                backgroundColor: '#2D8CFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 16px',
                                cursor: 'pointer'
                            }}
                        >
                            Create Meeting
                        </button>
                    </div>
                    <MeetingsList />
                </div>
            )}
        </div>
    );
};

export default DashboardPage;