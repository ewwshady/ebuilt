"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Check, X } from "lucide-react"

interface Review {
  _id: string
  title: string
  comment: string
  rating: number
  customerName: string
  customerEmail: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("pending")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const LIMIT = 10

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
          status,
        })

        const response = await fetch(`/api/tenants/reviews?${query}`)
        if (!response.ok) throw new Error("Failed to fetch reviews")

        const data = await response.json()
        setReviews(data.reviews)
        setTotal(data.pagination.total)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        toast.error("Failed to load reviews")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [page, status])

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/tenants/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      })

      if (!response.ok) throw new Error("Failed to approve review")

      setReviews(reviews.map((r) => (r._id === id ? { ...r, status: "approved" } : r)))
      toast.success("Review approved")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to approve review")
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/tenants/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })

      if (!response.ok) throw new Error("Failed to reject review")

      setReviews(reviews.map((r) => (r._id === id ? { ...r, status: "rejected" } : r)))
      toast.success("Review rejected")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to reject review")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-1">Manage customer reviews</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select value={status} onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-500 mt-4">Loading reviews...</p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review._id} className="shadow-sm border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      By {review.customerName} • {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-600">{review.customerEmail}</p>

                {review.status === "pending" && (
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleApprove(review._id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleReject(review._id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * LIMIT + 1} to {Math.min(page * LIMIT, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(Math.ceil(total / LIMIT), page + 1))}
              disabled={page * LIMIT >= total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
