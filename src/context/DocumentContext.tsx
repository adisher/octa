// src/context/DocumentContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Document {
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

interface DocumentContextType {
    documents: Document[];
    loading: boolean;
    error: string | null;
    fetchDocuments: () => Promise<void>;
    uploadDocument: (formData: FormData) => Promise<Document>;
    createSigningRequest: (documentId: string, signers: { name: string; email: string }[]) => Promise<any>;
    getSigningUrl: (documentId: string, email: string) => Promise<string>;
    getDocumentStatus: (documentId: string) => Promise<any>;
    downloadDocument: (documentId: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    const fetchDocuments = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:4000/api/esign/documents', {
                withCredentials: true
            });
            setDocuments(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch documents');
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchDocuments();
        }
    }, [isAuthenticated]);

    const uploadDocument = async (formData: FormData): Promise<Document> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('http://localhost:4000/api/esign/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            await fetchDocuments(); // Refresh the documents list
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upload document');
            console.error('Error uploading document:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createSigningRequest = async (documentId: string, signers: { name: string; email: string }[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`http://localhost:4000/api/esign/documents/${documentId}/sign`, {
                signers
            }, {
                withCredentials: true
            });

            await fetchDocuments(); // Refresh the documents list
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create signing request');
            console.error('Error creating signing request:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getSigningUrl = async (documentId: string, email: string): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:4000/api/esign/documents/${documentId}/sign/${email}`, {
                withCredentials: true
            });
            return response.data.signingUrl;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to get signing URL');
            console.error('Error getting signing URL:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDocumentStatus = async (documentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:4000/api/esign/documents/${documentId}/status`, {
                withCredentials: true
            });

            // Update the document in the local state
            setDocuments(prev =>
                prev.map(doc =>
                    doc._id === documentId
                        ? { ...doc, status: response.data.status, signers: response.data.signers }
                        : doc
                )
            );

            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to get document status');
            console.error('Error getting document status:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const downloadDocument = (documentId: string) => {
        window.open(`http://localhost:4000/api/esign/documents/${documentId}/download`);
    };

    return (
        <DocumentContext.Provider
            value={{
                documents,
                loading,
                error,
                fetchDocuments,
                uploadDocument,
                createSigningRequest,
                getSigningUrl,
                getDocumentStatus,
                downloadDocument
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocuments = (): DocumentContextType => {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error('useDocuments must be used within a DocumentProvider');
    }
    return context;
};