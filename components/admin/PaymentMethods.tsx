"use client"

import { useState, useEffect } from "react"
import { FormCard } from "@/components/admin/FormCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"   // ← shadcn Switch (recommended)
import { toast } from "sonner"
import { CreditCard, Truck, Wallet, Globe } from "lucide-react"

interface PaymentSettings {
  cod: { enabled: boolean; label: string }
  esewa: { enabled: boolean; merchantId?: string }
  khalti: { enabled: boolean; publicKey?: string }
  stripe: { enabled: boolean; publishableKey?: string }
}

export default function PaymentMethods() {
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    cod: { enabled: true, label: "Cash on Delivery" },
    esewa: { enabled: false, merchantId: "" },
    khalti: { enabled: false, publicKey: "" },
    stripe: { enabled: false, publishableKey: "" },
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/tenants/settings")
      .then(res => res.json())
      .then(data => {
        if (data.paymentSettings) setPaymentSettings(data.paymentSettings)
        setLoading(false)
      })
      .catch(() => {
        toast.error("Failed to load payment settings")
        setLoading(false)
      })
  }, [])

  const updateGateway = (gateway: keyof PaymentSettings, field: string, value: any) => {
    setPaymentSettings(prev => ({
      ...prev,
      [gateway]: { ...prev[gateway], [field]: value }
    }))
  }

  const toggleGateway = (gateway: keyof PaymentSettings) => {
    setPaymentSettings(prev => ({
      ...prev,
      [gateway]: { ...prev[gateway], enabled: !prev[gateway].enabled }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/tenants/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentSettings }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("Payment methods updated successfully!")
      } else {
        toast.error(data.error || "Failed to save")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-12 text-center">Loading payment settings...</div>

  const gateways = [
    {
      key: "cod" as const,
      name: "Cash on Delivery",
      icon: Truck,
      color: "emerald",
      fields: [{ name: "label", label: "Display Label", placeholder: "Cash on Delivery" }]
    },
    {
      key: "esewa" as const,
      name: "eSewa",
      icon: Wallet,
      color: "blue",
      fields: [{ name: "merchantId", label: "Merchant ID", placeholder: "epay_test_..." }]
    },
    {
      key: "khalti" as const,
      name: "Khalti",
      icon: CreditCard,
      color: "purple",
      fields: [{ name: "publicKey", label: "Public Key", placeholder: "test_public_key_..." }]
    },
    {
      key: "stripe" as const,
      name: "Stripe",
      icon: Globe,
      color: "indigo",
      fields: [{ name: "publishableKey", label: "Publishable Key", placeholder: "pk_test_..." }]
    },
  ]

  return (
    <FormCard title="Payment Methods" description="Enable and configure payment gateways for your store">
      <div className="space-y-6">
        {gateways.map(({ key, name, icon: Icon, color, fields }) => {
          const data = paymentSettings[key]
          return (
            <div key={key} className="border rounded-2xl p-6 hover:border-gray-300 transition-all">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 text-${color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{name}</h3>
                    <p className="text-sm text-gray-500">Nepal’s most popular payment options</p>
                  </div>
                </div>

                <Switch
                  checked={data.enabled}
                  onCheckedChange={() => toggleGateway(key)}
                />
              </div>

              {data.enabled && (
                <div className="space-y-4 pt-4 border-t">
                  {fields.map(field => (
                    <div key={field.name}>
                      <Label>{field.label}</Label>
                      <Input
                        placeholder={field.placeholder}
                        value={(data as any)[field.name] || ""}
                        onChange={e => updateGateway(key, field.name, e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  ))}
                </div>
              )}

              {!data.enabled && (
                <p className="text-sm text-gray-400 italic pl-14">Enable to configure keys</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 px-10"
        >
          {saving ? "Saving..." : "Save Payment Settings"}
        </Button>
      </div>
    </FormCard>
  )
}