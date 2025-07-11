"use client"
import { forwardRef, useCallback, useEffect, useState, useRef } from 'react'
import { ClockIcon } from './Icons'

interface UserInfo {
    name: string
    cursorPosition: number
    lastActive: number
}

interface CollaborativeEditorProps {
    content: string
    onChange: (content: string, cursorPosition?: number) => void
    users: UserInfo[]
    currentUser: string
    isSaving?: boolean
}

const CollaborativeEditor = forwardRef<HTMLTextAreaElement, CollaborativeEditorProps>(
    ({ content, onChange, users, currentUser, isSaving = false }, ref) => {
        const [localContent, setLocalContent] = useState(content)
        const lastContentRef = useRef(content)
        const isComposingRef = useRef(false)

        // Update local content when external content changes
        useEffect(() => {
            // Only update if content actually changed and we're not composing (IME input)
            if (content !== lastContentRef.current && !isComposingRef.current) {
                const textarea = ref && 'current' in ref ? ref.current : null
                const currentCursor = textarea?.selectionStart || 0

                setLocalContent(content)
                lastContentRef.current = content

                // Restore cursor position after content update
                if (textarea) {
                    setTimeout(() => {
                        textarea.setSelectionRange(currentCursor, currentCursor)
                    }, 0)
                }
            }
        }, [content, ref])

        // Immediate change handler for real-time updates
        const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newContent = e.target.value
            const position = e.target.selectionStart

            setLocalContent(newContent)
            lastContentRef.current = newContent

            // Send changes immediately for real-time collaboration
            onChange(newContent, position)
        }, [onChange])

        const [textareaHeight, setTextareaHeight] = useState('auto')
        const shadowRef = useRef<HTMLTextAreaElement>(null)
        const handleSelectionChange = useCallback(() => {
            if (ref && 'current' in ref && ref.current) {
                const position = ref.current.selectionStart
                // Send cursor position updates (throttled internally by parent)
                onChange(localContent, position)
            }
        }, [ref, localContent, onChange])

        // Handle IME composition (for international keyboards)
        const handleCompositionStart = useCallback(() => {
            isComposingRef.current = true
        }, [])

        const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
            isComposingRef.current = false
            const textarea = e.target as HTMLTextAreaElement
            onChange(textarea.value, textarea.selectionStart)
        }, [onChange])

        const wordCount = localContent.trim().split(/\s+/).filter(word => word.length > 0).length
        const otherUsers = users.filter(user => user.name !== currentUser)
        useEffect(() => {
            if (shadowRef.current) {
                shadowRef.current.value = localContent + '\n'
                setTextareaHeight(shadowRef.current.scrollHeight + 'px')
            }
        }, [localContent])

        return (
            <div className="bg-white rounded-xl shadow-lg border relative" style={{ borderColor: '#e5ebf4' }}>
                <div className="p-6 relative">
                    {/* Other users' cursors */}
                    {otherUsers.map(user => (
                        <UserCursor
                            key={user.name}
                            user={user}
                            content={localContent}
                            textareaRef={ref}
                        />
                    ))}

                    <textarea
                        ref={ref}
                        value={localContent}
                        onChange={handleTextChange}
                        onSelect={handleSelectionChange}
                        onFocus={handleSelectionChange}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        placeholder="Start typing your document here... Your changes will be automatically saved and shared with all collaborators."
                        className="w-full h-96 p-6 border-none resize-none focus:outline-none rounded-lg text-base leading-relaxed relative z-10"
                        style={{
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            backgroundColor: 'transparent',
                            color: '#292f42'
                        }}
                    />
                </div>

                {/* Editor Footer */}
                <div className="px-6 py-3 border-t flex items-center justify-between" style={{
                    borderColor: '#e5ebf4',
                    backgroundColor: '#f4f7fa'
                }}>
                    <div className="flex items-center space-x-4 text-sm" style={{ color: '#8eabcc' }}>
                        <span>Characters: {localContent.length}</span>
                        <span>Words: {wordCount}</span>
                        {otherUsers.length > 0 && (
                            <span className="text-blue-600 font-medium">
                                {otherUsers.length} user{otherUsers.length > 1 ? 's' : ''} editing
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm" style={{ color: '#8eabcc' }}>
                        <ClockIcon />
                        <span>{isSaving ? 'Saving...' : 'Saved'}</span>
                    </div>
                </div>
            </div>
        )
    }
)

// User cursor component to show where other users are editing
const UserCursor = ({ user, content, textareaRef }: {
    user: UserInfo
    content: string
    textareaRef: React.ForwardedRef<HTMLTextAreaElement>
}) => {
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (!textareaRef || !('current' in textareaRef) || !textareaRef.current) return

        const textarea = textareaRef.current
        const textBeforeCursor = content.substring(0, user.cursorPosition)
        const lines = textBeforeCursor.split('\n')

        // More accurate positioning based on textarea styles
        const computedStyle = window.getComputedStyle(textarea)
        const lineHeight = parseInt(computedStyle.lineHeight) || 24
        const fontSize = parseInt(computedStyle.fontSize) || 16
        const charWidth = fontSize * 0.6 // More accurate character width estimation

        const paddingTop = parseInt(computedStyle.paddingTop) || 24
        const paddingLeft = parseInt(computedStyle.paddingLeft) || 24

        const top = (lines.length - 1) * lineHeight + paddingTop
        const left = (lines[lines.length - 1]?.length || 0) * charWidth + paddingLeft

        setPosition({ top, left })
    }, [user.cursorPosition, content, textareaRef])

    const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'
    ]
    const colorIndex = user.name.charCodeAt(0) % colors.length
    const userColor = colors[colorIndex]

    // Show cursor only if user was active in last 5 seconds
    const isRecentlyActive = Date.now() - user.lastActive < 5000

    if (!isRecentlyActive) return null

    return (
        <div
            className="absolute z-20 pointer-events-none transition-all duration-150"
            style={{
                top: position.top,
                left: position.left,
                transform: 'translateX(-1px)'
            }}
        >
            {/* Cursor line */}
            <div
                className="w-0.5 h-6 animate-pulse"
                style={{ backgroundColor: userColor }}
            />
            {/* User name badge */}
            <div
                className="absolute -top-8 left-0 px-2 py-1 text-xs text-white rounded-md whitespace-nowrap shadow-lg"
                style={{ backgroundColor: userColor }}
            >
                {user.name}
            </div>
        </div>
    )
}

CollaborativeEditor.displayName = 'CollaborativeEditor'

export default CollaborativeEditor
