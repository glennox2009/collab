import { NextRequest, NextResponse } from 'next/server'
import { DocumentEventEmitter } from '@/lib/documentEventEmitter'

// Enhanced data structure for documents and users with cursor positions
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

// In-memory storage for documents
const documents = new Map<string, DocumentData>()

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const documentId = id

    if (!documents.has(documentId)) {
        // Create new document if it doesn't exist
        documents.set(documentId, {
            content: '',
            users: new Map(),
            lastUpdated: Date.now()
        })
    }

    const document = documents.get(documentId)!

    // Clean up inactive users (older than 30 seconds)
    const now = Date.now()
    for (const [userId, user] of document.users.entries()) {
        if (now - user.lastActive > 30000) {
            document.users.delete(userId)
        }
    }

    return NextResponse.json({
        content: document.content,
        users: Array.from(document.users.values()),
        lastUpdated: document.lastUpdated
    })
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const documentId = id
    const { content, userName, cursorPosition, cursorOnly } = await request.json()

    if (!documents.has(documentId)) {
        documents.set(documentId, {
            content: '',
            users: new Map(),
            lastUpdated: Date.now()
        })
    }

    const document = documents.get(documentId)!

    // Update content only if it's not a cursor-only update
    if (!cursorOnly && content !== undefined) {
        document.content = content
        document.lastUpdated = Date.now()
    }

    // Always update user info with cursor position and activity
    if (userName) {
        document.users.set(userName, {
            name: userName,
            cursorPosition: cursorPosition || 0,
            lastActive: Date.now()
        })
    }

    // Emit appropriate event based on update type
    const emitter = DocumentEventEmitter.getInstance()

    if (cursorOnly) {
        // For cursor-only updates, send user update event
        emitter.emit(documentId, {
            type: 'userUpdate',
            users: Array.from(document.users.values()),
            updatedBy: userName
        })
    } else {
        // For content changes, send full update
        emitter.emit(documentId, {
            type: 'update',
            content: document.content,
            users: Array.from(document.users.values()),
            lastUpdated: document.lastUpdated,
            updatedBy: userName
        })
    }

    return NextResponse.json({
        success: true,
        content: document.content,
        users: Array.from(document.users.values()),
        lastUpdated: document.lastUpdated
    })
}
