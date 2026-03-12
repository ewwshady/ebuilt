"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Truck, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function StorefrontHome() {
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Lipstick",
      price: 599,
      image: "https://images.unsplash.com/photo-1607638924702-92f191c48520?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 124,
      category: "Makeup",
    },
    {
      id: 2,
      name: "Face Serum",
      price: 1299,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 89,
      category: "Skincare",
    },
    {
      id: 3,
      name: "Eye Cream",
      price: 899,
      image: "https://images.unsplash.com/photo-1512207736139-6c3ee1990d4b?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 156,
      category: "Skincare",
    },
    {
      id: 4,
      name: "Face Cleanser",
      price: 449,
      image: "https://images.unsplash.com/photo-1533579774546-a7f8e6590b75?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 201,
      category: "Skincare",
    },
  ]

  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over Rs. 1000" },
    { icon: Shield, title: "Secure Payment", description: "100% safe transactions" },
    { icon: Zap, title: "Fast Delivery", description: "Same day delivery available" },
  ]

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">Premium Beauty Products</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover our curated collection of high-quality beauty and skincare products
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-12 text-base">
                  Shop Now
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 h-12 text-base">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="text-blue-600" size={32} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Products</h2>
          <p className="text-slate-600 text-lg">Check out our best sellers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition overflow-hidden">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Sale
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-600">({product.reviews})</span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-lg font-bold text-slate-900">Rs. {product.price}</span>
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-9">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/products">
            <Button variant="outline" className="px-8 py-3 h-11 text-base">
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Special Offer!</h2>
          <p className="text-xl mb-8 text-blue-100">
            Get 20% off on your first purchase with code WELCOME20
          </p>
          <Link href="/products">
            <Button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 h-11 text-base font-semibold">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
