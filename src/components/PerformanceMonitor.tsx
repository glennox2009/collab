"use client"
import { useEffect, useState } from 'react'

interface PerformanceMonitorProps {
    isConnected: boolean
    users: string[]
    className?: string
    lastSaveTime?: number
    currentUser?: string
    charCount?: number
    wordCount?: number
}


export default function PerformanceMonitor({ isConnected, users, className = '', lastSaveTime, currentUser, charCount, wordCount }: PerformanceMonitorProps) {
    const [stats, setStats] = useState({
        renderCount: 0,
        lastUpdate: Date.now(),
        averageRenderTime: 0,
        connectionUptime: 0
    })

    const [connectionStartTime] = useState(Date.now())

    // Drag state
    const [position, setPosition] = useState({ top: 16, left: 16 })
    const [dragging, setDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const startTime = performance.now()

        setStats(prev => {
            const renderTime = performance.now() - startTime
            const newRenderCount = prev.renderCount + 1
            const avgRenderTime = (prev.averageRenderTime * (newRenderCount - 1) + renderTime) / newRenderCount

            return {
                renderCount: newRenderCount,
                lastUpdate: Date.now(),
                averageRenderTime: avgRenderTime,
                connectionUptime: isConnected ? Date.now() - connectionStartTime : 0
            }
        })
    }, [isConnected, connectionStartTime])

    // Drag handlers
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true)
        setDragOffset({
            x: e.clientX - position.left,
            y: e.clientY - position.top
        })
        // Prevent text selection
        document.body.style.userSelect = 'none'
    }

    useEffect(() => {
        if (!dragging) return
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                left: e.clientX - dragOffset.x,
                top: e.clientY - dragOffset.y
            })
        }
        const handleMouseUp = () => {
            setDragging(false)
            document.body.style.userSelect = ''
        }
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [dragging, dragOffset])

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div
            className={`fixed bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs font-mono z-50 ${className}`}
            style={{
                top: position.top,
                left: position.left,
                right: 'auto',
                bottom: 'auto',
                position: 'fixed',
                minWidth: 220,
                cursor: dragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="space-y-1">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div>Current user: <span className="font-bold">{currentUser}</span></div>
                <div>Active users: {users.length > 0 ? users.join(', ') : 'None'}</div>
                <div>Characters: {charCount ?? '-'} | Words: {wordCount ?? '-'}</div>
                <div>Renders: {stats.renderCount}</div>
                <div>Avg Render: {stats.averageRenderTime.toFixed(2)}ms</div>
                {isConnected && (
                    <div>Uptime: {Math.round(stats.connectionUptime / 1000)}s</div>
                )}
                {lastSaveTime && (
                    <div>Last save: {new Date(lastSaveTime).toLocaleTimeString()}</div>
                )}
            </div>
        </div>
    )
}
