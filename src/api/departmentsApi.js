const STORAGE_KEY = 'zensolve_departments_v1'

function safeJsonParse(value, fallback) {
    try {
        return JSON.parse(value)
    } catch {
        return fallback
    }
}

function loadDepartments() {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = safeJsonParse(raw, null)
    if (Array.isArray(parsed)) return parsed

    // Seed defaults for demo/dev (can be removed when backend is ready)
    const seeded = [
        {
            id: 'dept-sanitation',
            name: 'Sanitation',
            description: 'Garbage collection, cleanliness, and public hygiene',
            officers: [],
        },
        {
            id: 'dept-water',
            name: 'Water Supply',
            description: 'Water leakage, supply disruption, pipeline maintenance',
            officers: [],
        },
        {
            id: 'dept-roads',
            name: 'Roads & Infrastructure',
            description: 'Potholes, road damage, footpaths, and civic works',
            officers: [],
        },
        {
            id: 'dept-streetlights',
            name: 'Streetlights',
            description: 'Streetlight outages and electrical maintenance',
            officers: [],
        },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
}

function saveDepartments(depts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(depts))
    return depts
}

function makeId(prefix = 'dept') {
    return `${prefix}-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
}

export async function getDepartments() {
    return loadDepartments()
}

export async function createDepartment(payload) {
    const departments = loadDepartments()
    const dept = {
        id: makeId('dept'),
        name: (payload?.name || '').trim(),
        description: (payload?.description || '').trim(),
        officers: Array.isArray(payload?.officers) ? payload.officers : [],
    }
    if (!dept.name) throw new Error('Department name is required')
    departments.unshift(dept)
    saveDepartments(departments)
    return dept
}

export async function updateDepartment(departmentId, updates) {
    const departments = loadDepartments()
    const idx = departments.findIndex((d) => d.id === departmentId)
    if (idx === -1) throw new Error('Department not found')

    const next = {
        ...departments[idx],
        ...updates,
    }

    next.name = (next.name || '').trim()
    next.description = (next.description || '').trim()
    if (!next.name) throw new Error('Department name is required')

    departments[idx] = next
    saveDepartments(departments)
    return next
}

export async function deleteDepartment(departmentId) {
    const departments = loadDepartments()
    const next = departments.filter((d) => d.id !== departmentId)
    saveDepartments(next)
    return true
}

export async function setDepartmentOfficers(departmentId, officers) {
    return updateDepartment(departmentId, {
        officers: Array.isArray(officers) ? officers : [],
    })
}

