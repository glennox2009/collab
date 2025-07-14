import React from 'react';

interface ErrorAlertProps {
    error: string;
    onDismiss: () => void;
}

export default function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
    return (
        <div className="max-w-6xl mx-auto mt-4">
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded flex items-center justify-between" role="alert">
                <span>{error}</span>
                <button
                    onClick={onDismiss}
                    className="ml-4 px-2 py-1 text-sm rounded bg-red-200 hover:bg-red-300 focus:outline-none"
                    title="Dismiss error"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}
