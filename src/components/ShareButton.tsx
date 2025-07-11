import { ShareIcon } from './Icons'

interface ShareButtonProps {
    onShare: () => void
}

export default function ShareButton({ onShare }: ShareButtonProps) {
    return (
        <button
            onClick={onShare}
            className="flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4"
            style={{
                backgroundColor: '#7390be',
                boxShadow: '0 2px 4px rgba(115, 144, 190, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#607ab0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7390be'}
        >
            <ShareIcon />
            <span className="ml-2">Share Link</span>
        </button>
    )
}
