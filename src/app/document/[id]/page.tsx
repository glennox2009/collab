'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import ConnectionStatus from '@/components/ConnectionStatus'
import UserBadge from '@/components/UserBadge'
import ShareButton from '@/components/ShareButton'
import CollaborativeEditor from '@/components/CollaborativeEditor'
import FloatingStatusCard from '@/components/FloatingStatusCard'

export default function DocumentPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const documentId = params.id as string
    const userName = searchParams.get('name') || 'Anonymous'

    const [content, setContent] = useState('')
    const [users, setUsers] = useState<string[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const lastContentRef = useRef('')

    // Poll for document updates
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`/api/document/${documentId}`)
                if (response.ok) {
                    const data = await response.json()
                    if (data.content !== lastContentRef.current) {
                        setContent(data.content)
                        lastContentRef.current = data.content
                    }
                    setUsers(data.users || [])
                    setIsConnected(true)
                }
            } catch (error) {
                console.error('Failed to fetch document:', error)
                setIsConnected(false)
            }
        }

        // Join the document
        const joinDocument = async () => {
            try {
                await fetch(`/api/document/${documentId}/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userName })
                })
            } catch (error) {
                console.error('Failed to join document:', error)
            }
        }

        joinDocument()
        fetchDocument()

        // Poll every 2 seconds
        const interval = setInterval(fetchDocument, 2000)

        return () => {
            clearInterval(interval)
            // Leave the document
            fetch(`/api/document/${documentId}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName })
            }).catch(console.error)
        }
    }, [documentId, userName])

    const handleContentChange = async (newContent: string) => {
        setContent(newContent)
        lastContentRef.current = newContent

        try {
            await fetch(`/api/document/${documentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent, userName })
            })
        } catch (error) {
            console.error('Failed to update document:', error)
        }
    }

    const copyDocumentLink = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        alert('Document link copied to clipboard!')
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f4f7fa' }}>
            {/* Header */}
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

                            <ConnectionStatus isConnected={isConnected} />
                        </div>

                        <div className="flex items-center space-x-4">
                            <UserBadge users={users} />
                            <ShareButton onShare={copyDocumentLink} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="max-w-6xl mx-auto p-6">
                <CollaborativeEditor
                    ref={textareaRef}
                    content={content}
                    onChange={handleContentChange}
                />
            </div>

            {/* Floating Status Card */}
            <FloatingStatusCard users={users} />
        </div>
    )
}
