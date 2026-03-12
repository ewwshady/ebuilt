"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Settings } from "lucide-react"

export default function ThemesPage() {
  const [activeTheme, setActiveTheme] = useState("beauty-test")
  const [primaryColor, setPrimaryColor] = useState("#ec4899")
  const [secondaryColor, setSecondaryColor] = useState("#ffffff")
  const [accentColor, setAccentColor] = useState("#F472B6")

  const themes = [
    {
      id: "beauty-test",
      name: "Beauty Pro",
      description: "Premium beauty and cosmetics theme",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=200&fit=crop",
      category: "beauty",
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      description: "Minimalist design for any store",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=200&fit=crop",
      category: "general",
    },
    {
      id: "modern",
      name: "Modern Wave",
      description: "Contemporary design with smooth animations",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
      category: "general",
    },
    {
      id: "luxury",
      name: "Luxury Edition",
      description: "Elegant and sophisticated theme",
      image: "https://images.unsplash.com/photo-1533062407987-c3e73914e3a6?w=300&h=200&fit=crop",
      category: "luxury",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Themes</h1>
        <p className="text-slate-400 mt-1">Customize your store appearance</p>
      </div>

      {/* Color Customization */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Theme Colors</CardTitle>
          <CardDescription>Customize your store's color scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-200">Primary Color</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-slate-400">Main brand color</p>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-200">Secondary Color</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-slate-400">Background & accents</p>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-200">Accent Color</Label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <Input
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-slate-400">Highlights & buttons</p>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">Save Color Scheme</Button>
        </CardContent>
      </Card>

      {/* Available Themes */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Available Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map(theme => (
            <Card
              key={theme.id}
              className={`border-2 transition cursor-pointer ${
                activeTheme === theme.id
                  ? "bg-slate-800 border-blue-500"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
              onClick={() => setActiveTheme(theme.id)}
            >
              <CardContent className="p-0">
                <div className="relative h-32 overflow-hidden bg-slate-800 rounded-t-lg">
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                  {activeTheme === theme.id && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <Check className="text-blue-400" size={32} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{theme.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{theme.description}</p>
                  <Button
                    variant={activeTheme === theme.id ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${
                      activeTheme === theme.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {activeTheme === theme.id ? "Active" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="text-purple-400" size={20} />
            <div>
              <CardTitle className="text-white">Theme Settings</CardTitle>
              <CardDescription>Configure active theme options</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-200">Logo URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/logo.png"
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-200">Favicon URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/favicon.ico"
                className="mt-2 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-200">Header Text</Label>
            <Input
              defaultValue="Welcome to our store"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label className="text-slate-200">Footer Text</Label>
            <Input
              defaultValue="Copyright 2024 - All rights reserved"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg hover:bg-slate-800/50 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-white">Show search bar</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg hover:bg-slate-800/50 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-white">Show customer reviews</span>
            </label>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
            Save Theme Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
