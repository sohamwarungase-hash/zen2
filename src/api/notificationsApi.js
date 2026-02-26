import useNotificationStore from '@/store/notificationStore'

/**
 * API wrapper for notifications.
 * Currently reads from the Zustand store (localStorage-backed).
 * Replace with real API calls when the backend is ready.
 */

export async function getNotifications() {
    return useNotificationStore.getState().notifications
}

export async function markAsRead(notifId) {
    useNotificationStore.getState().markAsRead(notifId)
    return true
}

export async function markAllAsRead() {
    useNotificationStore.getState().markAllAsRead()
    return true
}

export async function removeNotification(notifId) {
    useNotificationStore.getState().removeNotification(notifId)
    return true
}

export async function clearAllNotifications() {
    useNotificationStore.getState().clearAll()
    return true
}
