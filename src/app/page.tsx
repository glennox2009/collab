'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardHeader, CardBody } from '@/components/Card'
import CreateDocumentSection from '@/components/CreateDocumentSection'
import JoinDocumentSection from '@/components/JoinDocumentSection'

interface FormErrors {
  name: string
  documentId: string
}

export default function HomePage() {
  const [documentId, setDocumentId] = useState('')
  const [userName, setUserName] = useState('')
  const [errors, setErrors] = useState<FormErrors>({ name: '', documentId: '' })
  const router = useRouter()

  const clearErrors = () => {
    setErrors({ name: '', documentId: '' })
  }

  const createDocument = () => {
    clearErrors()

    if (!userName.trim()) {
      setErrors({ name: 'Please enter your name', documentId: '' })
      return
    }

    const id = Math.random().toString(36).substring(7)
    router.push(`/document/${id}?name=${encodeURIComponent(userName)}`)
  }

  const joinDocument = () => {
    clearErrors()

    const newErrors: FormErrors = { name: '', documentId: '' }

    if (!userName.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!documentId.trim()) {
      newErrors.documentId = 'Please enter a document ID'
    }

    if (newErrors.name || newErrors.documentId) {
      setErrors(newErrors)
      return
    }

    router.push(`/document/${documentId}?name=${encodeURIComponent(userName)}`)
  }

  const handleUserNameChange = (value: string) => {
    setUserName(value)
    if (errors.name) clearErrors()
  }

  const handleDocumentIdChange = (value: string) => {
    setDocumentId(value)
    if (errors.documentId) clearErrors()
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f4f7fa' }}>
      <div className="w-full max-w-md mx-4">
        {/* Main Card */}
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-white mb-2">Collaborative Editor</h1>
            <p className="text-gray-300 text-sm">Create or join a document to start collaborating</p>
          </CardHeader>

          <CardBody>
            <CreateDocumentSection
              userName={userName}
              onUserNameChange={handleUserNameChange}
              onCreateDocument={createDocument}
              nameError={errors.name}
            />

            <JoinDocumentSection
              documentId={documentId}
              onDocumentIdChange={handleDocumentIdChange}
              onJoinDocument={joinDocument}
              documentIdError={errors.documentId}
            />
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: '#8eabcc' }}>
            Documents are shared in real-time with all participants
          </p>
        </div>
      </div>
    </div>
  )
}