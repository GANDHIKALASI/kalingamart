"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Wallet, Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Logo } from "./logo"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, logout } = useAuth()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-orange-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="transform transition-transform duration-300 hover:scale-105">
            <Logo size="default" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group"
            >
              🏠 Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group"
            >
              🍽️ Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group"
            >
              📦 Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group"
            >
              📞 Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/wallet">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-green-100 to-green-200 border-green-300 hover:from-green-200 hover:to-green-300 transition-all duration-300 transform hover:scale-105"
                >
                  <Wallet className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-bold text-green-700">₹{user.walletBalance || 0}</span>
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 hover:from-orange-200 hover:to-red-200 transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4 text-orange-600" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600 animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/profile">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-full hover:from-blue-200 hover:to-purple-200 transition-all duration-300 cursor-pointer">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Hi, {user.name}!</span>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition-all duration-300 bg-transparent"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden bg-transparent hover:bg-orange-100 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-b-lg animate-slide-down">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-700 hover:text-orange-600 py-2 px-4 rounded-lg hover:bg-orange-100 transition-all duration-300"
              >
                🏠 Home
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-orange-600 py-2 px-4 rounded-lg hover:bg-orange-100 transition-all duration-300"
              >
                🍽️ Categories
              </Link>
              <Link
                href="/orders"
                className="text-gray-700 hover:text-orange-600 py-2 px-4 rounded-lg hover:bg-orange-100 transition-all duration-300"
              >
                📦 Orders
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-orange-600 py-2 px-4 rounded-lg hover:bg-orange-100 transition-all duration-300"
              >
                📞 Contact
              </Link>
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-orange-200">
                  <Link href="/profile">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-lg">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Hi, {user.name}!</span>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-fit bg-transparent hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition-all duration-300"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth" className="pt-2 border-t border-orange-200">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  )
}
