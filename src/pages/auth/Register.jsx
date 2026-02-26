import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { registerUser } from '@/api/authApi'
import { Shield, Loader2 } from 'lucide-react'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !email || !password || !confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please fill in all fields.',
            })
            return
        }

        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Passwords do not match.',
            })
            return
        }

        if (password.length < 6) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Password must be at least 6 characters.',
            })
            return
        }

        setLoading(true)
        try {
            await registerUser(name, email, password)
            toast({
                variant: 'success',
                title: 'Account Created!',
                description: 'Please sign in with your credentials.',
            })
            navigate('/login')
        } catch (err) {
            // Error toast handled by axios interceptor
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
                        Create your citizen account
                    </p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-center">Register</CardTitle>
                        <CardDescription className="text-center">
                            Create an account to file and track civic complaints
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    autoComplete="name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-email">Email Address</Label>
                                <Input
                                    id="reg-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-password">Password</Label>
                                <Input
                                    id="reg-password"
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete="new-password"
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
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-zenaccent hover:underline font-medium"
                            >
                                Sign in
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
