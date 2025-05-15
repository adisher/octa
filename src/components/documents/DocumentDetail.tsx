// src/components/documents/DocumentDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDocuments } from '../../context/DocumentContext';

interface DocumentDetail {
    _id: string;
    title: string;
    description: string;
    status: string;
    signers: {
        name: string;
        email: string;
        status: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

const DocumentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getDocumentStatus, downloadDocument } = useDocuments();
    const [document, setDocument] = useState<DocumentDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [needsReset, setNeedsReset] = useState<boolean>(false);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/esign/documents/${id}`, {
                    withCredentials: true
                });
                setDocument(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch document details');
                console.error('Error fetching document:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDocument();
        }
    }, [id]);

    const refreshStatus = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            setNeedsReset(false);

            const response = await axios.get(`http://localhost:4000/api/esign/documents/${id}/status`, {
                withCredentials: true
            });

            setDocument(prev => prev ?
                { ...prev, status: response.data.status, signers: response.data.signers }
                : null
            );
        } catch (err: any) {
            console.error('Error refreshing status:', err);
            setError(err.response?.data?.error || 'Failed to refresh status');

            // Check if the document needs to be reset
            if (err.response?.data?.error === 'Document has not been sent for signing yet' &&
                document?.status === 'sent') {
                setNeedsReset(true);
            }
        } finally {
            setLoading(false);
        }
    };
    const resetDocument = async () => {
        if (!id) return;

        try {
            setLoading(true);

            const response = await axios.post(`http://localhost:4000/api/esign/documents/${id}/reset`, {}, {
                withCredentials: true
            });

            // Update the document in state
            setDocument(prev => prev ? { ...prev, status: 'draft' } : null);
            setNeedsReset(false);
            setError(null);

            // Show success message
            alert('Document reset successfully. You can now send it for signing again.');
        } catch (err: any) {
            console.error('Error resetting document:', err);
            setError(err.response?.data?.error || 'Failed to reset document');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!id) return;
        downloadDocument(id);
    };

    if (loading) {
        return <div className="text-center my-10">Loading document details...</div>;
    }

    // Add this in your JSX
    {
        error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
                <p>{error}</p>
                {needsReset && (
                    <div className="mt-2">
                        <p>This document appears to be in an inconsistent state.</p>
                        <button
                            onClick={resetDocument}
                            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Reset Document Status
                        </button>
                    </div>
                )}
            </div>
        )
    }

    if (!document) {
        return <div className="text-center my-10">Document not found</div>;
    }

    return (
        <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{document.title}</h2>

            <div className="mb-6">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${document.status === 'completed' ? 'bg-green-200 text-green-800' :
                        document.status === 'sent' ? 'bg-blue-200 text-blue-800' :
                            document.status === 'viewed' ? 'bg-purple-200 text-purple-800' :
                                document.status === 'declined' ? 'bg-red-200 text-red-800' :
                                    'bg-gray-200 text-gray-800'
                    }`}>
                    {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </span>
            </div>

            {document.description && (
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-700">{document.description}</p>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Document Information</h3>
                <p className="text-gray-700">Created: {new Date(document.createdAt).toLocaleString()}</p>
                <p className="text-gray-700">Last Updated: {new Date(document.updatedAt).toLocaleString()}</p>
            </div>

            {document.signers && document.signers.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Signers</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {document.signers.map((signer, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="px-4 py-2">{signer.name}</td>
                                        <td className="px-4 py-2">{signer.email}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${signer.status === 'completed' ? 'bg-green-200 text-green-800' :
                                                    signer.status === 'viewed' ? 'bg-purple-200 text-purple-800' :
                                                        signer.status === 'declined' ? 'bg-red-200 text-red-800' :
                                                            'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                {signer.status.charAt(0).toUpperCase() + signer.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex gap-2 mt-8">
                <button
                    onClick={() => navigate('/documents')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                    Back to Documents
                </button>

                {document.status === 'draft' && (
                    <button
                        onClick={() => navigate(`/documents/${document._id}/sign`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Send for Signing
                    </button>
                )}
                {document.status === 'sent' && document.signers && document.signers.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">Sign This Document</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="mb-4">You can sign this document directly in the platform:</p>
                            {document.signers.map((signer, index) => (
                                <div key={index} className="mb-2">
                                    <button
                                        onClick={() => navigate(`/documents/${document._id}/sign-document?email=${signer.email}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                    >
                                        Sign as {signer.name} ({signer.email})
                                    </button>
                                    <span className="ml-2 text-sm">
                                        Status: {signer.status.charAt(0).toUpperCase() + signer.status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(document.status === 'sent' || document.status === 'viewed') && (
                    <button
                        onClick={refreshStatus}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Refresh Status
                    </button>
                )}

                {document.status === 'completed' && (
                    <button
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Download Signed Document
                    </button>
                )}
            </div>
        </div>
    );
};

export default DocumentDetail;