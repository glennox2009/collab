import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
            {children}
        </div>
    )
}

export function CardHeader({ children }: { children: ReactNode }) {
    return (
        <div className="px-8 pt-8 pb-6 text-center" style={{ backgroundColor: '#292f42' }}>
            {children}
        </div>
    )
}

export function CardBody({ children }: { children: ReactNode }) {
    return (
        <div className="px-8 py-6 space-y-6">
            {children}
        </div>
    )
}
