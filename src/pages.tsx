"use client"

import { useState } from "react"
import { BeautyStoreTheme } from "@/themes/beauty-store"
import { BeautyTestTheme } from "@/themes/beauty-test"
import { FashionStoreTheme } from "@/themes/fashion-store"
import { BooksStoreTheme } from "@/themes/books-store"
import { GeneralStoreTheme } from "@/themes/beauty-test"

const themes = {
  "beauty-store": BeautyStoreTheme,
  "beauty-test": BeautyTestTheme,
  "fashion-store": FashionStoreTheme,
  "books-store": BooksStoreTheme,
  "beauty-test": GeneralStoreTheme,
}

type ThemeKey = keyof typeof themes
type PageKey = "Home" | "ProductList" | "ProductDetail" | "Cart" | "Checkout"

export default function ThemePreview() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("beauty-store")
  const [selectedPage, setSelectedPage] = useState<PageKey>("Home")

  const CurrentTheme = themes[selectedTheme]
  const CurrentPage = CurrentTheme.components[selectedPage]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Theme Selector */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Ecommerce Theme System</h1>
              <p className="text-gray-600">Select a theme and page to preview</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {Object.keys(themes).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setSelectedTheme(themeKey as ThemeKey)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTheme === themeKey
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {themeKey
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {(["Home", "ProductList", "ProductDetail", "Cart", "Checkout"] as PageKey[]).map((page) => (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    selectedPage === page
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page.replace(/([A-Z])/g, " $1").trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Preview */}
      <div className="bg-white">
        <CurrentPage />
      </div>
    </div>
  )
}
