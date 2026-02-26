import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FeedbackForm({ complaintId, existingFeedback, onSubmit }) {
    const [rating, setRating] = useState(existingFeedback?.rating || 0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState(existingFeedback?.comment || '')
    const [submitted, setSubmitted] = useState(!!existingFeedback)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) return
        setSubmitting(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setSubmitting(false)
        setSubmitted(true)
        onSubmit?.({ rating, comment })
    }

    if (submitted) {
        return (
            <div className="text-center py-4">
                <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                'h-5 w-5',
                                star <= (existingFeedback?.rating || rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-200'
                            )}
                        />
                    ))}
                </div>
                <p className="text-sm font-medium text-green-600">Thank you for your feedback!</p>
                {(existingFeedback?.comment || comment) && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                        "{existingFeedback?.comment || comment}"
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-medium text-zenblue-800 mb-2">Rate your experience</p>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={cn(
                                    'h-7 w-7 transition-colors',
                                    star <= (hoveredRating || rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-200 hover:text-amber-200'
                                )}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </span>
                    )}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-zenblue-800 mb-1.5 block">
                    Comments (optional)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-zenblue-400 focus:border-transparent resize-none"
                />
            </div>

            <Button
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
                className="w-full bg-zenblue-800 hover:bg-zenblue-700"
            >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
        </div>
    )
}
