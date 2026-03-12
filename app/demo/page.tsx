"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Store, Settings, BarChart3, Package } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">eBuild Ecommerce Platform</h1>
          <p className="text-slate-600 mt-2">Professional SaaS platform for multi-tenant ecommerce</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Storefront Section */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Store className="text-blue-600" size={28} />
                <CardTitle className="text-2xl">Beauty Store Demo</CardTitle>
              </div>
              <CardDescription>
                Experience the customer-facing storefront with product listings, cart, and checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Features included:
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Product catalog with search and filtering</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Shopping cart with quantity management</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Multi-step checkout with shipping/payment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Responsive design with mobile support</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Professional UI with shadcn components</span>
                </li>
              </ul>

              <div className="pt-4 space-y-2">
                <Link href="/storefront" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2 h-11">
                    <Store size={18} />
                    Visit Storefront
                    <ArrowRight size={18} className="ml-auto" />
                  </Button>
                </Link>
                <Link href="/storefront/products" className="block">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600">
                    View Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin Section */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="text-purple-600" size={28} />
                <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              </div>
              <CardDescription>
                Manage products, orders, analytics, and store settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Features included:
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Product management with inventory</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Order tracking and management</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Analytics dashboard with revenue metrics</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Theme customization</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">✓</span>
                  <span>Store settings and payment methods</span>
                </li>
              </ul>

              <div className="pt-4 space-y-2">
                <Link href="/admin" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 gap-2 h-11">
                    <Settings size={18} />
                    Go to Admin
                    <ArrowRight size={18} className="ml-auto" />
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/admin/orders" className="block">
                    <Button variant="outline" className="w-full border-purple-200 text-purple-600 text-sm">
                      <Package size={16} className="mr-1" /> Orders
                    </Button>
                  </Link>
                  <Link href="/admin/analytics" className="block">
                    <Button variant="outline" className="w-full border-purple-200 text-purple-600 text-sm">
                      <BarChart3 size={16} className="mr-1" /> Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Platform Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-slate-700 font-semibold">Responsive</p>
                <p className="text-sm text-slate-600 mt-2">Works on all devices and screen sizes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">Multi</div>
                <p className="text-slate-700 font-semibold">Tenant Ready</p>
                <p className="text-sm text-slate-600 mt-2">Support for multiple stores with subdomain routing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <p className="text-slate-700 font-semibold">Components</p>
                <p className="text-sm text-slate-600 mt-2">Built with shadcn/ui for professional design</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-12 bg-white rounded-lg border p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Start</h3>
          <div className="space-y-3 text-slate-700">
            <p>
              <strong>Storefront:</strong> Start at the home page to see featured products, browse the catalog, add items to cart, and complete a mock checkout.
            </p>
            <p>
              <strong>Admin:</strong> Access the admin dashboard to manage products, view orders, check analytics, customize themes, and configure store settings.
            </p>
            <p>
              <strong>Database:</strong> All data operations are ready to be connected to your MongoDB instance for persistent storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
