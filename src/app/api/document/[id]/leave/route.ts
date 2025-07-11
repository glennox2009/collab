import { NextRequest, NextResponse } from 'next/server'

// Access the same in-memory storage
const documents = new Map<string, { content: string; users: Set<string>; lastUpdated: number }>()

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
