import { NextRequest, NextResponse } from 'next/server'

// Enhanced data structure to match the main API
interface UserInfo {
    name: string
    cursorPosition: number
    lastActive: number
}

interface DocumentData {
    content: string
    users: Map<string, UserInfo>
    lastUpdated: number
}

// Access the same in-memory storage
const documents = new Map<string, DocumentData>()

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const documentId = id
    const { userName } = await request.json()

    if (documents.has(documentId)) {
        const document = documents.get(documentId)!
        document.users.delete(userName)
    }

    return NextResponse.json({
        success: true
    })
}
