"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormCard } from "@/components/admin/FormCard"
import { toast } from "sonner"
import { Loader } from "lucide-react"

interface Settings {
  name: string
  description?: string
  currency: string
  taxRate: number
  enableReviews: boolean
  enableInventory: boolean
}

interface PaymentProvider {
  type: string
  enabled: boolean
  mode?: "test" | "live"
  config: any
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState<Settings>({
    name: "",
    description: "",
    currency: "NPR",
    taxRate: 0,
    enableReviews: true,
    enableInventory: true,
  })

  const [providers, setProviders] = useState<PaymentProvider[]>([
    { type: "stripe", enabled: false, mode: "test", config: {} },
    { type: "cod", enabled: false, config: { label: "Cash on Delivery" } },
    { type: "khalti", enabled: false, config: {} },
    {
      type: "esewa",
      enabled: false,
      mode: "test",
      config: { merchantId: "", secretKey: "", successUrl: "", failureUrl: "" },
    },
  ])

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res1 = await fetch("/api/tenants/settings")
        const data1 = await res1.json()

        setSettings({
          name: data1?.settings?.name || "",
          description: data1?.settings?.description || "",
          currency: data1?.settings?.currency || "NPR",
          taxRate: data1?.settings?.taxRate ?? 0,
          enableReviews: data1?.settings?.enableReviews ?? true,
          enableInventory: data1?.settings?.enableInventory ?? true,
        })

        const res2 = await fetch("/api/tenants/payment-settings")
        const data2 = await res2.json()

        if (Array.isArray(data2?.providers) && data2.providers.length > 0) {
          // Make sure each provider has required fields
          const safeProviders = data2.providers.map((p: PaymentProvider) => ({
            type: p.type,
            enabled: p.enabled ?? false,
            mode: p.mode || "test",
            config: p.config || {},
          }))
          setProviders(safeProviders)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
        toast.error("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // ---------------- GENERAL SETTINGS SAVE ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/tenants/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error("Failed to save settings")
      toast.success("Settings saved successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  // ---------------- PAYMENT SAVE ----------------
  const savePayments = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/tenants/payment-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providers }),
      })
      if (!res.ok) throw new Error("Failed to save payment settings")
      toast.success("Payment settings saved")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save payment settings")
    } finally {
      setSaving(false)
    }
  }

  const toggleProvider = (type: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.type === type ? { ...p, enabled: !p.enabled } : p))
    )
  }

  const updateConfig = (type: string, key: string, value: any) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.type === type
          ? { ...p, config: { ...(p.config || {}), [key]: value } }
          : p
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* ---------------- GENERAL SETTINGS ---------------- */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormCard title="Store Information">
          <div className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <Input
                value={settings?.name || ""}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={settings?.description || ""}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Currency & Tax">
          <div className="space-y-4">
            <div>
              <Label>Currency</Label>
              <Select
                value={settings?.currency || "NPR"}
                onValueChange={(value) => setSettings({ ...settings, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NPR">NPR</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="NPR">NPR</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                value={settings?.taxRate ?? 0}
                onChange={(e) =>
                  setSettings({ ...settings, taxRate: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>
        </FormCard>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>

      {/* ---------------- PAYMENT GATEWAYS ---------------- */}
      <FormCard title="Payment Gateways">
        <div className="space-y-6">
          {providers.map((provider) => (
            <div key={provider.type} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold uppercase">{provider.type}</h3>
                <input
                  type="checkbox"
                  checked={provider.enabled}
                  onChange={() => toggleProvider(provider.type)}
                />
              </div>

              {provider.enabled && provider.type === "stripe" && (
                <div className="mt-4 space-y-3">
                  <Select
                    value={provider.mode}
                    onValueChange={(value) =>
                      setProviders((prev) =>
                        prev.map((p) =>
                          p.type === "stripe" ? { ...p, mode: value as any } : p
                        )
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Publishable Key"
                    value={provider.config?.publishableKey || ""}
                    onChange={(e) => updateConfig("stripe", "publishableKey", e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Secret Key"
                    value={provider.config?.secretKey || ""}
                    onChange={(e) => updateConfig("stripe", "secretKey", e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Webhook Secret"
                    value={provider.config?.webhookSecret || ""}
                    onChange={(e) => updateConfig("stripe", "webhookSecret", e.target.value)}
                  />
                </div>
              )}

              {provider.enabled && provider.type === "esewa" && (
                <div className="mt-4 space-y-3">
                  <Input
                    placeholder="Merchant ID"
                    value={provider.config?.merchantId || ""}
                    onChange={(e) => updateConfig("esewa", "merchantId", e.target.value)}
                  />
                  <Input
                    placeholder="Secret Key"
                    type="password"
                    value={provider.config?.secretKey || ""}
                    onChange={(e) => updateConfig("esewa", "secretKey", e.target.value)}
                  />
                  <Input
                    placeholder="Success URL"
                    value={provider.config?.successUrl || ""}
                    onChange={(e) => updateConfig("esewa", "successUrl", e.target.value)}
                  />
                  <Input
                    placeholder="Failure URL"
                    value={provider.config?.failureUrl || ""}
                    onChange={(e) => updateConfig("esewa", "failureUrl", e.target.value)}
                  />
                </div>
              )}

              {provider.enabled && provider.type === "cod" && (
                <div className="mt-4">
                  <Input
                    placeholder="Label"
                    value={provider.config?.label || ""}
                    onChange={(e) => updateConfig("cod", "label", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}

          <Button onClick={savePayments} disabled={saving}>
            {saving ? "Saving..." : "Save Payment Settings"}
          </Button>
        </div>
      </FormCard>
    </div>
  )
}