interface UserBadgeProps {
    users: string[]
}

export default function UserBadge({ users }: UserBadgeProps) {
    return (
        <div className="flex items-center space-x-3">
            <span className="text-sm font-medium" style={{ color: '#495884' }}>
                Active users:
            </span>
            <div className="flex space-x-2">
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium text-white rounded-full"
                            style={{ backgroundColor: '#607ab0' }}
                        >
                            {user}
                        </span>
                    ))
                ) : (
                    <span className="text-sm" style={{ color: '#b3c7dd' }}>
                        No other users
                    </span>
                )}
            </div>
        </div>
    )
}
