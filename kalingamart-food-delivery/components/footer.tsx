import Link from "next/link"
import { Mail, Phone, MapPin, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🍛</span>
              </div>
              <span className="text-2xl font-bold">KalingaMart</span>
            </div>
            <p className="text-slate-300">
              Your favorite food delivery app bringing delicious meals from the best restaurants in Odisha.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/categories" className="block text-slate-300 hover:text-white transition-colors">
                Menu
              </Link>
              <Link href="/orders" className="block text-slate-300 hover:text-white transition-colors">
                Orders
              </Link>
              <Link href="/contact" className="block text-slate-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-slate-300">+91 9348605226</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-slate-300">odcyberforce@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-slate-300">Bhubaneswar, Odisha, India</span>
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Developer</h3>
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-500/30">
              <p className="text-orange-300 font-bold mb-2">Developed by Gandhi</p>
              <p className="text-slate-300 text-sm mb-3">
                Full-stack developer passionate about creating amazing food delivery experiences.
              </p>
              <div className="space-y-1 text-sm text-slate-400">
                <p>📍 Bhubaneswar, Odisha</p>
                <p>📞 +91 9348605226</p>
                <p>✉️ odcyberforce@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> by Gandhi © 2024 KalingaMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
