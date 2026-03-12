"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/use-auth"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { Search, Bell } from "lucide-react"
import { Button } from "../ui/button"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-[#1A1A1A]/80 px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* LEFT: Page Identity */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400">
            Monitor and manage your store performance
          </p>
        </div>

        {/* CENTER: Search */}
        <div className="flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search products, orders, customers..."
              className="w-full rounded-md border-neutral-700 bg-neutral-800/50 pl-9 text-neutral-300 placeholder:text-neutral-500 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* RIGHT: Utilities */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <DateRangePicker />

          {/* Notification */}
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 rounded-full border-neutral-700 bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#1A1A1A]" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full transition-all hover:bg-neutral-800/50 p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile?.avatar} alt={user?.name || ""} />
                  <AvatarFallback className="bg-neutral-700 text-neutral-300">
                    {user?.name?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left lg:block">
                  <span className="block text-sm font-medium text-white">{user?.name}</span>
                  <span className="block text-xs text-neutral-400">{user?.email}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-neutral-700 bg-neutral-800 text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem className="focus:bg-neutral-700">Profile</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-neutral-700">Store Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem onSelect={logout} className="focus:bg-neutral-700 focus:text-red-400">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
