"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Wallet, Truck, Gift, CreditCard } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useOrders } from "@/hooks/use-orders"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function CheckoutPage() {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [useWallet, setUseWallet] = useState(false)
  const [notes, setNotes] = useState("")

  // Add discount code state and logic
  const [promoCode, setPromoCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [discountMessage, setDiscountMessage] = useState("")

  const { items, getTotalPrice, clearCart } = useCart()
  const { user, updateWalletBalance } = useAuth()
  const { addOrder } = useOrders()
  const router = useRouter()

  const deliveryFee = 29
  const totalPrice = getTotalPrice()
  const freeDeliveryThreshold = 199
  const isFreeDelivery = totalPrice >= freeDeliveryThreshold
  const actualDeliveryFee = isFreeDelivery ? 0 : deliveryFee
  const walletAmount = useWallet ? Math.min(user?.walletBalance || 0, totalPrice + actualDeliveryFee) : 0

  // Discount codes
  const discountCodes = {
    WOWGANDHI: { amount: 30, description: "Special Gandhi discount!" },
    NEWUSER: { amount: 10, description: "New user discount!" },
  }

  const handleApplyPromo = () => {
    const discount = discountCodes[promoCode.toUpperCase()]
    if (discount) {
      setAppliedDiscount(discount.amount)
      setDiscountMessage(`🎉 ${discount.description} ₹${discount.amount} off applied!`)
    } else {
      setDiscountMessage("❌ Invalid promo code")
      setAppliedDiscount(0)
    }
  }

  // Update final total calculation
  const finalTotal = totalPrice + actualDeliveryFee - walletAmount - appliedDiscount

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.pincode) {
      alert("Please fill in all address fields")
      return
    }

    if (!user) {
      alert("Please login to place an order")
      return
    }

    // Create order object
    const orderData = {
      userId: user.id,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      itemsText: items.map((item) => `${item.name} x${item.quantity}`),
      total: finalTotal,
      paymentMethod: paymentMethod,
      address: address,
      discountApplied: appliedDiscount > 0 ? appliedDiscount : undefined,
      walletUsed: walletAmount > 0 ? walletAmount : undefined,
    }

    // Add order to orders list
    const orderId = addOrder(orderData)

    // Update wallet balance if used and add transaction
    if (useWallet && walletAmount > 0) {
      updateWalletBalance(-walletAmount, `Order payment - ${orderId}`, orderId)
    }

    // Clear cart
    clearCart()

    // Redirect to order confirmation
    router.push(`/order-success?id=${orderId}`)
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          🛒 Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl shadow-xl animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MapPin className="w-6 h-6 text-blue-600" />📍 Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="street" className="text-lg font-medium">
                      Street Address
                    </Label>
                    <Textarea
                      id="street"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Enter your complete address..."
                      className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-lg font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-lg font-medium">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-lg font-medium">
                      PIN Code
                    </Label>
                    <Input
                      id="pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="PIN Code"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-lg font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="Phone number for delivery"
                      className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-2xl shadow-xl animate-fade-in-up animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CreditCard className="w-6 h-6 text-green-600" />💳 Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-all duration-300">
                    <RadioGroupItem value="cod" id="cod" className="text-green-600" />
                    <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Truck className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-bold text-lg">💵 Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when your order arrives</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Wallet Option */}
                {user.walletBalance > 0 && (
                  <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-purple-600" />
                        <div>
                          <span className="text-lg font-bold text-purple-800">💰 Use Wallet Balance</span>
                          <p className="text-sm text-purple-600">Available: ₹{user.walletBalance}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-purple-700">
                          Use ₹{Math.min(user.walletBalance, totalPrice + actualDeliveryFee)}
                        </span>
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={(e) => setUseWallet(e.target.checked)}
                          className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card className="bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-100 rounded-2xl shadow-xl animate-fade-in-up animation-delay-400">
              <CardHeader>
                <CardTitle className="text-2xl">📝 Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for delivery (e.g., gate code, landmarks)..."
                  className="border-2 border-yellow-200 focus:border-yellow-400 rounded-xl"
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 rounded-2xl shadow-xl sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  📋 Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm bg-white p-3 rounded-xl border border-orange-200"
                    >
                      <span className="font-medium">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gradient-to-r from-orange-200 to-red-200 h-0.5" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{totalPrice}</span>
                  </div>

                  {isFreeDelivery ? (
                    <div className="flex justify-between text-green-600 bg-green-100 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        <span className="font-bold">Delivery Fee</span>
                      </div>
                      <span className="font-bold">FREE! 🎉</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-bold">₹{actualDeliveryFee}</span>
                    </div>
                  )}

                  {useWallet && walletAmount > 0 && (
                    <div className="flex justify-between text-purple-600 bg-purple-100 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        <span className="font-bold">Wallet Used</span>
                      </div>
                      <span className="font-bold">-₹{walletAmount}</span>
                    </div>
                  )}

                  {/* Add discount display in the order summary after wallet section */}
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-100 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        <span className="font-bold">Discount Applied</span>
                      </div>
                      <span className="font-bold">-₹{appliedDiscount}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-gradient-to-r from-orange-200 to-red-200 h-0.5" />

                {/* Add promo code section before the total */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="🎫 Enter promo code (try WOWGANDHI)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="border-2 border-orange-200 focus:border-orange-400 rounded-xl"
                    />
                    <Button
                      onClick={handleApplyPromo}
                      variant="outline"
                      className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 hover:from-orange-200 hover:to-red-200 rounded-xl"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountMessage && (
                    <p className={`text-sm font-medium ${appliedDiscount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {discountMessage}
                    </p>
                  )}
                </div>

                <div className="flex justify-between font-bold text-2xl">
                  <span>Total to Pay</span>
                  <span>₹{finalTotal}</span>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  Place Order
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    terms and conditions
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
