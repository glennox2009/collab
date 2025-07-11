// Simple in-memory event emitter for real-time updates
export interface SSEEvent {
    type: string
    [key: string]: unknown
}

export class DocumentEventEmitter {
    private static instance: DocumentEventEmitter
    private listeners: Map<string, Set<(data: SSEEvent) => void>> = new Map()
    private connectionCount: Map<string, number> = new Map()

    static getInstance() {
        if (!DocumentEventEmitter.instance) {
            DocumentEventEmitter.instance = new DocumentEventEmitter()
        }
        return DocumentEventEmitter.instance
    }

    subscribe(documentId: string, listener: (data: SSEEvent) => void) {
        if (!this.listeners.has(documentId)) {
            this.listeners.set(documentId, new Set())
        }
        this.listeners.get(documentId)!.add(listener)

        // Track connection count
        this.connectionCount.set(documentId, (this.connectionCount.get(documentId) || 0) + 1)
        console.log(`SSE connection added for document ${documentId}. Total: ${this.connectionCount.get(documentId)}`)
    }

    unsubscribe(documentId: string, listener: (data: SSEEvent) => void) {
        if (this.listeners.has(documentId)) {
            this.listeners.get(documentId)!.delete(listener)

            // Update connection count
            const currentCount = this.connectionCount.get(documentId) || 0
            const newCount = Math.max(0, currentCount - 1)
            this.connectionCount.set(documentId, newCount)
            console.log(`SSE connection removed for document ${documentId}. Total: ${newCount}`)

            // Clean up empty listener sets
            if (this.listeners.get(documentId)!.size === 0) {
                this.listeners.delete(documentId)
                this.connectionCount.delete(documentId)
            }
        }
    }

    emit(documentId: string, data: SSEEvent) {
        if (this.listeners.has(documentId)) {
            const listenerCount = this.listeners.get(documentId)!.size
            if (listenerCount > 0) {
                console.log(`Emitting ${data.type} event to ${listenerCount} listeners for document ${documentId}`)
                this.listeners.get(documentId)!.forEach(listener => {
                    try {
                        listener(data)
                    } catch (error) {
                        console.error('Error in SSE listener:', error)
                    }
                })
            }
        }
    }

    getConnectionCount(documentId: string): number {
        return this.connectionCount.get(documentId) || 0
    }
}
