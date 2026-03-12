"use client"

import { Star } from "lucide-react"
import type { Review } from "@/lib/schemas"
import { Card, CardContent } from "@/components/ui/card"

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id?.toString()}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{review.customerName}</h4>
                <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <h5 className="font-medium mb-2">{review.title}</h5>
            <p className="text-muted-foreground">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
