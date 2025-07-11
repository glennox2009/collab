"use client"
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import ConnectionStatus from '@/components/ConnectionStatus'
import UserBadge from '@/components/UserBadge'
import ShareButton from '@/components/ShareButton'
import CollaborativeEditor from '@/components/CollaborativeEditor'
import FloatingStatusCard from '@/components/FloatingStatusCard'
import PerformanceMonitor from '@/components/PerformanceMonitor'

// Simple draggable wrapper for dev monitor
function DraggableMonitor({ children }: { children: React.ReactNode }) {
    const nodeRef = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState({ x: 20, y: 20 })
    const [dragging, setDragging] = useState(false)
    const offset = useRef<{ x: number; y: number } | null>(null)

    const onMouseDown = (e: React.MouseEvent) => {
        setDragging(true)
        const rect = nodeRef.current?.getBoundingClientRect();
        offset.current = rect
            ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
            : { x: 0, y: 0 }
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }
    const onMouseMove = React.useCallback((e: MouseEvent) => {
        if (!dragging || !offset.current) return
        setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
    }, [dragging])
    const onMouseUp = React.useCallback(() => {
        setDragging(false)
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }, [onMouseMove])
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }
    }, [onMouseMove, onMouseUp])
    return (
        <div
            ref={nodeRef}
            style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999, cursor: dragging ? 'grabbing' : 'grab' }}
            onMouseDown={onMouseDown}
        >
            {children}
        </div>
    )
}

interface UserInfo {
    name: string
    cursorPosition: number
    lastActive: number
}

