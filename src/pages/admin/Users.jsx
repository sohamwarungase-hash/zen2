import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { getUsers, updateUserRole } from '@/api/usersApi'
import { getDepartments } from '@/api/departmentsApi'
import { Shield, UserCog, Users as UsersIcon } from 'lucide-react'

function Modal({ open, title, children, onClose }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-lg bg-white shadow-xl border">
                    <div className="px-5 py-4 border-b flex items-center justify-between">
                        <h2 className="text-base font-semibold text-zenblue-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-sm text-muted-foreground hover:text-zenblue-800"
                        >
                            Close
                        </button>
                    </div>
                    <div className="p-5">{children}</div>
                </div>
            </div>
        </div>
    )
}

const ROLE_OPTIONS = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DEPT_OFFICER', label: 'Dept Officer' },
    { value: 'CITIZEN', label: 'Citizen' },
]

const ROLE_BADGE = {
    ADMIN: 'purple',
    DEPT_OFFICER: 'blue',
    CITIZEN: 'gray',
}

export default function Users() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [departments, setDepartments] = useState([])
    const [query, setQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('ALL')

    const [modalOpen, setModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [newRole, setNewRole] = useState('CITIZEN')
    const [newDeptId, setNewDeptId] = useState('')

    const deptById = useMemo(() => {
        const map = new Map()
        for (const d of departments) map.set(d.id, d)
        return map
    }, [departments])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return users
            .filter((u) => (roleFilter === 'ALL' ? true : u.role === roleFilter))
            .filter((u) => {
                if (!q) return true
                return (
                    (u.name || '').toLowerCase().includes(q) ||
                    (u.email || '').toLowerCase().includes(q) ||
                    (u.id || '').toLowerCase().includes(q)
                )
            })
    }, [users, query, roleFilter])

    const refresh = async () => {
        setLoading(true)
        try {
            const [u, d] = await Promise.all([getUsers(), getDepartments()])
            setUsers(Array.isArray(u) ? u : [])
            setDepartments(Array.isArray(d) ? d : [])
        } catch (e) {
            setUsers([])
            setDepartments([])
            toast({
                variant: 'destructive',
                title: 'Failed to load',
                description: e?.message || 'Unable to load users.',
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    const openManage = (u) => {
        setSelectedUser(u)
        setNewRole(u?.role || 'CITIZEN')
        setNewDeptId(u?.departmentId || '')
        setModalOpen(true)
    }

    const handleSave = async () => {
        if (!selectedUser?.id) return
        if (newRole === 'DEPT_OFFICER' && !newDeptId) {
            toast({
                variant: 'destructive',
                title: 'Department required',
                description: 'Select a department for a Dept Officer.',
            })
            return
        }
        try {
            await updateUserRole(selectedUser.id, newRole, newRole === 'DEPT_OFFICER' ? newDeptId : null)
            toast({ variant: 'success', title: 'User updated' })
            setModalOpen(false)
            await refresh()
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Update failed',
                description: e?.message || 'Unable to update user.',
            })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight flex items-center gap-2">
                        <UsersIcon className="h-6 w-6 text-zenaccent" />
                        User Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Filter users, manage roles, and assign department officers
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Search</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="userSearch">Name / Email</Label>
                            <Input
                                id="userSearch"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search users…"
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Role Filter</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label>Role</Label>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLE_OPTIONS.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Users</CardTitle>
                        <div className="text-xs text-muted-foreground">
                            {loading ? 'Loading…' : `${filtered.length} user(s)`}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-10 text-center text-muted-foreground">Loading…</div>
                        ) : filtered.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">No users found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-zenblue-50/50">
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">User</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Role</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">
                                                Department
                                            </th>
                                            <th className="text-right py-3 px-4 font-semibold text-zenblue-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="border-b last:border-0 hover:bg-zenblue-50/30 transition-colors"
                                            >
                                                <td className="py-3 px-4 font-medium text-zenblue-800">{u.name}</td>
                                                <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={ROLE_BADGE[u.role] || 'gray'}>{u.role}</Badge>
                                                </td>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {u.role === 'DEPT_OFFICER'
                                                        ? deptById.get(u.departmentId)?.name || '—'
                                                        : '—'}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openManage(u)}
                                                        className="text-zenaccent hover:text-zenaccent"
                                                    >
                                                        <UserCog className="h-4 w-4 mr-1" />
                                                        Manage
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Modal
                    open={modalOpen}
                    title="Manage User"
                    onClose={() => setModalOpen(false)}
                >
                    <div className="space-y-4">
                        <div className="rounded-lg border bg-zenblue-50/30 p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-zenblue-800">
                                        {selectedUser?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{selectedUser?.email}</p>
                                </div>
                                <Shield className="h-5 w-5 text-zenaccent" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CITIZEN">Citizen</SelectItem>
                                    <SelectItem value="DEPT_OFFICER">Dept Officer</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {newRole === 'DEPT_OFFICER' && (
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={newDeptId} onValueChange={setNewDeptId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={d.id}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-zenblue-800 hover:bg-zenblue-700" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Modal>
            </main>
        </div>
    )
}

