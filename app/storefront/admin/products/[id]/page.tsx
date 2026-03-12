// app/storefront/admin/products/[id]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormCard } from "@/components/admin/FormCard"
import { toast } from "sonner"
import { ArrowLeft, Loader, Plus, Trash2 } from "lucide-react"

export default function ProductFormPage() {
  const router = useRouter(); const params = useParams(); const id = params.id as string; const isEdit = id !== "new"
  const [loading, setLoading] = useState(isEdit); const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<any>({
    name: "", description: "", price: 0, compareAtPrice: 0, costPrice: 0, images: [], category: "", collections: [], tags: [], vendor: "", 
    isPhysical: true, weight: 0, weightUnit: "kg", isTaxable: true, status: "draft",
    inventory: { sku: "", quantity: 0, trackInventory: true, lowStockThreshold: 5 },
    seo: { title: "", description: "", keywords: [] }
  })

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/tenants/products/${id}`).then(res => res.json()).then(data => { setFormData(data.product); setLoading(false) })
    }
  }, [id, isEdit])

  const hNum = (v: string) => isNaN(parseFloat(v)) ? 0 : parseFloat(v)
  const hInt = (v: string) => isNaN(parseInt(v)) ? 0 : parseInt(v)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const res = await fetch(isEdit ? `/api/tenants/products/${id}` : "/api/tenants/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    if (res.ok) { toast.success("Saved!"); router.push("/admin/products") } else { toast.error("Error"); setSaving(false) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin"/></div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products"><Button variant="ghost" size="icon"><ArrowLeft /></Button></Link>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit" : "New"} Product</h1>
        <Button type="submit" className="ml-auto bg-blue-600" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormCard title="Product Content">
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div><Label>Description</Label><textarea className="w-full border rounded p-2 min-h-[120px] text-sm" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            </div>
          </FormCard>

          <FormCard title="Media (Images)">
            {formData.images?.map((img: any, i: number) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input placeholder="URL" value={img.url} onChange={e => { const imgs = [...formData.images]; imgs[i].url = e.target.value; setFormData({...formData, images: imgs})}} />
                <Input placeholder="Alt" value={img.alt} onChange={e => { const imgs = [...formData.images]; imgs[i].alt = e.target.value; setFormData({...formData, images: imgs})}} />
                <Button variant="ghost" onClick={() => setFormData({...formData, images: formData.images.filter((_: any, idx: number) => idx !== i)})}><Trash2 className="h-4 w-4 text-red-500"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => setFormData({...formData, images: [...formData.images, {url:"", alt:""}]})}><Plus className="h-4 w-4 mr-2"/>Add Image URL</Button>
          </FormCard>

          <FormCard title="Pricing & Taxes">
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Price</Label><Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: hNum(e.target.value)})} /></div>
              <div><Label>Compare At</Label><Input type="number" step="0.01" value={formData.compareAtPrice} onChange={e => setFormData({...formData, compareAtPrice: hNum(e.target.value)})} /></div>
              <div><Label>Cost Per Item</Label><Input type="number" step="0.01" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: hNum(e.target.value)})} /></div>
            </div>
            <div className="flex items-center gap-2 mt-4"><Checkbox id="tax" checked={formData.isTaxable} onCheckedChange={v => setFormData({...formData, isTaxable: !!v})}/><Label htmlFor="tax">Charge tax on this product</Label></div>
          </FormCard>

          <FormCard title="Inventory">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>SKU</Label><Input value={formData.inventory.sku} onChange={e => setFormData({...formData, inventory: {...formData.inventory, sku: e.target.value}})} /></div>
              <div><Label>Quantity</Label><Input type="number" value={formData.inventory.quantity} onChange={e => setFormData({...formData, inventory: {...formData.inventory, quantity: hInt(e.target.value)}})} /></div>
              <div><Label>Low Stock Alert</Label><Input type="number" value={formData.inventory.lowStockThreshold} onChange={e => setFormData({...formData, inventory: {...formData.inventory, lowStockThreshold: hInt(e.target.value)}})} /></div>
              <div className="flex items-center gap-2"><Checkbox id="track" checked={formData.inventory.trackInventory} onCheckedChange={v => setFormData({...formData, inventory: {...formData.inventory, trackInventory: !!v}})}/><Label htmlFor="track">Track Stock</Label></div>
            </div>
          </FormCard>

          <FormCard title="SEO Settings">
            <div className="space-y-4">
              <div><Label>SEO Title</Label><Input value={formData.seo.title} onChange={e => setFormData({...formData, seo: {...formData.seo, title: e.target.value}})} /></div>
              <div><Label>SEO Description</Label><textarea className="w-full border rounded p-2 text-sm" value={formData.seo.description} onChange={e => setFormData({...formData, seo: {...formData.seo, description: e.target.value}})} /></div>
              <div><Label>Keywords (Comma separated)</Label><Input value={formData.seo.keywords.join(", ")} onChange={e => setFormData({...formData, seo: {...formData.seo, keywords: e.target.value.split(",").map(s => s.trim())}})} /></div>
            </div>
          </FormCard>
        </div>

        <div className="space-y-6">
          <FormCard title="Status">
            <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
            </Select>
          </FormCard>
          <FormCard title="Organization">
            <div className="space-y-4">
              <div><Label>Vendor</Label><Input value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} /></div>
              <div><Label>Category</Label><Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
              <div><Label>Collections (IDs)</Label><Input value={formData.collections.join(", ")} placeholder="65...1, 65...2" onChange={e => setFormData({...formData, collections: e.target.value ? e.target.value.split(",").map(s => s.trim()) : []})} /></div>
              <div><Label>Tags</Label><Input value={formData.tags.join(", ")} placeholder="New, Sale" onChange={e => setFormData({...formData, tags: e.target.value ? e.target.value.split(",").map(s => s.trim()) : []})} /></div>
            </div>
          </FormCard>
          <FormCard title="Shipping">
            <div className="space-y-4">
              <div className="flex items-center gap-2"><Checkbox id="phys" checked={formData.isPhysical} onCheckedChange={v => setFormData({...formData, isPhysical: !!v})}/><Label htmlFor="phys">Physical Product</Label></div>
              {formData.isPhysical && <div className="grid grid-cols-2 gap-2">
                <Input type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: hNum(e.target.value)})} />
                <Select value={formData.weightUnit} onValueChange={v => setFormData({...formData, weightUnit: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="g">g</SelectItem><SelectItem value="lb">lb</SelectItem><SelectItem value="oz">oz</SelectItem></SelectContent>
                </Select>
              </div>}
            </div>
          </FormCard>
        </div>
      </div>
    </form>
  )
}
