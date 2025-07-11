import { ExclamationIcon } from './Icons'

interface InputFieldProps {
    label: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    error?: string
    type?: 'text' | 'email' | 'password'
}

export default function InputField({
    label,
    placeholder,
    value,
    onChange,
    error,
    type = 'text'
}: InputFieldProps) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold" style={{ color: '#292f42' }}>
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 ${error
                        ? 'border-red-300 focus:border-red-500 shadow-lg shadow-red-100'
                        : 'border-gray-200 focus:border-blue-400 hover:border-gray-300 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-blue-100'
                        }`}
                    style={{
                        backgroundColor: error ? '#fef2f2' : '#ffffff',
                    }}
                />
                {error && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <ExclamationIcon className="w-5 h-5 text-red-500" />
                    </div>
                )}
            </div>
            {error && (
                <div className="flex items-center mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <ExclamationIcon className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
            )}
        </div>
    )
}
