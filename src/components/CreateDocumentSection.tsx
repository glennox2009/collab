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
        <>
            {/* Name Input */}
            <InputField
                label="Your Name"
                placeholder="Enter your name"
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
        </>
    )
}
