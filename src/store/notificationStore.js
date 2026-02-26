import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SEED_NOTIFICATIONS = [
    {
        id: 'notif-1',
        type: 'STATUS_UPDATE',
        title: 'Complaint GRV-1042 Updated',
        message: 'Status changed to In Progress — repair crew dispatched.',
        complaintId: 'GRV-1042',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 min ago
    },
    {
        id: 'notif-2',
        type: 'ASSIGNMENT',
        title: 'New Assignment',
        message: 'Complaint "Broken streetlight near Gandhi Park" assigned to you.',
        complaintId: 'GRV-1067',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 min ago
    },
    {
        id: 'notif-3',
        type: 'SLA_BREACH',
        title: 'SLA Breached',
        message: 'Complaint "Garbage not collected in Ward 14" has exceeded its deadline.',
        complaintId: 'GRV-1095',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hr ago
    },
    {
        id: 'notif-4',
        type: 'NEW_COMPLAINT',
        title: 'New Complaint Filed',
        message: '"Drainage overflow on Lake View Road" in Drainage & Sewage',
        complaintId: 'GRV-1098',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hr ago
    },
    {
        id: 'notif-5',
        type: 'STATUS_UPDATE',
        title: 'Complaint GRV-1055 Resolved',
        message: 'Water supply restored at Block C Apartments. Main valve repaired.',
        complaintId: 'GRV-1055',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hr ago
    },
    {
        id: 'notif-6',
        type: 'ASSIGNMENT',
        title: 'Reassignment',
        message: 'Complaint "Open manhole on Station Road" reassigned to Roads & Transport.',
        complaintId: 'GRV-1101',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hr ago
    },
    {
        id: 'notif-7',
        type: 'SLA_BREACH',
        title: 'SLA Warning',
        message: 'Complaint "Illegal dumping at Jayanagar" approaching SLA deadline.',
        complaintId: 'GRV-1103',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hr ago
    },
    {
        id: 'notif-8',
        type: 'NEW_COMPLAINT',
        title: 'New Complaint Filed',
        message: '"Pothole near Bus Stand" in Roads & Potholes',
        complaintId: 'GRV-1110',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hr ago
    },
]

function makeId() {
    return `notif-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

const useNotificationStore = create(
    persist(
        (set, get) => ({
            notifications: SEED_NOTIFICATIONS,

            /**
             * Number of unread notifications.
             */
            unreadCount: () => get().notifications.filter((n) => !n.read).length,

            /**
             * Add a new notification (from Socket.IO or local action).
             */
            addNotification: (notification) => {
                const newNotif = {
                    id: makeId(),
                    read: false,
                    timestamp: new Date().toISOString(),
                    ...notification,
                }
                set((state) => ({
                    notifications: [newNotif, ...state.notifications].slice(0, 50), // cap at 50
                }))
            },

            /**
             * Mark a single notification as read.
             */
            markAsRead: (notifId) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === notifId ? { ...n, read: true } : n
                    ),
                }))
            },

            /**
             * Mark all notifications as read.
             */
            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                }))
            },

            /**
             * Remove a single notification.
             */
            removeNotification: (notifId) => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== notifId),
                }))
            },

            /**
             * Clear all notifications.
             */
            clearAll: () => set({ notifications: [] }),
        }),
        {
            name: 'zensolve-notifications',
            partialize: (state) => ({
                notifications: state.notifications,
            }),
        }
    )
)

export default useNotificationStore
