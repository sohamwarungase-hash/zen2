import api from './axios'

export const getAnalyticsOverview = async () => {
    const response = await api.get('/api/analytics/overview')
    return response.data
}
