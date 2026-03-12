"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface UploadImageProps {
  label: string
  value?: string
  onChange: (url: string) => void
  aspectRatio?: string
}

export function UploadImage({ label, value, onChange, aspectRatio = "aspect-square" }: UploadImageProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(value || "")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For prototype, we'll use a placeholder or base64
    // In production, upload to Vercel Blob or cloud storage
    setUploading(true)

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      onChange(result)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onChange("")
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {previewUrl ? (
        <div className="relative">
          <div className={`relative ${aspectRatio} w-full max-w-xs overflow-hidden rounded-lg border`}>
            <Image src={previewUrl || "/placeholder.svg"} alt={label} fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`relative ${aspectRatio} w-full max-w-xs border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50`}
        >
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Upload Image</span>
            <Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
        </div>
      )}
      {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
    </div>
  )
}
