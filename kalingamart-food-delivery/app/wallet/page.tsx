"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ArrowUpRight, ArrowDownRight, Gift, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/header"
import Link from "next/link"

export default function WalletPage() {
  const { user, getWalletTransactions } = useAuth()
  const transactions = getWalletTransactions()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center animate-fade-in-up">
            <div className="text-8xl mb-6">🔐</div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Please login to access your wallet
            </h2>
            <p className="text-gray-600 mb-8 text-lg">Sign in to view your wallet balance and transaction history!</p>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                🔑 Login Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          💰 My Wallet
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Wallet Balance */}
          <Card className="mb-8 bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-2xl shadow-xl animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Wallet className="w-6 h-6 text-green-600" />💰 Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-5xl font-bold text-green-600 mb-4">₹{user.walletBalance}</div>
                <p className="text-gray-600 text-lg">Available Balance</p>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
                  <p className="text-sm text-gray-700 font-medium">💡 How to add money to your wallet:</p>
                  <p className="text-sm text-gray-600 mt-1">Contact admin to add funds to your wallet balance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl shadow-xl animate-fade-in-up animation-delay-200">
            <CardHeader>
              <CardTitle className="text-2xl">📊 Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 text-lg">No transactions yet</p>
                  <p className="text-gray-400 mt-2">Your wallet transactions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowDownRight className="w-6 h-6" />
                          ) : (
                            <ArrowUpRight className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg">{transaction.description}</p>
                            {transaction.description === "Welcome bonus" && (
                              <Gift className="w-5 h-5 text-yellow-500" />
                            )}
                            {transaction.orderId && <ShoppingBag className="w-4 h-4 text-blue-500" />}
                          </div>
                          <p className="text-sm text-gray-500">📅 {transaction.date}</p>
                          {transaction.orderId && (
                            <p className="text-xs text-blue-600 font-medium">🛒 Order: {transaction.orderId}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold text-xl ${
                            transaction.type === "credit" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.type === "credit" ? "💰 Added" : "💸 Used"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Usage Info */}
          <Card className="mt-8 bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-100 rounded-2xl shadow-xl animate-fade-in-up animation-delay-400">
            <CardHeader>
              <CardTitle className="text-2xl">💡 How to Use Your Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-green-700">💰 Add Money</h3>
                    <p className="text-gray-600 text-sm">Contact admin to add funds to your wallet</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-blue-700">🛒 Use for Orders</h3>
                    <p className="text-gray-600 text-sm">Use wallet balance during checkout to pay for orders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-purple-700">📊 Track History</h3>
                    <p className="text-gray-600 text-sm">View all your wallet transactions in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-orange-700">🎁 Get Bonuses</h3>
                    <p className="text-gray-600 text-sm">Earn welcome bonuses and special rewards</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  )
}
