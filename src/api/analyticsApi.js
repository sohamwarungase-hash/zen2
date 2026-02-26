import api from './axios'

export const getAnalyticsOverview = async () => {
    const response = await api.get('/api/analytics/overview')
    return response.data
}

export const getAnalyticsDepartments = async () => {
    const response = await api.get('/api/analytics/departments')
    return response.data
}

export const getAnalyticsTrends = async () => {
    const response = await api.get('/api/analytics/trends')
    return response.data
}
