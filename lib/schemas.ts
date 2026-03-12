import type { ObjectId } from "mongodb"


export interface User {
  _id?: ObjectId
  email: string
  password: string
  name?: string
  role: "super_admin" | "tenant_admin" | "customer"
  tenantId?: ObjectId | null
  
  status: "active" | "disabled" | "guest" // Added
  acceptsMarketing: boolean // Added
  
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  profile?: {
    phone?: string
    avatar?: string
    addresses: { // Changed from single object to Array
      id: string
      type: "shipping" | "billing" | "both"
      isDefault: boolean
      street: string
      city: string
      state: string
      zip: string
      country: string
    }[]
  }
}











export interface Tenant {
  _id?: string; // Changed to string
  subdomain: string
  name: string
  description?: string
  logo?: string
  banner?: string
  category?: "beauty" | "electronics" | "pharmacy" | "clothes" | "books" | "general"
  status: "active" | "inactive" | "suspended"
  plan: "basic" | "premium" | "enterprise"
  ownerId: string; // Changed to string
   contact?: {
    address?: string;
    phone?: string;
    email?: string; // could duplicate user email or be separate
  };
  customDomain?: string
  customDomainVerified: boolean
  customDomainVerificationToken?: string
  theme: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    banner?: string
    favicon?: string
  }
 
  settings: {
    currency: string
    taxRate: number
    enableReviews: boolean
    enableInventory: boolean
  }

  paymentSettings?: {
    providers: PaymentProvider[]
  }
  
  createdAt: string; // Changed to ISO string
  updatedAt: string; // Changed to ISO string

  
  header?: {
    logo?: string
    showTitle: boolean
    menu: {
      label: string
      href: string
      openInNewTab?: boolean
    }[]
    icons: {
      search: boolean
      wishlist: boolean
      account: boolean
      cart: boolean
    }
  }

  
}



export interface PaymentProvider {
  type: "cod" | "stripe" | "khalti" | "esewa"
  enabled: boolean
  mode?: "test" | "live"
  config: Record<string, any>
}










export interface Product {
  _id?: ObjectId
  tenantId: ObjectId
  name: string
  slug: string // Ensure this is indexed in DB
  description: string
  
  // Basic Pricing
  price: number
  compareAtPrice?: number
  costPrice?: number // For profit analytics
  
  // Media
  images: {
    url: string
    alt?: string
  }[]
  
  // Organization
  category: string // Main category
  collections: ObjectId[] // Multi-collection support
  tags: string[]
  vendor?: string
  
  // Physical/Shipping
  isPhysical: boolean
  weight?: number
  weightUnit?: "kg" | "g" | "lb" | "oz"
  
  // Inventory (If no variants)
  inventory: {
    sku: string
    quantity: number
    trackInventory: boolean
    lowStockThreshold?: number // Useful for dashboard alerts
  }

  // OPTIONAL: Simple Variants Support
  // options: { name: string, values: string[] }[] // e.g. { name: "Size", values: ["S", "M"] }
  // variants: Variant[] 

  seo: {
    title?: string
    description?: string
    keywords?: string[]
  }
  
  status: "draft" | "active" | "archived"
  isTaxable: boolean
  createdAt: Date
  updatedAt: Date
}














// Order Schema
export interface Order {
  _id?: ObjectId
  tenantId: ObjectId
  orderNumber: string
  customerId: ObjectId
  customerEmail: string
  customerPhone: string  
  items: {
    productId: ObjectId
    name: string
    price: number
    quantity: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  shippingAddress: {
    name: string
    phone: string   
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

// Review Schema
export interface Review {
  _id?: ObjectId
  tenantId: ObjectId
  productId: ObjectId
  customerId: ObjectId
  customerName: string
  customerEmail: string
  rating: number
  title: string
  comment: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

// Cart Schema
export interface Cart {
  _id?: ObjectId
  userId: ObjectId
  tenantId: ObjectId
  items: {
    productId: ObjectId
    name: string
    price: number
    quantity: number
  }[]
  createdAt: Date
  updatedAt: Date
}