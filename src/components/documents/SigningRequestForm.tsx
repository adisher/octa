// src/components/documents/SigningRequestForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDocuments } from '../../context/DocumentContext';

interface Signer {
    name: string;
    email: string;
}

const SigningRequestForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { createSigningRequest } = useDocuments();
    const [document, setDocument] = useState<any>(null);
    const [signers, setSigners] = useState<Signer[]>([{ name: '', email: '' }]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocumentAndCheckZoho = async () => {
            try {
                setLoading(true);

                // Check if connected to Zoho
                const zohoResponse = await axios.get('http://localhost:4000/api/esign/zoho/status', {
                    withCredentials: true
                });

                if (!zohoResponse.data.zohoAuthenticated) {
                    setError('You need to connect with Zoho Sign before sending documents for signing');
                    setLoading(false);
                    return;
                }

                // Fetch document details
                const response = await axios.get(`http://localhost:4000/api/esign/documents/${id}`, {
                    withCredentials: true
                });

                setDocument(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch document or check Zoho status');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDocumentAndCheckZoho();
        }
    }, [id]);

    const handleAddSigner = () => {
        setSigners([...signers, { name: '', email: '' }]);
    };

    const handleRemoveSigner = (index: number) => {
        const newSigners = [...signers];
        newSigners.splice(index, 1);
        setSigners(newSigners);
    };

    const handleSignerChange = (index: number, field: keyof Signer, value: string) => {
        const newSigners = [...signers];
        newSigners[index][field] = value;
        setSigners(newSigners);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        // Validate signers
        const invalidSigners = signers.some(signer => !signer.name || !signer.email);
        if (invalidSigners) {
            setError('All signer fields are required');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await createSigningRequest(id, signers);
            navigate(`/documents/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create signing request');
            console.error('Error creating signing request:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center my-10">Loading document...</div>;
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto my-8 p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p>{error}</p>
                <button
                    onClick={() => navigate(`/documents/${id}`)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Back to Document
                </button>
            </div>
        );
    }

    if (!document) {
        return <div className="text-center my-10">Document not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Send "{document.title}" for Signing</h2>
            <p className="text-gray-600 mb-6">Add people who need to sign this document</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Signers</h3>

                    {signers.map((signer, index) => (
                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">Signer {index + 1}</h4>
                                {signers.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSigner(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`name-${index}`}>
                                    Name
                                </label>
                                <input
                                    id={`name-${index}`}
                                    type="text"
                                    value={signer.name}
                                    onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`email-${index}`}>
                                    Email
                                </label>
                                <input
                                    id={`email-${index}`}
                                    type="email"
                                    value={signer.email}
                                    onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddSigner}
                        className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Another Signer
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(`/documents/${id}`)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {submitting ? 'Sending...' : 'Send for Signing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SigningRequestForm;