import React from 'react';
import UserBadge from '@/components/UserBadge';
import ShareButton from '@/components/ShareButton';

interface DocumentHeaderProps {
    documentId: string;
    userName: string;
    users: string[];
    onShare: () => void;
}

export default function DocumentHeader({ documentId, userName, users, onShare }: DocumentHeaderProps) {
    return (
        <div className="bg-white border-b shadow-sm" style={{ borderColor: '#e5ebf4' }}>
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-xl font-semibold" style={{ color: '#292f42' }}>
                                Document: {documentId}
                            </h1>
                            <p className="text-sm" style={{ color: '#8eabcc' }}>
                                Editing as: {userName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <UserBadge users={users} />
                        <ShareButton onShare={onShare} />
                    </div>
                </div>
            </div>
        </div>
    );
}
