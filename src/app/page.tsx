'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardHeader, CardBody } from '@/components/Card'
import CreateDocumentSection from '@/components/CreateDocumentSection'
import JoinDocumentSection from '@/components/JoinDocumentSection'
import { InfoIcon, DocumentIcon } from '@/components/Icons'

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
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#f4f7fa' }}>
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <DocumentIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Collaborative Editor</h1>
              <p className="text-blue-100 text-base leading-relaxed">Create or join a document to start collaborating in real-time</p>
            </div>
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
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
            <InfoIcon className="w-4 h-4 mr-2 text-blue-600" />
            <p className="text-sm font-medium" style={{ color: '#495884' }}>
              Documents sync in real-time with all participants
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}