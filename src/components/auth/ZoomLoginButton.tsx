// src/components/auth/ZoomLoginButton.tsx
import React from 'react';

interface ZoomLoginButtonProps {
    className?: string;
}

const ZoomLoginButton: React.FC<ZoomLoginButtonProps> = ({ className }) => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:4000/api/auth/zoom';
    };

    return (
        <button
            onClick={handleLogin}
            className={`zoom-login-btn ${className || ''}`}
            style={{
                backgroundColor: '#2D8CFF',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold'
            }}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM16.5 16.5H7.5V7.5H16.5V16.5Z" fill="white" />
                <path d="M14.25 10.5H9.75V13.5H14.25V10.5Z" fill="#2D8CFF" />
            </svg>
            Login with Zoom
        </button>
    );
};

export default ZoomLoginButton;