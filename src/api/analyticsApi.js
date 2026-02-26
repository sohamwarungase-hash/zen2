import api from './axios'

/**
 * Fetch high-level status counts (Total, Open, Resolved, etc.)
 */
export const getAnalyticsOverview = async () => {
    const response = await api.get('/api/analytics/overview')
    return response.data
}

/**
 * Fetch performance breakdown per department
 */
export const getAnalyticsDepartments = async () => {
    const response = await api.get('/api/analytics/departments')
    return response.data
}

/**
 * Fetch geospatial distribution for the heatmap
 */
export const getAnalyticsHeatmap = async () => {
    const response = await api.get('/api/analytics/heatmap')
    return response.data
}

/**
 * Fetch 30-day frequency trends
 */
export const getAnalyticsTrends = async () => {
    const response = await api.get('/api/analytics/trends')
    return response.data
}
