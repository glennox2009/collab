import { NextRequest } from 'next/server'
import { DocumentEventEmitter } from '@/lib/documentEventEmitter'

// Define a type for event data
interface SSEEvent {
    type: string
    [key: string]: unknown
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const documentId = id

    console.log(`Setting up SSE connection for document: ${documentId}`)

    // Create Server-Sent Events stream
    const stream = new ReadableStream({
        start(controller) {
            const emitter = DocumentEventEmitter.getInstance()
            // Send initial connection message
            const sendEvent = (data: SSEEvent) => {
                try {
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
                } catch (err) {
                    console.error('Error sending SSE event:', err)
                }
            }
            sendEvent({ type: 'connected', documentId })
            // Set up listener for document updates
            const listener = (data: SSEEvent) => {
                sendEvent(data)
            }
            emitter.subscribe(documentId, listener)
            // Send keepalive every 30 seconds to prevent connection timeout
            const keepAliveInterval = setInterval(() => {
                sendEvent({ type: 'keepalive', timestamp: Date.now() })
            }, 30000)
            // Clean up on close
            const cleanup = () => {
                console.log(`Cleaning up SSE connection for document: ${documentId}`)
                clearInterval(keepAliveInterval)
                emitter.unsubscribe(documentId, listener)
                try {
                    controller.close()
                } catch {
                    // Controller might already be closed
                }
            }
            // Listen for client disconnect
            if (request.signal) {
                request.signal.addEventListener('abort', cleanup)
            }
            // Handle stream cancellation
            return cleanup
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control',
            'X-Accel-Buffering': 'no', // Disable nginx buffering
        },
    })
}
