import api from './axios'

export const getAllComplaints = async () => {
    const response = await api.get('/api/complaints')
    return response.data
}

export const getMyComplaints = async () => {
    const response = await api.get('/api/complaints/my')
    return response.data
}

export const getComplaintById = async (id) => {
    const response = await api.get(`/api/complaints/${id}`)
    return response.data
}

export const createComplaint = async (formData) => {
    const response = await api.post('/api/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}

export const updateComplaintStatus = async (id, status) => {
    const response = await api.patch(`/api/complaints/${id}/status`, { status })
    return response.data
}
