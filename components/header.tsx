import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */ }
          <Link href="/" className="flex items-center gap-2">
            <img src="/logonobg.png"  alt="Logo" className="w-40 h-40 rounded-lg object-contain"/>

            {/* <span className="text-xl font-bold text-gray-900">eBuilt</span> */}
          </Link>

          {/* Navigation */}
          {/* <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav> */}

<div className="flex items-center gap-3">
  {/* <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
    <Link href="/login">Sign In</Link>
  </Button> */}

<Button
  asChild
  size="sm"
  className="text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
>

    <Link href="/create-store">Get Started</Link>
  </Button>
</div>
        </div>
      </div>
    </header>
  )
}
