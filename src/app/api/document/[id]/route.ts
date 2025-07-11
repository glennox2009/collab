import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for documents and users
const documents = new Map<string, { content: string; users: Set<string>; lastUpdated: number }>()

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const documentId = params.id

    if (!documents.has(documentId)) {
        // Create new document if it doesn't exist
        documents.set(documentId, {
            content: '',
            users: new Set(),
            lastUpdated: Date.now()
        })
    }

    const document = documents.get(documentId)!

    return NextResponse.json({
        content: document.content,
        users: Array.from(document.users),
        lastUpdated: document.lastUpdated
    })
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const documentId = params.id
    const { content, userName } = await request.json()

    if (!documents.has(documentId)) {
        documents.set(documentId, {
            content: '',
            users: new Set(),
            lastUpdated: Date.now()
        })
    }

    const document = documents.get(documentId)!
    document.content = content
    document.lastUpdated = Date.now()

    // Add user if not already in the set
    if (userName) {
        document.users.add(userName)
    }

    return NextResponse.json({
        success: true,
        content: document.content,
        users: Array.from(document.users),
        lastUpdated: document.lastUpdated
    })
}
