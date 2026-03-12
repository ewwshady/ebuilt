"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Tenant } from "@/lib/schemas"
import { DomainSettings } from "@/components/domain-settings"
import { UploadImage } from "@/components/upload-image"
import { categoryThemes } from "@/lib/category-themes"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!loading && (!user || user.role !== "tenant_admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.tenantId) {
      fetchTenant()
    }
  }, [user])

  const fetchTenant = async () => {
    try {
      const response = await fetch(`/api/tenants/${user?.tenantId}`)
      if (response.ok) {
        const data = await response.json()
        setTenant(data.tenant)
      }
    } catch (error) {
      console.error("Fetch tenant error:", error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch(`/api/tenants/${user?.tenantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tenant?.name,
          description: tenant?.description,
          category: tenant?.category,
          theme: tenant?.theme,
          settings: tenant?.settings,
          paymentSettings: tenant?.paymentSettings,
        }),
      })

      if (response.ok) {
        setMessage("Settings saved successfully")
        fetchTenant()
      }
    } catch (error) {
      setMessage("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user || !tenant) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your store information and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <DomainSettings tenant={tenant} onUpdate={fetchTenant} />

        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic details about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" value={tenant.name} onChange={(e) => setTenant({ ...tenant, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Store Category</Label>
              <Select
                value={tenant.category || "general"}
                onValueChange={(value) => setTenant({ ...tenant, category: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryThemes).map(([key, theme]) => (
                    <SelectItem key={key} value={key}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose a category to customize your store's design theme</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input id="subdomain" value={tenant.subdomain} disabled />
              <p className="text-xs text-muted-foreground">Contact admin to change subdomain</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={tenant.description || ""}
                onChange={(e) => setTenant({ ...tenant, description: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Assets</CardTitle>
            <CardDescription>Upload your store logo and banner image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <UploadImage
              label="Store Logo"
              value={tenant.theme.logo}
              onChange={(url) => setTenant({ ...tenant, theme: { ...tenant.theme, logo: url } })}
              aspectRatio="aspect-square"
            />
            <UploadImage
              label="Banner Image"
              value={tenant.theme.banner}
              onChange={(url) => setTenant({ ...tenant, theme: { ...tenant.theme, banner: url } })}
              aspectRatio="aspect-[21/9]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme & Branding</CardTitle>
            <CardDescription>Customize your store's appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={tenant.theme.primaryColor}
                  onChange={(e) =>
                    setTenant({
                      ...tenant,
                      theme: { ...tenant.theme, primaryColor: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={tenant.theme.secondaryColor}
                  onChange={(e) =>
                    setTenant({
                      ...tenant,
                      theme: { ...tenant.theme, secondaryColor: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
            <CardDescription>Configure store behavior and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={tenant.settings.currency}
                  onChange={(e) =>
                    setTenant({
                      ...tenant,
                      settings: { ...tenant.settings, currency: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  value={tenant.settings.taxRate}
                  onChange={(e) =>
                    setTenant({
                      ...tenant,
                      settings: { ...tenant.settings, taxRate: Number.parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Enable or disable payment options for customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cash on Delivery (COD)</Label>
                <p className="text-xs text-muted-foreground">Accept cash payment on delivery</p>
              </div>
              <Switch
                checked={tenant.paymentSettings?.cod?.enabled || false}
                onCheckedChange={(checked) =>
                  setTenant({
                    ...tenant,
                    paymentSettings: {
                      ...tenant.paymentSettings,
                      cod: { ...tenant.paymentSettings?.cod, enabled: checked, label: "Cash on Delivery" },
                    },
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>eSewa</Label>
                  <p className="text-xs text-muted-foreground">Digital wallet payment</p>
                </div>
                <Switch
                  checked={tenant.paymentSettings?.esewa?.enabled || false}
                  onCheckedChange={(checked) =>
                    setTenant({
                      ...tenant,
                      paymentSettings: {
                        ...tenant.paymentSettings,
                        esewa: { ...tenant.paymentSettings?.esewa, enabled: checked },
                      },
                    })
                  }
                />
              </div>
              {tenant.paymentSettings?.esewa?.enabled && (
                <Input
                  placeholder="eSewa Merchant ID"
                  value={tenant.paymentSettings.esewa.merchantId || ""}
                  onChange={(e) =>
                    setTenant({
                      ...tenant,
                      paymentSettings: {
                        ...tenant.paymentSettings,
                        esewa: { ...tenant.paymentSettings.esewa, merchantId: e.target.value },
                      },
                    })
                  }
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Khalti</Label>
                  <p className="text-xs text-muted-foreground">Digital wallet payment</p>
                </div>
                <Switch
                  checked={tenant.paymentSettings?.khalti?.enabled || false}
                  onCheckedChange={(checked) =>
                    setTenant({
                      ...tenant,
                      paymentSettings: {
                        ...tenant.paymentSettings,
                        khalti: { ...tenant.paymentSettings?.khalti, enabled: checked },
                      },
                    })
                  }
                />
              </div>
              {tenant.paymentSettings?.khalti?.enabled && (
                <Input
                  placeholder="Khalti Public Key"
                  value={tenant.paymentSettings.khalti.publicKey || ""}
                  onChange={(e) =>
                    setTenant({
                      ...tenant,
                      paymentSettings: {
                        ...tenant.paymentSettings,
                        khalti: { ...tenant.paymentSettings.khalti, publicKey: e.target.value },
                      },
                    })
                  }
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stripe</Label>
                  <p className="text-xs text-muted-foreground">International card payments</p>
                </div>
                <Switch
                  checked={tenant.paymentSettings?.stripe?.enabled || false}
                  onCheckedChange={(checked) =>
                    setTenant({
                      ...tenant,
                      paymentSettings: {
                        ...tenant.paymentSettings,
                        stripe: { ...tenant.paymentSettings?.stripe, enabled: checked },
                      },
                    })
                  }
                />
              </div>
              {tenant.paymentSettings?.stripe?.enabled && (
                <Input
                  placeholder="Stripe Publishable Key"
                  value={tenant.paymentSettings.stripe.publishableKey || ""}
                  onChange={(e) =>
                    setTenant({
                      ...tenant,
                      paymentSettings: {
                        ...tenant.paymentSettings,
                        stripe: { ...tenant.paymentSettings.stripe, publishableKey: e.target.value },
                      },
                    })
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  )
}
