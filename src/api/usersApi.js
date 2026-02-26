const STORAGE_KEY = 'zensolve_users_v1'

function safeJsonParse(value, fallback) {
    try {
        return JSON.parse(value)
    } catch {
        return fallback
    }
}

function seedUsers() {
    return [
        {
            id: 'user-admin-1',
            name: 'System Admin',
            email: 'admin@zensolve.local',
            role: 'ADMIN',
            departmentId: null,
        },
        {
            id: 'user-officer-1',
            name: 'Ward Officer',
            email: 'officer@zensolve.local',
            role: 'DEPT_OFFICER',
            departmentId: 'dept-sanitation',
        },
        {
            id: 'user-citizen-1',
            name: 'Citizen User',
            email: 'citizen@zensolve.local',
            role: 'CITIZEN',
            departmentId: null,
        },
    ]
}

function loadUsers() {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = safeJsonParse(raw, null)
    if (Array.isArray(parsed)) return parsed
    const seeded = seedUsers()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    return users
}

export async function getUsers() {
    return loadUsers()
}

export async function updateUserRole(userId, role, departmentId = null) {
    const users = loadUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) throw new Error('User not found')

    users[idx] = {
        ...users[idx],
        role,
        departmentId: role === 'DEPT_OFFICER' ? departmentId : null,
    }

    saveUsers(users)
    return users[idx]
}

export async function updateUserDepartment(userId, departmentId) {
    const users = loadUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) throw new Error('User not found')

    users[idx] = {
        ...users[idx],
        departmentId,
    }

    saveUsers(users)
    return users[idx]
}

