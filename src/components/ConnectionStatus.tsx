interface ConnectionStatusProps {
    isConnected: boolean
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
    return (
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full" style={{ backgroundColor: '#f4f7fa' }}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-medium" style={{ color: '#495884' }}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </span>
        </div>
    )
}
