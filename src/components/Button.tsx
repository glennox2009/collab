import { ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    onClick: () => void
    variant?: 'primary' | 'secondary'
    icon?: ReactNode
    disabled?: boolean
    className?: string
}

export default function Button({
    children,
    onClick,
    variant = 'primary',
    icon,
    disabled = false,
    className = ''
}: ButtonProps) {
    const baseStyles = "w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

    const variantStyles = {
        primary: {
            backgroundColor: '#607ab0',
            hoverColor: '#556aa0',
            ringColor: 'focus:ring-blue-200'
        },
        secondary: {
            backgroundColor: '#7390be',
            hoverColor: '#607ab0',
            ringColor: 'focus:ring-green-200'
        }
    }

    const currentVariant = variantStyles[variant]

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${currentVariant.ringColor} ${className}`}
            style={{ backgroundColor: currentVariant.backgroundColor }}
            onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = currentVariant.hoverColor)}
            onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = currentVariant.backgroundColor)}
        >
            {icon && <span className="inline mr-2">{icon}</span>}
            {children}
        </button>
    )
}
