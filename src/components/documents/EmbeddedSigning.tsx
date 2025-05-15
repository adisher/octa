// src/components/documents/EmbeddedSigning.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDocuments } from '../../context/DocumentContext';

const EmbeddedSigning: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const { getSigningUrl } = useDocuments();

    const [signingUrl, setSigningUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSigningUrl = async () => {
            if (!id || !email) {
                setError('Missing document ID or email');
                setLoading(false);
                return;
            }

            try {
                const url = await getSigningUrl(id, email);
                setSigningUrl(url);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to get signing URL');
                console.error('Error getting signing URL:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSigningUrl();
    }, [id, email, getSigningUrl]);

    if (loading) {
        return (
            <div className="text-center my-10">
                <p>Preparing signing interface...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto my-8 p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen">
            <div className="h-full">
                <iframe
                    src={signingUrl}
                    title="Document Signing"
                    className="w-full h-full border-0"
                    allow="camera; microphone"
                ></iframe>
            </div>
        </div>
    );
};

export default EmbeddedSigning;