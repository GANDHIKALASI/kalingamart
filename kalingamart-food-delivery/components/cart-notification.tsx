"use client"

import { useEffect } from "react"
import { CheckCircle, ShoppingCart, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function CartNotification() {
  const { notification, hideNotification } = useCart()

  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => {
        hideNotification()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification, hideNotification])

  if (!notification?.show) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-4 rounded-2xl shadow-2xl border-2 border-white/20 backdrop-blur-sm max-w-sm animate-bounce-gentle">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-6 h-6 text-white animate-scale-in" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-4 h-4 text-white animate-wiggle" />
              <span className="font-bold text-sm">SUCCESS!</span>
            </div>
            <p className="text-white/90 text-sm font-medium">{notification.message}</p>
            <p className="text-white/80 text-xs truncate">{notification.itemName}</p>
          </div>

          <button
            onClick={hideNotification}
            className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 group"
          >
            <X className="w-3 h-3 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Animated progress bar */}
        <div className="mt-3 w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-progress-bar"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-float-up opacity-80"></div>
        </div>
        <div className="absolute -top-1 left-1/4">
          <div className="w-1 h-1 bg-pink-300 rounded-full animate-float-up-delayed opacity-60"></div>
        </div>
        <div className="absolute -top-3 right-1/4">
          <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-float-up-slow opacity-70"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes bounce-gentle {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.5);
          }
        }
        
        @keyframes float-up-delayed {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translateY(-25px) scale(0.3);
          }
        }
        
        @keyframes float-up-slow {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.2);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 1s ease-in-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out 0.2s both;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out 0.3s;
        }
        
        .animate-progress-bar {
          animation: progress-bar 3s linear;
        }
        
        .animate-float-up {
          animation: float-up 2s ease-out infinite;
        }
        
        .animate-float-up-delayed {
          animation: float-up-delayed 2.5s ease-out infinite 0.5s;
        }
        
        .animate-float-up-slow {
          animation: float-up-slow 3s ease-out infinite 1s;
        }
      `}</style>
    </div>
  )
}
