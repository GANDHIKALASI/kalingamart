"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Clock, Truck } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderStatus, setOrderStatus] = useState("confirmed")

  useEffect(() => {
    // Simulate order status updates
    const statusUpdates = ["confirmed", "preparing", "out-for-delivery", "delivered"]
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < statusUpdates.length - 1) {
        currentIndex++
        setOrderStatus(statusUpdates[currentIndex])
      } else {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "preparing":
        return <Package className="w-8 h-8 text-blue-500" />
      case "out-for-delivery":
        return <Truck className="w-8 h-8 text-orange-500" />
      case "delivered":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      default:
        return <Clock className="w-8 h-8 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Order Confirmed"
      case "preparing":
        return "Preparing Your Order"
      case "out-for-delivery":
        return "Out for Delivery"
      case "delivered":
        return "Order Delivered"
      default:
        return "Processing"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Order Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">Order ID: #{orderId || "KM001"}</p>
            <p className="text-sm text-gray-500">Thank you for your order!</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              {getStatusIcon(orderStatus)}
              <span className="text-xl font-bold text-gray-800">{getStatusText(orderStatus)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width:
                    orderStatus === "confirmed"
                      ? "25%"
                      : orderStatus === "preparing"
                        ? "50%"
                        : orderStatus === "out-for-delivery"
                          ? "75%"
                          : "100%",
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Order Confirmed</span>
            </div>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                ["preparing", "out-for-delivery", "delivered"].includes(orderStatus) ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <Package
                className={`w-5 h-5 ${
                  ["preparing", "out-for-delivery", "delivered"].includes(orderStatus)
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              />
              <span className="text-sm">Preparing Your Order</span>
            </div>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                ["out-for-delivery", "delivered"].includes(orderStatus) ? "bg-orange-50" : "bg-gray-50"
              }`}
            >
              <Truck
                className={`w-5 h-5 ${
                  ["out-for-delivery", "delivered"].includes(orderStatus) ? "text-orange-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm">Out for Delivery</span>
            </div>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                orderStatus === "delivered" ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${orderStatus === "delivered" ? "text-green-500" : "text-gray-400"}`} />
              <span className="text-sm">Order Delivered</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Link href="/orders">Track Order</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-green-200 hover:bg-green-50 bg-transparent">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
