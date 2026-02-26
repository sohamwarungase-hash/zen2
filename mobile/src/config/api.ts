/**
 * API Configuration
 * Centralized API endpoint management.
 */

const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // Fallback for local development
    // 10.0.2.2 is the special IP to reach host from Android Emulator
    return "http://10.0.2.2:5000";
};

const API_BASE_URL = getBaseUrl();
console.log(`[API_CONFIG] Base URL: ${API_BASE_URL}`);

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
        // Auth
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        ME: `${API_BASE_URL}/api/auth/me`,

        // Complaints
        COMPLAINTS: `${API_BASE_URL}/api/complaints`,
        MY_COMPLAINTS: `${API_BASE_URL}/api/complaints/my`,
        VALIDATE_COMPLAINT: (id: string) => `${API_BASE_URL}/api/complaints/${id}/validate`,

        // Others
        HEALTH: `${API_BASE_URL}/health`,
    },
};

