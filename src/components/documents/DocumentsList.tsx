// src/components/documents/DocumentsList.tsx
import React, { useEffect, useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const DocumentsList: React.FC = () => {
    const { documents, loading, error, fetchDocuments, getDocumentStatus, downloadDocument } = useDocuments();
    const navigate = useNavigate();
    const [refreshing, setRefreshing] = useState(false);
    const [zohoAuthenticated, setZohoAuthenticated] = useState(false);
    const [checkingZoho, setCheckingZoho] = useState(true);
    const [disconnectingZoho, setDisconnectingZoho] = useState(false);


    useEffect(() => {
        fetchDocuments();

        // Check if connected to Zoho
        const checkZohoAuth = async () => {
            try {
                setCheckingZoho(true);
                const response = await axios.get('http://localhost:4000/api/esign/zoho/status', {
                    withCredentials: true
                });
                setZohoAuthenticated(response.data.zohoAuthenticated);
            } catch (err) {
                console.error('Error checking Zoho auth:', err);
                setZohoAuthenticated(false);
            } finally {
                setCheckingZoho(false);
            }
        };

        checkZohoAuth();
    }, []);

    const disconnectZoho = async () => {
        try {
            setDisconnectingZoho(true);

            // First step: Disconnect in your database
            const response = await axios.post('http://localhost:4000/api/esign/zoho/disconnect', {}, {
                withCredentials: true
            });

            if (response.data.success) {
                // Show confirmation before redirecting
                const confirmReconnect = window.confirm('Successfully disconnected from Zoho. Would you like to connect with a different account?');

                if (confirmReconnect) {
                    // Second step: Redirect to login with prompt=login parameter
                    window.location.href = 'http://localhost:4000/api/esign/auth/zoho/new';
                } else {
                    // Just refresh the page to show disconnected state
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error disconnecting from Zoho:', error);
            alert('Failed to disconnect from Zoho. Please try again.');
        } finally {
            setDisconnectingZoho(false);
        }
    };


    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDocuments();
        setRefreshing(false);
    };

    const connectWithZoho = () => {
        window.location.href = 'http://localhost:4000/api/esign/auth/zoho';
    };

    const handleCheckStatus = async (documentId: string) => {
        try {
            await getDocumentStatus(documentId);
        } catch (err) {
            console.error('Error checking status:', err);
        }
    };

    const handleDownload = (documentId: string) => {
        downloadDocument(documentId);
    };

    const getStatusBadge = (status: string) => {
        const statusColors: { [key: string]: string } = {
            draft: 'bg-gray-200 text-gray-800',
            pending: 'bg-yellow-200 text-yellow-800',
            sent: 'bg-blue-200 text-blue-800',
            viewed: 'bg-purple-200 text-purple-800',
            completed: 'bg-green-200 text-green-800',
            declined: 'bg-red-200 text-red-800',
            expired: 'bg-gray-200 text-gray-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || statusColors.draft}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading && !refreshing) {
        return (
            <div className="flex justify-center my-10">
                <p>Loading documents...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 documents-list">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Documents</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                        onClick={() => navigate('/documents/upload')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Upload New Document
                    </button>
                </div>
            </div>

            {zohoAuthenticated && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-green-800">Connected to Zoho Sign</h3>
                            <p className="text-green-700">You can create and send documents for signing.</p>
                        </div>
                        <button
                            onClick={disconnectZoho}
                            disabled={disconnectingZoho}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                        >
                            {disconnectingZoho ? 'Disconnecting...' : 'Disconnect & Use Different Account'}
                        </button>
                    </div>
                </div>
            )}

            {!zohoAuthenticated && !checkingZoho && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">Connect with Zoho Sign</h3>
                            <p>You need to connect your Zoho account to use document signing features.</p>
                        </div>
                        <button
                            onClick={connectWithZoho}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Connect with Zoho
                        </button>
                    </div>
                </div>
            )}

            {documents.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You don't have any documents yet.</p>
                    <p className="mt-2">
                        <button
                            onClick={() => navigate('/documents/upload')}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            Upload your first document
                        </button>
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {documents.map((doc) => (
                                <tr key={doc._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(doc.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/documents/${doc._id}`)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </button>

                                            {doc.status === 'draft' && (
                                                <button
                                                    onClick={() => navigate(`/documents/${doc._id}/sign`)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    Send for Signing
                                                </button>
                                            )}

                                            {(doc.status === 'sent' || doc.status === 'viewed') && (
                                                <button
                                                    onClick={() => handleCheckStatus(doc._id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Check Status
                                                </button>
                                            )}

                                            {doc.status === 'completed' && (
                                                <button
                                                    onClick={() => handleDownload(doc._id)}
                                                    className="text-purple-600 hover:text-purple-800"
                                                >
                                                    Download
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DocumentsList;