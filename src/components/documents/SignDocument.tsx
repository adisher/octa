// src/components/documents/SignDocument.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignDocument: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();

    const [signingUrl, setSigningUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getSigningUrl = async () => {
            if (!id || !email) {
                setError('Missing document ID or email');
                setLoading(false);
                return;
            }

            try {
                // This calls your backend endpoint to get the signing URL
                const response = await axios.get(
                    `http://localhost:4000/api/esign/documents/${id}/sign/${email}`,
                    { withCredentials: true }
                );

                setSigningUrl(response.data.signingUrl);
                setLoading(false);
            } catch (err: any) {
                console.error('Error getting signing URL:', err);
                setError(err.response?.data?.error || 'Failed to get signing URL');
                setLoading(false);
            }
        };

        getSigningUrl();
    }, [id, email]);

    if (loading) {
        return <div className="text-center my-10">Loading signing interface...</div>;
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto my-8 p-6 bg-red-100 text-red-700 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate(`/documents/${id}`)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Document
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-100">
            <iframe
                src={signingUrl}
                title="Document Signing"
                className="w-full h-full border-0"
                allow="camera; microphone"
            ></iframe>
        </div>
    );
};

export default SignDocument;