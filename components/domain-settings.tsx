"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react"
import type { Tenant } from "@/lib/schemas"

interface DomainSettingsProps {
  tenant: Tenant
  onUpdate: () => void
}

export function DomainSettings({ tenant, onUpdate }: DomainSettingsProps) {
  const [customDomain, setCustomDomain] = useState(tenant.customDomain || "")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [message, setMessage] = useState("")
  const [verificationToken, setVerificationToken] = useState(tenant.customDomainVerificationToken || "")

  useEffect(() => {
    setCustomDomain(tenant.customDomain || "")
    setVerificationToken(tenant.customDomainVerificationToken || "")
  }, [tenant])

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customDomain }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Domain added! Please configure DNS records to verify.")
        setVerificationToken(data.verificationToken)
        onUpdate()
      } else {
        setMessage(data.error || "Failed to add domain")
      }
    } catch (error) {
      setMessage("Failed to add domain")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyDomain = async () => {
    setVerifying(true)
    setMessage("")

    try {
      const response = await fetch("/api/domains/verify", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        if (data.verified) {
          setMessage("Domain verified successfully!")
          onUpdate()
        } else {
          setMessage(data.message || "Verification failed")
        }
      } else {
        setMessage(data.error || "Verification failed")
      }
    } catch (error) {
      setMessage("Failed to verify domain")
    } finally {
      setVerifying(false)
    }
  }

  const handleRemoveDomain = async () => {
    if (!confirm("Are you sure you want to remove this custom domain?")) return

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/domains", {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage("Domain removed successfully")
        setCustomDomain("")
        setVerificationToken("")
        onUpdate()
      } else {
        setMessage("Failed to remove domain")
      }
    } catch (error) {
      setMessage("Failed to remove domain")
    } finally {
      setLoading(false)
    }
  }

  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "yourdomain.com"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domain</CardTitle>
        <CardDescription>Use your own domain name for your storefront</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label>Current Subdomain</Label>
          <div className="flex items-center gap-2">
            <Input value={`${tenant.subdomain}.${platformDomain}`} disabled />
            <a
              href={`http://${tenant.subdomain}.${platformDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <Button type="button" variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {!tenant.customDomain ? (
          <form onSubmit={handleAddDomain} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customDomain">Custom Domain</Label>
              <Input
                id="customDomain"
                placeholder="www.yourstore.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Enter your custom domain (e.g., www.yourstore.com)</p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Custom Domain"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Custom Domain</Label>
              <div className="flex items-center gap-2">
                <Input value={tenant.customDomain} disabled />
                {tenant.customDomainVerified ? (
                  <Badge className="bg-green-500 flex-shrink-0">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex-shrink-0">
                    <XCircle className="mr-1 h-3 w-3" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>

            {!tenant.customDomainVerified && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">DNS Configuration Required</p>
                <p className="text-xs text-muted-foreground">Add the following DNS records to your domain provider:</p>

                <div className="space-y-2 text-xs">
                  <div className="bg-background p-3 rounded border">
                    <div className="font-mono">
                      <div>
                        Type: <strong>A</strong>
                      </div>
                      <div>
                        Name: <strong>@</strong> (or your domain)
                      </div>
                      <div>
                        Value: <strong>76.76.21.21</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background p-3 rounded border">
                    <div className="font-mono">
                      <div>
                        Type: <strong>TXT</strong>
                      </div>
                      <div>
                        Name: <strong>_vercel-challenge</strong>
                      </div>
                      <div>
                        Value: <strong className="break-all">{verificationToken}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  DNS changes may take up to 48 hours to propagate. Click verify once DNS records are added.
                </p>

                <Button onClick={handleVerifyDomain} disabled={verifying} size="sm">
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Domain"
                  )}
                </Button>
              </div>
            )}

            <Button onClick={handleRemoveDomain} variant="destructive" disabled={loading}>
              Remove Custom Domain
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
