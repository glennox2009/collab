"use client"
import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import CollaborativeEditor from '@/components/CollaborativeEditor'
import FloatingStatusCard from '@/components/FloatingStatusCard'
import DocumentHeader from '@/components/DocumentHeader'
import ErrorAlert from '@/components/ErrorAlert'
import { useCollaborativeDocument } from '@/hooks/useCollaborativeDocument'

export default function DocumentPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const documentId = params.id as string
    const userName = searchParams.get('name') || 'Anonymous'

    const {
        content,
        users,
        isSaving,
        saveError,
        setSaveError,
        textareaRef,
        handleContentChange,
        copyDocumentLink,
    } = useCollaborativeDocument(documentId, userName)

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f4f7fa' }}>
            <DocumentHeader
                documentId={documentId}
                userName={userName}
                users={users.map(u => u.name)}
                onShare={copyDocumentLink}
            />

            {saveError && (
                <ErrorAlert error={saveError} onDismiss={() => setSaveError(null)} />
            )}

            <div className="max-w-6xl mx-auto p-6">
                <CollaborativeEditor
                    ref={textareaRef}
                    content={content}
                    onChange={handleContentChange}
                    users={users}
                    currentUser={userName}
                    isSaving={isSaving}
                />
            </div>

            <FloatingStatusCard users={users.map(u => u.name)} />
        </div>
    )
}

