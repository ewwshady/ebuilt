import { ReactNode } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { Tenant } from "@/lib/schemas";

interface MainLayoutProps {
  children: ReactNode;
  tenant: Tenant;
  className?: string;
}

export function MainLayout({ children, tenant, className = "" }: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <Header tenant={tenant} />
      <main className="flex-1">{children}</main>
      <Footer tenant={tenant} />
    </div>
  );
}