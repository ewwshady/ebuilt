"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type Theme = {
  key: string
  name: string
  category: string
  thumbnail: string | null
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [tenantId, setTenantId] = useState<string>("")
  const [selectedTheme, setSelectedTheme] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch themes
        const resThemes = await fetch("/api/themes")
        const dataThemes = await resThemes.json()
        setThemes(dataThemes.themes || [])

        // Fetch logged-in user
        const resMe = await fetch("/api/auth/me")
        if (!resMe.ok) throw new Error("Failed to fetch user")
        const dataMe = await resMe.json()
        const userTenantId = dataMe.user?.tenantId
        if (!userTenantId) {
          setError("Unable to determine tenantId")
          return
        }
        setTenantId(userTenantId)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Failed to load data")
      }
    }

    fetchData()
  }, [])

  const handleApplyTheme = async () => {
    if (!selectedTheme || !tenantId) {
      setError("Select a theme first")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/tenants/apply-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, themeKey: selectedTheme }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to apply theme")
      } else {
        setSuccess("Theme applied successfully!")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Available Themes</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.key}
            className={`border rounded p-4 cursor-pointer hover:shadow-lg transition ${
              selectedTheme === theme.key ? "border-blue-500" : "border-gray-200"
            }`}
            onClick={() => setSelectedTheme(theme.key)}
          >
            {theme.thumbnail ? (
              <div className="w-full h-32 relative mb-2">
                <Image src={theme.thumbnail} alt={theme.name} fill className="object-cover rounded" />
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <p className="font-semibold text-center">{theme.name}</p>
            <p className="text-sm text-center text-gray-500">{theme.category}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleApplyTheme}
          disabled={loading || !selectedTheme}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Applying..." : "Apply Theme"}
        </button>
      </div>
    </div>
  )
}