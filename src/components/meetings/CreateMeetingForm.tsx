// src/components/meetings/CreateMeetingForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface CreateMeetingFormProps {
    onMeetingCreated?: () => void;
}

interface FormData {
    topic: string;
    start_time: string;
    duration: number;
    agenda: string;
}

const CreateMeetingForm: React.FC<CreateMeetingFormProps> = ({ onMeetingCreated }) => {
    const { userProfile } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        topic: '',
        start_time: '',
        duration: 30,
        agenda: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // src/components/meetings/CreateMeetingForm.tsx - Update date formatting
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userProfile) {
            setError('User profile not available. Please log in again.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Format date-time for Zoom API
            // Ensure it's in the correct UTC ISO format that Zoom expects
            const startDate = new Date(formData.start_time);

            // Format to YYYY-MM-DDTHH:MM:SSZ format
            const formattedStartTime = startDate.toISOString();

            const formattedData = {
                topic: formData.topic,
                start_time: formattedStartTime,
                duration: parseInt(formData.duration.toString(), 10), // Ensure duration is a number
                agenda: formData.agenda,
                userId: userProfile.id
            };

            console.log("Creating meeting with data:", formattedData);

            const response = await axios.post('http://localhost:4000/api/meetings', formattedData, {
                withCredentials: true
            });

            console.log("Meeting created:", response.data);
            setLoading(false);

            // Clear form
            setFormData({
                topic: '',
                start_time: '',
                duration: 30,
                agenda: ''
            });

            // Notify parent component
            if (onMeetingCreated) {
                onMeetingCreated();
            }
        } catch (err: any) {
            console.error('Create meeting error:', err.response?.data || err);
            let errorMessage = 'Failed to create meeting';

            // Extract detailed error if available
            if (err.response?.data?.details) {
                errorMessage += ': ' + (err.response.data.details.message || err.response.data.error);
            } else if (err.response?.data?.error) {
                errorMessage += ': ' + err.response.data.error;
            } else if (err.message) {
                errorMessage += ': ' + err.message;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };
    // Rest of component remains the same...
    return (
        <div className="create-meeting-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Create New Zoom Meeting</h2>
            {error && <div className="error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Form fields remain the same */}
                <div className="form-group">
                    <label htmlFor="topic">Topic</label>
                    <input
                        type="text"
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="start_time">Start Time</label>
                    <input
                        type="datetime-local"
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="duration">Duration (minutes)</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="15"
                        max="240"
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="agenda">Agenda (optional)</label>
                    <textarea
                        id="agenda"
                        name="agenda"
                        value={formData.agenda}
                        onChange={handleChange}
                        rows={4}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        backgroundColor: '#2D8CFF',
                        color: 'white',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Creating Meeting...' : 'Create Meeting'}
                </button>
            </form>
        </div>
    );
};

export default CreateMeetingForm;