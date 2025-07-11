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

    if (!documents.has(documentId)) {
        documents.set(documentId, {
            content: '',
            users: new Map(),
            lastUpdated: Date.now()
        })
    }

    const document = documents.get(documentId)!
    document.users.set(userName, {
        name: userName,
        cursorPosition: 0,
        lastActive: Date.now()
    })

    return NextResponse.json({
        success: true,
        users: Array.from(document.users.values())
    })
}
