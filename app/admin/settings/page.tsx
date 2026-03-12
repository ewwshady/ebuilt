"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Lock, Globe, DollarSign } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Beauty Store",
    storeEmail: "store@example.com",
    phone: "+977 9800000000",
    description: "Premium beauty and skincare products",
    currency: "NPR",
    taxRate: "13",
    shippingCost: "100",
    freeShippingThreshold: "1000",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    cod: true,
    esewa: false,
    khalti: false,
    stripe: false,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handlePaymentChange = (method: string) => {
    setPaymentSettings(prev => ({
      ...prev,
      [method]: !prev[method as keyof typeof paymentSettings],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert("Settings saved successfully!")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your store settings</p>
      </div>

      {/* Store Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="text-blue-400" size={20} />
            <div>
              <CardTitle className="text-white">Store Information</CardTitle>
              <CardDescription>Basic store details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-200">Store Name</Label>
            <Input
              value={settings.storeName}
              onChange={e => handleSettingChange("storeName", e.target.value)}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200">Store Email</Label>
            <Input
              type="email"
              value={settings.storeEmail}
              onChange={e => handleSettingChange("storeEmail", e.target.value)}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200">Phone Number</Label>
            <Input
              value={settings.phone}
              onChange={e => handleSettingChange("phone", e.target.value)}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200">Store Description</Label>
            <Textarea
              value={settings.description}
              onChange={e => handleSettingChange("description", e.target.value)}
              className="mt-2 bg-slate-800 border-slate-700 text-white"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Currency & Pricing */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-400" size={20} />
            <div>
              <CardTitle className="text-white">Currency & Pricing</CardTitle>
              <CardDescription>Tax and shipping settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-200">Currency</Label>
              <select
                value={settings.currency}
                onChange={e => handleSettingChange("currency", e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option>NPR</option>
                <option>USD</option>
                <option>INR</option>
              </select>
            </div>

            <div>
              <Label className="text-slate-200">Tax Rate (%)</Label>
              <Input
                type="number"
                value={settings.taxRate}
                onChange={e => handleSettingChange("taxRate", e.target.value)}
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-200">Shipping Cost</Label>
              <Input
                type="number"
                value={settings.shippingCost}
                onChange={e => handleSettingChange("shippingCost", e.target.value)}
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-200">Free Shipping Threshold</Label>
              <Input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={e => handleSettingChange("freeShippingThreshold", e.target.value)}
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="text-yellow-400" size={20} />
            <div>
              <CardTitle className="text-white">Payment Methods</CardTitle>
              <CardDescription>Enable or disable payment options</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { key: "cod", label: "Cash on Delivery", desc: "Customer pays at delivery" },
              { key: "esewa", label: "eSewa", desc: "Online payment gateway" },
              { key: "khalti", label: "Khalti", desc: "Mobile wallet" },
              { key: "stripe", label: "Stripe", desc: "International card payments" },
            ].map(method => (
              <label
                key={method.key}
                className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg hover:bg-slate-800/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={paymentSettings[method.key as keyof typeof paymentSettings]}
                  onChange={() => handlePaymentChange(method.key)}
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{method.label}</p>
                  <p className="text-xs text-slate-400">{method.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 gap-2 px-6 h-11"
        >
          {isSaving ? (
            <>
              <span className="animate-spin inline-block">⟳</span>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
