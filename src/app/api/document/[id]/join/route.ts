import { NextRequest, NextResponse } from 'next/server'

// Access the same in-memory storage
const documents = new Map<string, { content: string; users: Set<string>; lastUpdated: number }>()

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const documentId = params.id
    const { userName } = await request.json()

    if (!documents.has(documentId)) {
        documents.set(documentId, {
            content: '',
            users: new Set(),
            lastUpdated: Date.now()
        })
    }

    const document = documents.get(documentId)!
    document.users.add(userName)

    return NextResponse.json({
        success: true,
        users: Array.from(document.users)
    })
}
