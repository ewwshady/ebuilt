"use client"

import { Star } from "lucide-react"
import type { Review } from "@/lib/schemas"

interface ReviewSummaryProps {
  reviews: Review[]
}

export function ReviewSummary({ reviews }: ReviewSummaryProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No reviews yet</p>
      </div>
    )
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingCounts = [0, 0, 0, 0, 0]
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingCounts[stars - 1]
          const percentage = (count / reviews.length) * 100

          return (
            <div key={stars} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm">{stars}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
