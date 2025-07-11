interface FloatingStatusCardProps {
    users: string[]
}

export default function FloatingStatusCard({ users }: FloatingStatusCardProps) {
    return (
        <div className="fixed bottom-6 right-6">
            <div className="bg-white px-4 py-3 rounded-lg shadow-lg border" style={{ borderColor: '#e5ebf4' }}>
                <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                        {users.slice(0, 3).map((user, index) => (
                            <div
                                key={index}
                                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                                style={{ backgroundColor: '#607ab0' }}
                            >
                                {user.charAt(0).toUpperCase()}
                            </div>
                        ))}
                        {users.length > 3 && (
                            <div
                                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium"
                                style={{ backgroundColor: '#8eabcc', color: 'white' }}
                            >
                                +{users.length - 3}
                            </div>
                        )}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium" style={{ color: '#495884' }}>
                            {users.length} {users.length === 1 ? 'person' : 'people'} editing
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
