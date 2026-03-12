"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star } from "lucide-react"
import type { Review } from "@/lib/schemas"

interface ReviewTableProps {
  reviews: Review[]
  onUpdate: () => void
}

export function ReviewTable({ reviews, onUpdate }: ReviewTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (reviewId: string, status: string) => {
    setLoading(reviewId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Update review error:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    setLoading(reviewId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Delete review error:", error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return ""
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No reviews yet</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review._id?.toString()}>
              <TableCell>
                <div>
                  <p className="font-medium">{review.customerName}</p>
                  <p className="text-xs text-muted-foreground">{review.customerEmail}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{review.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(review.status)}>
                  {review.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loading === review._id?.toString()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(review._id!.toString(), "approved")}>
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(review._id!.toString(), "rejected")}>
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(review._id!.toString())} className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
