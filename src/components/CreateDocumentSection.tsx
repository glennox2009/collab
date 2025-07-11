import InputField from './InputField'
import Button from './Button'
import Divider from './Divider'
import { PlusIcon } from './Icons'

interface CreateDocumentSectionProps {
    userName: string
    onUserNameChange: (value: string) => void
    onCreateDocument: () => void
    nameError?: string
}

export default function CreateDocumentSection({
    userName,
    onUserNameChange,
    onCreateDocument,
    nameError
}: CreateDocumentSectionProps) {
    return (
        <div className="space-y-6">
            {/* Name Input */}
            <InputField
                label="Your Name"
                placeholder="Enter your name to get started"
                value={userName}
                onChange={onUserNameChange}
                error={nameError}
            />

            {/* Create Document Button */}
            <Button
                onClick={onCreateDocument}
                icon={<PlusIcon />}
            >
                Create New Document
            </Button>

            {/* Divider */}
            <Divider text="or join existing" />
        </div>
    )
}
