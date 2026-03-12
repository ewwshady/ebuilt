import type { Tenant } from "@/lib/schemas"

export const defaultHeader: Tenant["header"] = {
  showTitle: true,
  logo: undefined,

  menu: [
    { label: "Shop", href: "/products" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ],

  icons: {
    search: true,
    wishlist: true,
    account: true,
    cart: true
  }
}
