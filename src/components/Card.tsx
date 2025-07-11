import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden backdrop-blur-sm ${className}`}>
            {children}
        </div>
    )
}

export function CardHeader({ children }: { children: ReactNode }) {
    return (
        <div className="px-8 pt-10 pb-8 text-center relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #292f42 0%, #495884 100%)'
        }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

export function CardBody({ children }: { children: ReactNode }) {
    return (
        <div className="px-8 py-8 space-y-8 bg-gradient-to-b from-gray-50/50 to-white">
            {children}
        </div>
    )
}
