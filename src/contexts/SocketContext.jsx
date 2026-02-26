import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import useAuthStore from '@/store/authStore'
import useNotificationStore from '@/store/notificationStore'
import API_BASE_URL from '@/config/api'

const SocketContext = createContext(null)

const SOCKET_URL = API_BASE_URL

export function SocketProvider({ children }) {
    const socketRef = useRef(null)
    const [connected, setConnected] = useState(false)
    const { token } = useAuthStore()
    const { addNotification } = useNotificationStore()

    useEffect(() => {
        // Only attempt connection if we have a token
        if (!token) {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
                setConnected(false)
            }
            return
        }

        // Create socket connection
        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            timeout: 10000,
            autoConnect: true,
        })

        socketRef.current = socket

        socket.on('connect', () => {
            console.log('[ZenSolve Socket] Connected:', socket.id)
            setConnected(true)
        })

        socket.on('disconnect', (reason) => {
            console.log('[ZenSolve Socket] Disconnected:', reason)
            setConnected(false)
        })

        socket.on('connect_error', (error) => {
            // Silently handle — backend may not be running yet
            console.warn('[ZenSolve Socket] Connection error (backend may not be running):', error.message)
            setConnected(false)
        })

        // Listen for real-time complaint status updates
        socket.on('complaint:statusUpdate', (data) => {
            addNotification({
                type: 'STATUS_UPDATE',
                title: `Complaint ${data.complaintId || 'updated'}`,
                message: `Status changed to ${data.status || 'unknown'}`,
                complaintId: data.complaintId,
                timestamp: new Date().toISOString(),
            })
        })

        // Listen for new complaint assignments (for officers)
        socket.on('complaint:assigned', (data) => {
            addNotification({
                type: 'ASSIGNMENT',
                title: 'New Assignment',
                message: `Complaint "${data.title || data.complaintId}" assigned to you`,
                complaintId: data.complaintId,
                timestamp: new Date().toISOString(),
            })
        })

        // Listen for SLA breach alerts
        socket.on('complaint:slaBreached', (data) => {
            addNotification({
                type: 'SLA_BREACH',
                title: 'SLA Breached',
                message: `Complaint "${data.title || data.complaintId}" has exceeded its SLA deadline`,
                complaintId: data.complaintId,
                timestamp: new Date().toISOString(),
            })
        })

        // Listen for new complaints (for admins)
        socket.on('complaint:new', (data) => {
            addNotification({
                type: 'NEW_COMPLAINT',
                title: 'New Complaint Filed',
                message: `"${data.title || 'Untitled'}" in ${data.category || 'General'}`,
                complaintId: data.complaintId,
                timestamp: new Date().toISOString(),
            })
        })

        // Cleanup on unmount or token change
        return () => {
            socket.disconnect()
            socketRef.current = null
            setConnected(false)
        }
    }, [token, addNotification])

    const value = {
        socket: socketRef.current,
        connected,
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    return useContext(SocketContext)
}

export default SocketContext
