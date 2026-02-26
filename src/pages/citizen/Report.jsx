import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createComplaint } from '@/api/complaintsApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import Navbar from '@/components/Navbar'
import { Camera, MapPin, Loader2, Upload, X } from 'lucide-react'

const CATEGORIES = [
    'Roads & Potholes',
    'Water Supply',
    'Garbage & Sanitation',
    'Street Lighting',
    'Drainage & Sewage',
    'Public Safety',
]

export default function Report() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [gpsLoading, setGpsLoading] = useState(false)

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        photo: null,
        latitude: '',
        longitude: '',
    })

    const [preview, setPreview] = useState(null)

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: 'destructive',
                title: 'File Too Large',
                description: 'Photo must be under 5MB.',
            })
            return
        }
        setForm((prev) => ({ ...prev, photo: file }))
        setPreview(URL.createObjectURL(file))
    }

    const removePhoto = () => {
        setForm((prev) => ({ ...prev, photo: null }))
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const captureGPS = () => {
        if (!navigator.geolocation) {
            toast({
                variant: 'destructive',
                title: 'GPS Not Available',
                description: 'Your browser does not support geolocation.',
            })
            return
        }

        setGpsLoading(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((prev) => ({
                    ...prev,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                }))
                toast({
                    variant: 'success',
                    title: 'Location Captured',
                    description: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
                })
                setGpsLoading(false)
            },
            (err) => {
                toast({
                    variant: 'destructive',
                    title: 'GPS Error',
                    description: err.message,
                })
                setGpsLoading(false)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.title || !form.category || !form.description) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Please fill in title, category, and description.',
            })
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('description', form.description)
            formData.append('category', form.category)
            if (form.photo) formData.append('photo', form.photo)
            if (form.latitude) formData.append('latitude', form.latitude)
            if (form.longitude) formData.append('longitude', form.longitude)

            await createComplaint(formData)

            toast({
                variant: 'success',
                title: 'Complaint Filed!',
                description: 'Your complaint has been submitted successfully.',
            })

            navigate('/citizen/complaints')
        } catch {
            // handled by interceptor
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-zenblue-800 tracking-tight">
                        Report an Issue
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Help us improve your neighborhood by reporting civic issues
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Complaint Details</CardTitle>
                        <CardDescription>
                            Provide as much detail as possible to help us resolve the issue faster
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <Label>Photo Evidence</Label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-zenblue-200 rounded-lg p-6 text-center cursor-pointer hover:border-zenaccent hover:bg-zenblue-50/30 transition-all"
                                >
                                    {preview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-h-48 rounded-lg mx-auto"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removePhoto()
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-8 w-8 mx-auto text-zenblue-300" />
                                            <p className="text-sm text-muted-foreground">
                                                Click to upload or drag a photo
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                JPG, PNG up to 5MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </div>

                            {/* GPS */}
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={captureGPS}
                                        disabled={gpsLoading}
                                        className="flex-shrink-0"
                                    >
                                        {gpsLoading ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <MapPin className="h-4 w-4 mr-2" />
                                        )}
                                        {form.latitude ? 'Recapture' : 'Capture GPS'}
                                    </Button>
                                    {form.latitude && (
                                        <div className="flex items-center text-sm text-muted-foreground bg-zenblue-50 px-3 rounded-md">
                                            📍 {form.latitude}, {form.longitude}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(val) => handleChange('category', val)}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Brief title for your complaint"
                                    value={form.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the issue in detail — location landmarks, how long it has existed, impact on residents..."
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full bg-zenblue-800 hover:bg-zenblue-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Complaint'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
