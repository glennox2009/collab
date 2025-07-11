import InputField from './InputField'
import Button from './Button'
import { LoginIcon } from './Icons'

interface JoinDocumentSectionProps {
    documentId: string
    onDocumentIdChange: (value: string) => void
    onJoinDocument: () => void
    documentIdError?: string
}

export default function JoinDocumentSection({
    documentId,
    onDocumentIdChange,
    onJoinDocument,
    documentIdError
}: JoinDocumentSectionProps) {
    return (
        <div className="space-y-6">
            <InputField
                label="Document ID"
                placeholder="Enter the document ID to join"
                value={documentId}
                onChange={onDocumentIdChange}
                error={documentIdError}
            />

            <Button
                onClick={onJoinDocument}
                variant="secondary"
                icon={<LoginIcon />}
            >
                Join Document
            </Button>
        </div>
    )
}
