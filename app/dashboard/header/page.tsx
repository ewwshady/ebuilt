"use client"

import { useEffect, useState } from "react"
import { Search, ShoppingCart, User } from "lucide-react"

// TYPES
type MenuItem = { label: string; href: string }
type HeaderIcons = { search: boolean; cart: boolean; account: boolean }
type HeaderData = { logo: string; showTitle: boolean; menu: MenuItem[]; icons: HeaderIcons }
type Tenant = { id: string; name: string; header: HeaderData }

// HEADER COMPONENT
const Header = ({ tenant }: { tenant: Tenant }) => {
  const { header } = tenant
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <img src={header.logo || ""} alt="Logo" className="h-10" />
      <div className="flex gap-4">
        {header.menu.map((item, i) => (
          <a key={i} href={item.href} className="text-gray-700">{item.label}</a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {header.icons.search && <Search className="w-5 h-5 text-gray-600" />}
        {header.icons.cart && <ShoppingCart className="w-5 h-5 text-gray-600" />}
        {header.icons.account && <User className="w-5 h-5 text-gray-600" />}
      </div>
    </div>
  )
}

// HEADER EDITOR PAGE
export default function HeaderEditorPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [header, setHeader] = useState<HeaderData>({
    logo: "",
    showTitle: true,
    menu: [],
    icons: { search: true, cart: true, account: true },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // FETCH saved header from MongoDB
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch("/api/tenants/me")
        if (!res.ok) throw new Error("Failed to fetch tenant")
        const data = await res.json()
        setTenant(data.tenant)
        setHeader(data.tenant.header)
      } catch {
        setError("Failed to load header settings")
      } finally {
        setLoading(false)
      }
    }
    fetchTenant()
  }, [])

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...header.menu]
    newMenu[index] = { ...newMenu[index], [field]: value }
    setHeader({ ...header, menu: newMenu })
  }

  const addMenuItem = () => setHeader({ ...header, menu: [...header.menu, { label: "New Link", href: "/" }] })
  const removeMenuItem = (index: number) => setHeader({ ...header, menu: header.menu.filter((_, i) => i !== index) })
  const toggleIcon = (icon: keyof HeaderIcons) => setHeader({ ...header, icons: { ...header.icons, [icon]: !header.icons[icon] } })

  const saveHeader = async () => {
    setSaving(true); setError(""); setSuccess("")
    try {
      const res = await fetch("/api/tenants/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(header),
      })
      if (!res.ok) throw new Error("Save failed")
      setSuccess("Header updated successfully")
    } catch {
      setError("Failed to save header")
    } finally { setSaving(false) }
  }

  if (loading) return <p className="p-6">Loading...</p>

  const previewTenant = tenant ? { ...tenant, header } : null

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Header Settings</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EDITOR */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Logo URL</label>
            <input className="w-full border p-2" value={header.logo} onChange={e => setHeader({ ...header, logo: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={header.showTitle} onChange={() => setHeader({ ...header, showTitle: !header.showTitle })} />
            <span>Show Store Title</span>
          </div>
          <div className="flex items-center gap-4">
            <label><input type="checkbox" checked={header.icons.search} onChange={() => toggleIcon("search")} /> Search</label>
            <label><input type="checkbox" checked={header.icons.cart} onChange={() => toggleIcon("cart")} /> Cart</label>
            <label><input type="checkbox" checked={header.icons.account} onChange={() => toggleIcon("account")} /> Account</label>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Menu Links</h2>
            {header.menu.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className="border p-2 flex-1" value={item.label} onChange={e => updateMenuItem(i, "label", e.target.value)} />
                <input className="border p-2 flex-1" value={item.href} onChange={e => updateMenuItem(i, "href", e.target.value)} />
                <button onClick={() => removeMenuItem(i)} className="text-red-600">✕</button>
              </div>
            ))}
            <button onClick={addMenuItem} className="mt-2 text-blue-600">+ Add Menu Item</button>
          </div>
          <button onClick={saveHeader} disabled={saving} className="bg-blue-500 text-white px-6 py-2 rounded">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* LIVE PREVIEW */}
        <div className="border rounded overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 text-sm font-medium">Live Preview</div>
          {previewTenant && <Header tenant={previewTenant} />}
        </div>
      </div>
    </div>
  )
}
