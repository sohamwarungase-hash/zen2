import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { loginUser } from '@/api/authApi'
import useAuthStore from '@/store/authStore'
import { Shield, Loader2 } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please fill in all fields.',
            })
            return
        }

        setLoading(true)
        try {
            const data = await loginUser(email, password)
            const { token, refreshToken, user } = data
            const role = user?.role || 'CITIZEN'

            // setAuth syncs with both Zustand and Supabase client
            await setAuth({ token, refreshToken, user, role })

            toast({
                variant: 'success',
                title: 'Welcome back!',
                description: `Logged in as ${user?.name || email}`,
            })
            // Role-based redirect
            if (role === 'CITIZEN') {
                navigate('/citizen/home')
            } else {
                navigate('/admin/dashboard')
            }
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Login failed',
                description: err?.message || 'Unable to sign in. Please try again.',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zenblue-50 via-white to-blue-50 px-4">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlM2E1ZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-60" />

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-zenblue-700 to-zenaccent shadow-lg mb-4">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight">
                        ZenSolve
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Municipal Grievance Management System
                    </p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-center">Sign In</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-zenblue-800 hover:bg-zenblue-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-zenaccent hover:underline font-medium"
                            >
                                Register here
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    © 2026 ZenSolve by Team alphaCode — HackGenX
                </p>
            </div>
        </div>
    )
}
