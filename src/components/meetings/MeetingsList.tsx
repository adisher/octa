// src/components/meetings/MeetingsList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Meeting {
    id: string;
    topic: string;
    start_time: string;
    duration: number;
    join_url: string;
}

const MeetingsList: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userProfile, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchMeetings = async () => {
            if (!isAuthenticated || !userProfile) {
                console.log("Not authenticated or no user profile, skipping meetings fetch");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching meetings for user:", userProfile.id);
                setLoading(true);

                // Pass the user ID in the query parameters
                const response = await axios.get(`http://localhost:4000/api/meetings?userId=${userProfile.id}`, {
                    withCredentials: true
                });

                console.log("Meetings response:", response.data);
                setMeetings(response.data.meetings || []);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching meetings:", err);
                setError('Failed to load meetings: ' + (err.response?.data?.error || err.message));
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [isAuthenticated, userProfile]);

    const handleDeleteMeeting = async (meetingId: string) => {
        if (!userProfile) return;

        try {
            await axios.delete(`http://localhost:4000/api/meetings/${meetingId}?userId=${userProfile.id}`, {
                withCredentials: true
            });

            // Update meetings list after delete
            setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
        } catch (err: any) {
            console.error("Error deleting meeting:", err);
            setError('Failed to delete meeting: ' + (err.response?.data?.error || err.message));
        }
    };

    if (!isAuthenticated || !userProfile) {
        return (
            <div>
                <p>Please login with Zoom to view your meetings.</p>
            </div>
        );
    }

    if (loading) return <div>Loading meetings...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="meetings-list">
            <h2>Your Zoom Meetings</h2>
            {meetings.length === 0 ? (
                <p>You don't have any scheduled meetings.</p>
            ) : (
                <div>
                    {meetings.map(meeting => (
                        <div key={meeting.id} className="meeting-item" style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <h3>{meeting.topic}</h3>
                            <p>Start Time: {new Date(meeting.start_time).toLocaleString()}</p>
                            <p>Duration: {meeting.duration} minutes</p>
                            <div className="meeting-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <a
                                    href={meeting.join_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="join-btn"
                                    style={{
                                        backgroundColor: '#2D8CFF',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Join Meeting
                                </a>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteMeeting(meeting.id)}
                                    style={{
                                        backgroundColor: '#ff4d4f',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};

export default MeetingsList;