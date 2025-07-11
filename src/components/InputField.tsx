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
        <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#495884' }}>
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${error
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                style={{
                    backgroundColor: error ? '#fef2f2' : '#ffffff',
                    borderColor: error ? '#fca5a5' : '#e5ebf4'
                }}
            />
            {error && (
                <p className="text-red-500 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
}
