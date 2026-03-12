"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductTable } from "@/components/product-table"
import { CreateProductDialog } from "@/components/create-product-dialog"
import { Plus } from "lucide-react"
import type { Product } from "@/lib/schemas"

export default function ProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "tenant_admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "tenant_admin") {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Fetch products error:", error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Delete product error:", error)
    }
  }

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product)
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your store's product catalog</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {loadingProducts ? (
        <div className="text-center py-8 text-muted-foreground">Loading products...</div>
      ) : (
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <CreateProductDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={fetchProducts} />
    </div>
  )
}
