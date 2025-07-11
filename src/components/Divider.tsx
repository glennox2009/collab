export default function Divider({ text }: { text: string }) {
    return (
        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-6 py-2 bg-white rounded-full text-gray-500 font-medium shadow-sm border border-gray-200 backdrop-blur-sm">
                    {text}
                </span>
            </div>
        </div>
    )
}
