"use client"

import { useState, useEffect } from "react"
import { FormCard } from "@/components/admin/FormCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, Save } from "lucide-react"

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user)
        } else {
          toast.error(data.error || "Failed to load profile")
        }
      } catch (error) {
        console.error("Profile fetch error:", error)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Save all changes
  const handleUpdate = async () => {
    if (!user) return
    setSaving(true)

    try {
      const payload = {
        name: user.name,
        profile: {
          phone: user.profile?.phone || "",
          addresses: user.profile?.addresses || []
        }
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        if (data.user) setUser(data.user)
        toast.success("Profile updated successfully")
      } else {
        toast.error(data.error || "Update failed")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error saving changes")
    } finally {
      setSaving(false)
    }
  }

  const updateAddress = (id: string, field: string, value: string) => {
    if (!user?.profile?.addresses) return

    const updated = user.profile.addresses.map((a: any) =>
      a.id === id ? { ...a, [field]: value } : a
    )

    setUser({
      ...user,
      profile: { ...user.profile, addresses: updated }
    })
  }

  const addAddress = () => {
    const newAddr = {
      id: Math.random().toString(36).substr(2, 9),
      type: "shipping" as const,
      isDefault: (user?.profile?.addresses?.length || 0) === 0,
      street: "",
      city: "",
      state: "",
      zip: "",
      country: ""
    }

    setUser({
      ...user,
      profile: {
        ...user?.profile,
        addresses: [...(user?.profile?.addresses || []), newAddr]
      }
    })
  }

  const deleteAddress = (id: string) => {
    const current = user?.profile?.addresses || []
    const filtered = current.filter((a: any) => a.id !== id)

    setUser({
      ...user,
      profile: {
        ...(user.profile || {}),
        addresses: filtered
      }
    })
  }

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Top Save Button (optional - you can remove if you only want bottom button) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500">Manage your information and addresses.</p>
        </div>
        <Button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-gray-900 text-white rounded-full px-8 hidden md:flex"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Personal Information */}
      <FormCard title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={user?.name ?? ""}
              onChange={e => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input value={user?.email ?? ""} disabled className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={user?.profile?.phone ?? ""}
              onChange={e =>
                setUser({
                  ...user,
                  profile: { ...(user.profile || {}), phone: e.target.value }
                })
              }
            />
          </div>
        </div>
      </FormCard>

      {/* Saved Addresses - EXACTLY MATCHING YOUR SCREENSHOT */}
      <FormCard title="Saved Addresses">
        <div className="space-y-6">
          {(user?.profile?.addresses || []).map((addr: any) => (
            <div key={addr.id} className="p-6 border rounded-xl bg-white relative group shadow-sm">
              <div className="space-y-6">
                {/* Street Address - Full width */}
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input
                    value={addr?.street ?? ""}
                    onChange={e => updateAddress(addr.id, "street", e.target.value)}
                  />
                </div>

                {/* Row 1: City + State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={addr?.city ?? ""}
                      onChange={e => updateAddress(addr.id, "city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={addr?.state ?? ""}
                      onChange={e => updateAddress(addr.id, "state", e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 2: Zip Code + Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Zip Code</Label>
                    <Input
                      value={addr?.zip ?? ""}
                      onChange={e => updateAddress(addr.id, "zip", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={addr?.country ?? ""}
                      onChange={e => updateAddress(addr.id, "country", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                onClick={() => deleteAddress(addr.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Add New Address - exactly like screenshot */}
          <Button
            variant="outline"
            className="w-full border-dashed py-8"
            onClick={addAddress}
          >
            + Add New Address
          </Button>
        </div>
      </FormCard>

      {/* Bottom Save Button - matches your screenshot position & text */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-gray-900 hover:bg-black text-white rounded-full px-10 py-6 text-base"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin mr-3" />
          ) : (
            <Save className="h-5 w-5 mr-3" />
          )}
          Save All Changes
        </Button>
      </div>
    </div>
  )
}