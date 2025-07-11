import { forwardRef } from 'react'
import { ClockIcon } from './Icons'

interface CollaborativeEditorProps {
    content: string
    onChange: (content: string) => void
}

const CollaborativeEditor = forwardRef<HTMLTextAreaElement, CollaborativeEditorProps>(
    ({ content, onChange }, ref) => {
        const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length

        return (
            <div className="bg-white rounded-xl shadow-lg border" style={{ borderColor: '#e5ebf4' }}>
                <div className="p-6">
                    <textarea
                        ref={ref}
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Start typing your document here... Your changes will be automatically saved and shared with all collaborators."
                        className="w-full h-96 p-6 border-none resize-none focus:outline-none rounded-lg text-base leading-relaxed"
                        style={{
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            backgroundColor: '#ffffff',
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
                        <span>Characters: {content.length}</span>
                        <span>Words: {wordCount}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm" style={{ color: '#8eabcc' }}>
                        <ClockIcon />
                        <span>Auto-saving...</span>
                    </div>
                </div>
            </div>
        )
    }
)

CollaborativeEditor.displayName = 'CollaborativeEditor'

export default CollaborativeEditor
