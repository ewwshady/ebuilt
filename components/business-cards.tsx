"use client"

import { useEffect, useState } from "react"

interface Category {
  title: string
  image: string
}

export default function BusinessCards() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/system-configs")
        const data = await res.json()
        // Find the tenant_categories config
        const categoryConfig = data.find((c: any) => c.key === "tenant_categories")
        if (categoryConfig && Array.isArray(categoryConfig.values)) {
          const mapped = categoryConfig.values.map((cat: any) => ({
            title: cat.label,
            image: cat.image || `/placeholder.svg?query=${cat.label.toLowerCase()}`, // fallback if image missing
          }))
          setCategories(mapped)
        }
      } catch (err) {
        console.error("Failed to fetch categories", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <p className="text-center py-10">Loading categories...</p>

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              eBuilt
            </span>{" "}
            works for every business
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No matter what industry you're in, our platform adapts to your needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-xl font-semibold">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
