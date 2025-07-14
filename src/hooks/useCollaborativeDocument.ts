import { useState, useRef, useCallback, useEffect } from 'react';

export interface UserInfo {
    name: string;
    cursorPosition: number;
    lastActive: number;
}

export function useCollaborativeDocument(documentId: string, userName: string) {
    const [content, setContent] = useState('');
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const lastUpdateTimeRef = useRef(0);
    const cursorUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchInitialDocument = useCallback(async () => {
        try {
            const response = await fetch(`/api/document/${documentId}`);
            if (response.ok) {
                const data = await response.json();
                setContent(data.content);
                setUsers(data.users || []);
                lastUpdateTimeRef.current = data.lastUpdated;
            }
        } catch {
            // Ignore errors
        }
    }, [documentId]);

    useEffect(() => {
        let isCleaningUp = false;

        (async () => {
            if (isCleaningUp) return;
            try {
                await fetch(`/api/document/${documentId}/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userName })
                });
            } catch { }
            await fetchInitialDocument();
            if (isCleaningUp) return;

            const eventSource = new EventSource(`/api/document/${documentId}/events`);
            eventSourceRef.current = eventSource;

            eventSource.onopen = () => { };
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'update' && data.updatedBy !== userName) {
                        if (data.lastUpdated > lastUpdateTimeRef.current) {
                            setContent(data.content);
                            setUsers(data.users || []);
                            lastUpdateTimeRef.current = data.lastUpdated;
                        }
                    } else if (data.type === 'userUpdate') {
                        setUsers(data.users || []);
                    }
                } catch { }
            };
            eventSource.onerror = () => { };
        })();

        return () => {
            isCleaningUp = true;
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            fetch(`/api/document/${documentId}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName })
            }).catch(() => { });
        };
    }, [documentId, userName, fetchInitialDocument]);

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
            });

            if (response.ok) {
                const data = await response.json();
                lastUpdateTimeRef.current = data.lastUpdated;
                setSaveError(null);
            } else {
                setSaveError('Failed to save changes. Please check your connection.');
            }
        } catch {
            setSaveError('Failed to save changes. You appear to be offline.');
        } finally {
            setIsSaving(false);
        }
    }, [documentId, userName]);

    const handleContentChange = useCallback(async (newContent: string, cursorPosition = 0) => {
        const currentContent = content;
        setContent(newContent);
        const isContentChanged = newContent !== currentContent;

        if (!isContentChanged && cursorPosition !== undefined) {
            if (cursorUpdateTimeoutRef.current) {
                clearTimeout(cursorUpdateTimeoutRef.current);
            }
            cursorUpdateTimeoutRef.current = setTimeout(() => {
                updateDocument(newContent, cursorPosition, true);
            }, 150);
            return;
        }

        setIsSaving(true);
        updateDocument(newContent, cursorPosition, false);
    }, [content, updateDocument]);

    const copyDocumentLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('Document link copied to clipboard!');
    };

    return {
        content,
        setContent,
        users,
        setUsers,
        isSaving,
        saveError,
        setSaveError,
        textareaRef,
        handleContentChange,
        copyDocumentLink,
    };
}
