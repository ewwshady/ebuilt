import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storefront",
  description: "Multi-tenant storefront",
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
