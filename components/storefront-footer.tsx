import type { Tenant } from "@/lib/schemas"

interface StorefrontFooterProps {
  tenant: Tenant
}

export function StorefrontFooter({ tenant }: StorefrontFooterProps) {
  const name = tenant.themeOverrides?.name || tenant.name
  const description = tenant.themeOverrides?.description || tenant.description

  const footerLinks = tenant.themeOverrides?.footerLinks || {
    shop: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "New Arrivals", href: "/new-arrivals" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  }

  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">{name}</h3>
            <p className="text-sm text-muted-foreground">{description || "Your trusted online store"}</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
