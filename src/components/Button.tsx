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
    const baseStyles = "w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl active:scale-[0.98] relative overflow-hidden"

    const variantStyles = {
        primary: {
            backgroundColor: '#607ab0',
            hoverColor: '#556aa0',
            ringColor: 'focus:ring-blue-200',
            gradient: 'linear-gradient(135deg, #607ab0 0%, #7390be 100%)'
        },
        secondary: {
            backgroundColor: '#7390be',
            hoverColor: '#607ab0',
            ringColor: 'focus:ring-green-200',
            gradient: 'linear-gradient(135deg, #7390be 0%, #8da5d1 100%)'
        }
    }

    const currentVariant = variantStyles[variant]

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${currentVariant.ringColor} ${className}`}
            style={{
                background: currentVariant.gradient,
                boxShadow: '0 4px 20px rgba(96, 122, 176, 0.3)'
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = currentVariant.hoverColor
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(96, 122, 176, 0.4)'
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = currentVariant.gradient
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(96, 122, 176, 0.3)'
                }
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center">
                {icon && <span className="mr-3 text-lg">{icon}</span>}
                <span className="text-base">{children}</span>
            </div>
        </button>
    )
}
