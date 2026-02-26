const ENV_API_URL =
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
    import.meta.env.VITE_API_URL

const API_BASE_URL = (ENV_API_URL || 'http://localhost:5000').replace(/\/$/, '').replace(/\/api$/, '')

export default API_BASE_URL
