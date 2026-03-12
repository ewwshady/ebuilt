"use client"

import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminHeaderProps {
  userName?: string
  userEmail?: string
}

export function AdminHeader({ userName = "Admin", userEmail = "admin@example.com" }: AdminHeaderProps) {
  const handleLogout = async () => {
    try {
      await fetch("/api/tenants/auth/logout", { method: "POST" })
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="hidden lg:block bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-semibold">{userName}</span>
              <span className="text-xs text-muted-foreground">{userEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
