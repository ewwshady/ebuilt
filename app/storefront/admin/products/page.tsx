// app/storefront/admin/products/page.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/admin/DataTable"
import { Edit2, Trash2, Plus, Search } from "lucide-react"
import { toast } from "sonner"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all") 
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 10

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams({ page: String(page), limit: String(LIMIT), ...(search && { search }), ...(status !== "all" && { status }) })
        const res = await fetch(`/api/tenants/products?${query}`)
        const data = await res.json()
        setProducts(data.products || [])
        setTotal(data.pagination?.total || 0)
      } catch (e) { toast.error("Error loading products") } finally { setLoading(false) }
    }
    fetchProducts()
  }, [page, search, status])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    await fetch(`/api/tenants/products/${id}`, { method: "DELETE" })
    setProducts(products.filter((p: any) => p._id !== id))
    toast.success("Deleted")
  }

  const columns = [
    { key: "name", label: "Product Name", render: (v: string, row: any) => (
      <div className="flex flex-col"><span className="font-medium">{v}</span><span className="text-xs text-gray-400">{row.vendor || "No Vendor"}</span></div>
    )},
    { key: "price", label: "Price", render: (v: number) => `$${v.toFixed(2)}` },
    { key: "inventory", label: "Stock", render: (v: any) => (
      <div className="flex flex-col"><span>{v.quantity} units</span><span className="text-xs text-gray-400">SKU: {v.sku || "N/A"}</span></div>
    )},
    { key: "status", label: "Status", render: (v: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{v.toUpperCase()}</span>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new"><Button className="bg-blue-600"><Plus className="mr-2 h-4 w-4" /> Add Product</Button></Link>
      </div>
      <div className="bg-white p-4 border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent>
        </Select>
        <Button variant="outline" onClick={() => {setSearch(""); setStatus("all")}}>Clear Filters</Button>
      </div>
      <DataTable columns={columns} data={products} isLoading={loading} pagination={{ total, page, pageSize: LIMIT, onPageChange: setPage }} 
        actions={(row: any) => (
          <div className="flex gap-2">
            <Link href={`/admin/products/${row._id}`}><Button variant="outline" size="sm"><Edit2 className="h-4 w-4"/></Button></Link>
            <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(row._id)}><Trash2 className="h-4 w-4"/></Button>
          </div>
        )}
      />
    </div>
  )
}
