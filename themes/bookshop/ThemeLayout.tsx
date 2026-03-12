"use client";

import { ReactNode } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import type { Tenant } from "@/lib/schemas";

interface ThemeLayoutProps {
  children: ReactNode;
  tenant: Tenant;
}

export function ThemeLayout({ children, tenant }: ThemeLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header tenant={tenant} />
      <main className="flex-1">
        {children}
      </main>
      <Footer tenant={tenant} />
    </div>
  );
}