export default function DocumentPage() {
    const [monitorVisible, setMonitorVisible] = useState(false)
    const params = useParams()
    const searchParams = useSearchParams()
    const documentId = params.id as string
    const userName = searchParams.get('name') || 'Anonymous'

    const [content, setContent] = useState('')
    const [users, setUsers] = useState<UserInfo[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // SSE connection for real-time updates
    const eventSourceRef = useRef<EventSource | null>(null)
    const lastUpdateTimeRef = useRef(0)

    // Throttle cursor position updates to avoid spam
    const cursorUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Initial document fetch
    const fetchInitialDocument = useCallback(async () => {
        try {
            const response = await fetch(`/api/document/${documentId}`)
            if (response.ok) {
                const data = await response.json()
                setContent(data.content)
                setUsers(data.users || [])
                lastUpdateTimeRef.current = data.lastUpdated
                setIsConnected(true)
            }
        } catch {
            setIsConnected(false)
        }
    }, [documentId])

    // Setup real-time connection with Server-Sent Events
    useEffect(() => {
        let isCleaningUp = false
        let reconnectTimeout: NodeJS.Timeout | null = null
        let keepaliveTimeout: NodeJS.Timeout | null = null
        let reconnectAttempts = 0
        const maxReconnectAttempts = 5
        const KEEPALIVE_INTERVAL = 10000

        const resetKeepalive = () => {
            clearTimeout(keepaliveTimeout!);
            keepaliveTimeout = setTimeout(() => setIsConnected(false), KEEPALIVE_INTERVAL);
        };

        (async () => {
            if (isCleaningUp) return;
            try {
                await fetch(`/api/document/${documentId}/join`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userName })
                });
            } catch { }
            await fetchInitialDocument();
            if (isCleaningUp) return;
            const eventSource = new EventSource(`/api/document/${documentId}/events`);
            eventSourceRef.current = eventSource;
            eventSource.onopen = () => { setIsConnected(true); reconnectAttempts = 0; resetKeepalive(); };
            eventSource.onmessage = (event) => {
                resetKeepalive();
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'update' && data.updatedBy !== userName) {
                        if (data.lastUpdated > lastUpdateTimeRef.current) {
                            setContent(data.content); setUsers(data.users || []); lastUpdateTimeRef.current = data.lastUpdated;
                        }
                    } else if (data.type === 'userUpdate') {
                        setUsers(data.users || []);
                    }
                } catch { }
            };
            eventSource.onerror = () => {
                setIsConnected(false);
                clearTimeout(keepaliveTimeout!);
                if (!isCleaningUp && reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 10000);
                    reconnectTimeout = setTimeout(() => {
                        if (!isCleaningUp) { eventSource.close(); (async () => { await fetchInitialDocument(); })(); }
                    }, delay);
                }
            };
        })();

        return () => {
            isCleaningUp = true;
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            if (keepaliveTimeout) clearTimeout(keepaliveTimeout);
            if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; }
            fetch(`/api/document/${documentId}/leave`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userName })
            }).catch(() => { });
        };
    }, [documentId, userName, fetchInitialDocument]);

    // Helper function to update document via API
    const updateDocument = useCallback(async (newContent: string, cursorPosition: number, cursorOnly: boolean) => {
        try {
            const response = await fetch(`/api/document/${documentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newContent,
                    userName,
                    cursorPosition,
                    cursorOnly
                })
            })

            if (response.ok) {
                const data = await response.json()
                lastUpdateTimeRef.current = data.lastUpdated
                setSaveError(null)
            } else {
                setSaveError('Failed to save changes. Please check your connection.')
            }
        } catch {
            setSaveError('Failed to save changes. You appear to be offline.')
        } finally {
            setIsSaving(false)
        }
    }, [documentId, userName])

    // Handle content and cursor changes
    const handleContentChange = useCallback(async (newContent: string, cursorPosition = 0) => {
        // Get the current content from state to compare
        const currentContent = content

        // Update content immediately for responsive UI
        setContent(newContent)

        // Determine if this is just a cursor update
        const isContentChanged = newContent !== currentContent

        if (!isContentChanged && cursorPosition !== undefined) {
            // Throttle cursor-only updates to reduce API calls
            if (cursorUpdateTimeoutRef.current) {
                clearTimeout(cursorUpdateTimeoutRef.current)
            }

            cursorUpdateTimeoutRef.current = setTimeout(() => {
                updateDocument(newContent, cursorPosition, true)
            }, 150)
            return
        }

        // For content changes, show saving state and send immediately
        setIsSaving(true)

        updateDocument(newContent, cursorPosition, false)
    }, [content, updateDocument])

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
                            <UserBadge users={users.map(u => u.name)} />
                            <ShareButton onShare={copyDocumentLink} />
                            {/* Monitor toggle icon button */}
                            <button
                                onClick={() => setMonitorVisible(v => !v)}
                                title={monitorVisible ? 'Hide Performance Monitor' : 'Show Performance Monitor'}
                                className="ml-1 p-1 rounded hover:bg-gray-200 focus:outline-none"
                                style={{ lineHeight: 0, background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {monitorVisible ? (
                                    // Eye-slash SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.06 10.06 0 0112 20c-5.05 0-9.29-3.36-10-8 .21-1.36.7-2.63 1.43-3.74m2.1-2.53A9.97 9.97 0 0112 4c5.05 0 9.29 3.36 10 8-.18 1.18-.6 2.3-1.22 3.29M9.88 9.88A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .41-.08.8-.22 1.16m-1.82 1.82A3 3 0 019 12c0-.41.08-.8.22-1.16" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                                ) : (
                                    // Eye SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12C2.67 7.6 6.92 4.5 12 4.5c5.08 0 9.33 3.1 10.5 7.5-1.17 4.4-5.42 7.5-10.5 7.5-5.08 0-9.33-3.1-10.5-7.5z" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error alert for save errors */}
            {saveError && (
                <div className="max-w-6xl mx-auto mt-4">
                    <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded flex items-center justify-between" role="alert">
                        <span>{saveError}</span>
                        <button
                            onClick={() => setSaveError(null)}
                            className="ml-4 px-2 py-1 text-sm rounded bg-red-200 hover:bg-red-300 focus:outline-none"
                            title="Dismiss error"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Editor */}

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

            {/* Floating Status Card */}
            <FloatingStatusCard users={users.map(u => u.name)} />

            {/* Performance Monitor (development only, draggable) */}
            {process.env.NODE_ENV === 'development' && monitorVisible && (
                <DraggableMonitor>
                    <PerformanceMonitor
                        isConnected={isConnected}
                        users={users.map(u => u.name)}
                        currentUser={userName}
                        charCount={content.length}
                        wordCount={content.trim().split(/\s+/).filter(Boolean).length}
                        lastSaveTime={lastUpdateTimeRef.current}
                    />
                </DraggableMonitor>
            )}
        </div>
    )
}

