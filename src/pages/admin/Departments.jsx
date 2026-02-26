import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/api/departmentsApi'
import { getUsers } from '@/api/usersApi'
import { Badge } from '@/components/ui/badge'
import { Building2, Pencil, Plus, Trash2, Users } from 'lucide-react'

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

export default function Departments() {
    const [loading, setLoading] = useState(true)
    const [departments, setDepartments] = useState([])
    const [users, setUsers] = useState([])

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const officersByDept = useMemo(() => {
        const map = new Map()
        for (const u of users) {
            if (u.role !== 'DEPT_OFFICER') continue
            const deptId = u.departmentId || 'unassigned'
            if (!map.has(deptId)) map.set(deptId, [])
            map.get(deptId).push(u)
        }
        return map
    }, [users])

    const refresh = async () => {
        setLoading(true)
        try {
            const [d, u] = await Promise.all([getDepartments(), getUsers()])
            setDepartments(Array.isArray(d) ? d : [])
            setUsers(Array.isArray(u) ? u : [])
        } catch (e) {
            setDepartments([])
            setUsers([])
            toast({
                variant: 'destructive',
                title: 'Failed to load',
                description: e?.message || 'Unable to load departments.',
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    const openCreate = () => {
        setEditing(null)
        setName('')
        setDescription('')
        setModalOpen(true)
    }

    const openEdit = (dept) => {
        setEditing(dept)
        setName(dept?.name || '')
        setDescription(dept?.description || '')
        setModalOpen(true)
    }

    const handleSave = async () => {
        try {
            if (editing?.id) {
                await updateDepartment(editing.id, { name, description })
                toast({ variant: 'success', title: 'Department updated' })
            } else {
                await createDepartment({ name, description })
                toast({ variant: 'success', title: 'Department created' })
            }
            setModalOpen(false)
            await refresh()
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Save failed',
                description: e?.message || 'Unable to save department.',
            })
        }
    }

    const handleDelete = async (dept) => {
        const ok = window.confirm(`Delete department "${dept?.name}"?`)
        if (!ok) return
        try {
            await deleteDepartment(dept.id)
            toast({ variant: 'success', title: 'Department deleted' })
            await refresh()
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Delete failed',
                description: e?.message || 'Unable to delete department.',
            })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-zenaccent" />
                            Department Management
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage departments and see assigned officers (demo data until backend is ready)
                        </p>
                    </div>
                    <Button className="bg-zenblue-800 hover:bg-zenblue-700" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Department
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-10 text-center text-muted-foreground">Loading…</div>
                        ) : departments.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">No departments found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-zenblue-50/50">
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">Name</th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">
                                                Description
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-zenblue-700">
                                                Officers
                                            </th>
                                            <th className="text-right py-3 px-4 font-semibold text-zenblue-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.map((dept) => {
                                            const officers = officersByDept.get(dept.id) || []
                                            return (
                                                <tr
                                                    key={dept.id}
                                                    className="border-b last:border-0 hover:bg-zenblue-50/30 transition-colors"
                                                >
                                                    <td className="py-3 px-4 font-medium text-zenblue-800">
                                                        {dept.name}
                                                    </td>
                                                    <td className="py-3 px-4 text-muted-foreground max-w-[420px]">
                                                        <span className="line-clamp-2">
                                                            {dept.description || '—'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {officers.length === 0 ? (
                                                                <Badge variant="gray">
                                                                    <Users className="h-3.5 w-3.5 mr-1" />
                                                                    0 officers
                                                                </Badge>
                                                            ) : (
                                                                officers.slice(0, 3).map((o) => (
                                                                    <Badge key={o.id} variant="blue">
                                                                        {o.name}
                                                                    </Badge>
                                                                ))
                                                            )}
                                                            {officers.length > 3 && (
                                                                <Badge variant="gray">+{officers.length - 3} more</Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEdit(dept)}
                                                                className="text-zenaccent hover:text-zenaccent"
                                                            >
                                                                <Pencil className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(dept)}
                                                                className="text-red-600 hover:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Modal
                    open={modalOpen}
                    title={editing ? 'Edit Department' : 'Add Department'}
                    onClose={() => setModalOpen(false)}
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="deptName">Department Name</Label>
                            <Input
                                id="deptName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Water Supply"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deptDesc">Description</Label>
                            <Input
                                id="deptDesc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short summary of responsibilities"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-zenblue-800 hover:bg-zenblue-700" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                </Modal>
            </main>
        </div>
    )
}

