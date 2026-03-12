"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Check } from "lucide-react"

interface Theme {
  key: string
  name: string
  category: string
  thumbnail?: string
  primaryColor: string
  secondaryColor: string
  accentColor?: string
  logo?: string
  banner?: string
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<string | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [applying, setApplying] = useState<string | null>(null)
  const [tenantLoaded, setTenantLoaded] = useState(false) 

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch("/api/themes")
        if (!response.ok) throw new Error("Failed to fetch themes")
        const data = await response.json()
        setThemes(data.themes)
      } catch (error) {
        console.error("Error fetching themes:", error)
        toast.error("Failed to load themes")
      } finally {
        setLoading(false)
      }
    }

    const getTenant = async () => {
      try {
        const response = await fetch("/api/storefront/tenant")
        if (response.ok) {
          const data = await response.json()
          setCurrentTheme(data.tenant?.themeKey || null)
          setTenantId(data.tenant?._id || null)
          setTenantLoaded(true) // ✅ mark tenant as loaded
        } else {
          toast.error("Failed to load tenant data")
        }
      } catch (error) {
        console.error("Error fetching tenant:", error)
        toast.error("Failed to load tenant")
      }
    }

    fetchThemes()
    getTenant()
  }, [])

  const handleApplyTheme = async (themeKey: string) => {
    if (!tenantLoaded || !tenantId) {
      return toast.error("Tenant not loaded yet")
    }

    setApplying(themeKey)
    try {
      const response = await fetch("/api/themes/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, themeKey }),
      })

      if (!response.ok) throw new Error("Failed to apply theme")

      setCurrentTheme(themeKey)
      toast.success("Theme applied successfully")
    } catch (error) {
      console.error("Error applying theme:", error)
      toast.error("Failed to apply theme")
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Themes</h1>
        <p className="text-gray-600 mt-1">Choose and customize your store theme</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 mt-4">Loading themes...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card key={theme.key} className="shadow-sm border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {theme.thumbnail && (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <img
                    src={theme.thumbnail}
                    alt={theme.name}
                    className="max-w-full max-h-full object-cover"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{theme.name}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{theme.category}</p>
                  </div>
                  {currentTheme === theme.key && (
                    <div className="bg-green-100 rounded-full p-2">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Colors</label>
                  <div className="flex gap-2">
                    <div
                      className="flex-1 h-10 rounded border border-gray-200"
                      style={{ backgroundColor: theme.primaryColor }}
                      title={`Primary: ${theme.primaryColor}`}
                    />
                    <div
                      className="flex-1 h-10 rounded border border-gray-200"
                      style={{ backgroundColor: theme.secondaryColor }}
                      title={`Secondary: ${theme.secondaryColor}`}
                    />
                    {theme.accentColor && (
                      <div
                        className="flex-1 h-10 rounded border border-gray-200"
                        style={{ backgroundColor: theme.accentColor }}
                        title={`Accent: ${theme.accentColor}`}
                      />
                    )}
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant={currentTheme === theme.key ? "outline" : "default"}
                  onClick={() => handleApplyTheme(theme.key)}
                  disabled={!tenantLoaded || applying !== null || currentTheme === theme.key}
                >
                  {applying === theme.key ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : currentTheme === theme.key ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Active
                    </>
                  ) : (
                    "Apply Theme"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}