"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { ReviewTable } from "@/components/review-table"
import type { Review } from "@/lib/schemas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReviewsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!loading && (!user || user.role !== "tenant_admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.tenantId) {
      fetchReviews()
    }
  }, [user])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?tenantId=${user?.tenantId}&status=all`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error("Fetch reviews error:", error)
    }
  }

  const filterReviews = (status: string) => {
    if (status === "all") return reviews
    return reviews.filter((review) => review.status === status)
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const stats = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground mt-1">Manage customer reviews and ratings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ReviewTable reviews={reviews} onUpdate={fetchReviews} />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <ReviewTable reviews={filterReviews("pending")} onUpdate={fetchReviews} />
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          <ReviewTable reviews={filterReviews("approved")} onUpdate={fetchReviews} />
        </TabsContent>
        <TabsContent value="rejected" className="mt-6">
          <ReviewTable reviews={filterReviews("rejected")} onUpdate={fetchReviews} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
