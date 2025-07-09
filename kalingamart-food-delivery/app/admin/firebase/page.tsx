"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Plus,
  Edit,
  Trash2,
  Wallet,
  Gift,
  Settings,
  BarChart3,
  PieChart,
  Clock,
  Phone,
  Mail,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Send,
  Database,
  Loader2,
} from "lucide-react"
import { useFirebaseAdmin } from "@/hooks/use-firebase-admin"
import { useRouter } from "next/navigation"

export default function FirebaseAdminDashboard() {
  const {
    admin,
    loading,
    login,
    logout,
    transferToUser,
    addAdminFunds,
    getAdminTransactions,
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllDiscountCodes,
    addDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
  } = useFirebaseAdmin()

  const router = useRouter()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)

  // Data states
  const [users, setUsers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [discountCodes, setDiscountCodes] = useState<any[]>([])
  const [adminTransactions, setAdminTransactions] = useState<any[]>([])

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "",
  })

  const [newDiscount, setNewDiscount] = useState({
    code: "",
    amount: "",
    description: "",
  })

  const [transferAmount, setTransferAmount] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [transferNote, setTransferNote] = useState("")

  // Load data when admin is authenticated
  useEffect(() => {
    if (admin) {
      loadAllData()
    }
  }, [admin])

  const loadAllData = async () => {
    try {
      setIsLoading(true)
      const [usersData, ordersData, productsData, discountCodesData, transactionsData] = await Promise.all([
        getAllUsers(),
        getAllOrders(),
        getAllProducts(),
        getAllDiscountCodes(),
        getAdminTransactions(),
      ])

      setUsers(usersData)
      setOrders(ordersData)
      setProducts(productsData)
      setDiscountCodes(discountCodesData)
      setAdminTransactions(transactionsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)
      if (!success) {
        alert("Invalid admin credentials or you are not authorized as admin!")
      }
    } catch (error) {
      alert("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleTransferToUser = async () => {
    const amount = Number.parseFloat(transferAmount)
    const selectedUserData = users.find((u) => u.id === selectedUser)

    if (!selectedUserData) {
      alert("Please select a user!")
      return
    }

    if (amount <= 0) {
      alert("Please enter a valid amount!")
      return
    }

    if (!admin || amount > admin.walletBalance) {
      alert("Insufficient admin wallet balance!")
      return
    }

    setIsLoading(true)
    const success = await transferToUser(
      selectedUserData.id,
      selectedUserData.name,
      amount,
      transferNote || `Admin transfer to ${selectedUserData.name}`,
    )

    if (success) {
      // Refresh data
      await loadAllData()

      // Reset form
      setTransferAmount("")
      setSelectedUser("")
      setTransferNote("")

      alert(`₹${amount} transferred to ${selectedUserData.name} successfully!`)
    } else {
      alert("Transfer failed. Please try again.")
    }
    setIsLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData = {
        name: newProduct.name,
        price: Number.parseInt(newProduct.price),
        category: newProduct.category,
        image: newProduct.image,
        description: newProduct.description,
        stock: Number.parseInt(newProduct.stock),
        rating: 4.0,
      }

      await addProduct(productData)
      await loadAllData()
      setNewProduct({ name: "", price: "", description: "", category: "", image: "", stock: "" })
      alert("Product added successfully!")
    } catch (error) {
      alert("Failed to add product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true)
      try {
        await deleteProduct(productId)
        await loadAllData()
        alert("Product deleted successfully!")
      } catch (error) {
        alert("Failed to delete product. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const discountData = {
        code: newDiscount.code.toUpperCase(),
        amount: Number.parseInt(newDiscount.amount),
        description: newDiscount.description,
      }

      await addDiscountCode(discountData)
      await loadAllData()
      setNewDiscount({ code: "", amount: "", description: "" })
      alert("Discount code added successfully!")
    } catch (error) {
      alert("Failed to add discount code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleDiscountCode = async (discountId: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      await updateDiscountCode(discountId, { active: !currentStatus })
      await loadAllData()
    } catch (error) {
      alert("Failed to update discount code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDiscountCode = async (discountId: string) => {
    if (confirm("Are you sure you want to delete this discount code?")) {
      setIsLoading(true)
      try {
        await deleteDiscountCode(discountId)
        await loadAllData()
        alert("Discount code deleted successfully!")
      } catch (error) {
        alert("Failed to delete discount code. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      await updateOrderStatus(orderId, newStatus)
      await loadAllData()
    } catch (error) {
      alert("Failed to update order status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl border-0">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
            <p className="text-lg font-medium text-gray-700">Loading Firebase Admin...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin login form
  if (!admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              🔥 Firebase Admin
            </CardTitle>
            <CardDescription className="text-lg">Secure Firebase Authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <Label htmlFor="admin-email" className="text-lg font-medium">
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="your-admin@email.com"
                  className="mt-2 border-2 border-red-200 focus:border-red-400 rounded-xl h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password" className="text-lg font-medium">
                  Admin Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="mt-2 border-2 border-red-200 focus:border-red-400 rounded-xl h-12"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 rounded-xl py-3 text-lg font-bold shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Firebase Login
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-800 font-medium">🔥 Firebase Authentication:</p>
              <p className="text-sm text-red-700">Use your Firebase admin credentials</p>
              <p className="text-xs text-red-600 mt-2">⚠️ Only authorized admins can access</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Database className="w-8 h-8 text-red-400" />
                KALINGAMART Firebase Admin
              </h1>
              <p className="text-slate-300 mt-2">Firebase-Powered Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-6">
              {/* Admin Wallet Display */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-green-400/30">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-300 text-sm font-medium">Admin Wallet</p>
                    <p className="text-white text-2xl font-bold">₹{admin.walletBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-300">Welcome, {admin.name}</p>
                <p className="text-sm text-slate-400">{admin.email}</p>
              </div>
              <Button
                onClick={handleAdminLogout}
                variant="outline"
                className="bg-red-500/20 border-red-400/30 text-white hover:bg-red-500/30 rounded-xl"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
              <p className="text-xs opacity-80">Firebase users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Orders</CardTitle>
              <ShoppingBag className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orders.length}</div>
              <p className="text-xs opacity-80">Firestore orders</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs opacity-80">Real-time revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
              <Package className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{products.length}</div>
              <p className="text-xs opacity-80">Active products</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Admin Balance</CardTitle>
              <Wallet className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{admin.walletBalance.toLocaleString()}</div>
              <p className="text-xs opacity-80">Firebase wallet</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white shadow-lg rounded-xl p-1 grid grid-cols-8 w-full">
            <TabsTrigger value="overview" className="rounded-lg">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg">
              📦 Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg">
              🍽️ Products
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg">
              👥 Users
            </TabsTrigger>
            <TabsTrigger value="wallet" className="rounded-lg">
              💰 Transfers
            </TabsTrigger>
            <TabsTrigger value="admin-wallet" className="rounded-lg">
              🏦 Admin Wallet
            </TabsTrigger>
            <TabsTrigger value="discounts" className="rounded-lg">
              🎫 Discounts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">
              📈 Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-bold">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date || "N/A"}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹{order.total || 0}</p>
                            <Badge className={`${getStatusColor(order.status || "pending")}`}>
                              {getStatusText(order.status || "pending")}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Admin Wallet Summary */}
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Database className="w-6 h-6 text-emerald-600" />
                    Firebase Admin Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                      <p className="text-emerald-800 text-lg font-medium">Available Balance</p>
                      <p className="text-4xl font-bold text-emerald-900">₹{admin.walletBalance.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-100 rounded-xl">
                        <p className="text-green-600 text-sm">Total Credits</p>
                        <p className="text-2xl font-bold text-green-800">
                          ₹
                          {adminTransactions
                            .filter((t) => t.type === "credit")
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-100 rounded-xl">
                        <p className="text-red-600 text-sm">Total Transfers</p>
                        <p className="text-2xl font-bold text-red-800">
                          ₹
                          {adminTransactions
                            .filter((t) => t.type === "debit")
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-white shadow-xl rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  Firebase Order Management
                </CardTitle>
                <CardDescription>Manage and track all customer orders in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-gray-600 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Orders will appear here when customers start placing them</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-bold text-lg">Order #{order.id}</p>
                              <p className="text-gray-600">User ID: {order.userId || "N/A"}</p>
                              <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                              <p className="text-sm text-gray-500">{order.date || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-bold text-xl text-green-600">₹{order.total || 0}</p>
                          <p className="text-sm text-gray-500">{order.paymentMethod === "cod" ? "COD" : "Wallet"}</p>
                        </div>
                        <div className="ml-4">
                          <Select
                            value={order.status || "pending"}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="w-40 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">🕐 Pending</SelectItem>
                              <SelectItem value="confirmed">✅ Confirmed</SelectItem>
                              <SelectItem value="preparing">👨‍🍳 Preparing</SelectItem>
                              <SelectItem value="out-for-delivery">🚚 Out for Delivery</SelectItem>
                              <SelectItem value="delivered">📦 Delivered</SelectItem>
                              <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Plus className="w-6 h-6 text-green-600" />
                    Add New Product
                  </CardTitle>
                  <CardDescription>Add a new food item to Firebase</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-6">
                    <div>
                      <Label htmlFor="product-name" className="text-lg font-medium">
                        Product Name
                      </Label>
                      <Input
                        id="product-name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-price" className="text-lg font-medium">
                          Price (₹)
                        </Label>
                        <Input
                          id="product-price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-stock" className="text-lg font-medium">
                          Stock
                        </Label>
                        <Input
                          id="product-stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="product-category" className="text-lg font-medium">
                        Category
                      </Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="biryani">🍛 Biryani</SelectItem>
                          <SelectItem value="pizza">🍕 Pizza</SelectItem>
                          <SelectItem value="thali">🍽️ Thali</SelectItem>
                          <SelectItem value="sweets">🍬 Sweets</SelectItem>
                          <SelectItem value="curry">🍛 Curry</SelectItem>
                          <SelectItem value="snacks">🥪 Snacks</SelectItem>
                          <SelectItem value="beverages">🥤 Beverages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="product-description" className="text-lg font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="product-description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-image" className="text-lg font-medium">
                        Image URL
                      </Label>
                      <Input
                        id="product-image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl py-3 text-lg font-bold shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Add to Firebase
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Package className="w-6 h-6 text-blue-600" />
                    Firebase Products
                  </CardTitle>
                  <CardDescription>Manage products stored in Firestore</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-white to-gray-50"
                        >
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-lg">{product.name}</p>
                            <p className="text-green-600 font-bold">₹{product.price}</p>
                            <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                            <Badge variant="default">Firebase</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl hover:bg-blue-100 bg-transparent">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl hover:bg-red-100 bg-transparent"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white shadow-xl rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Firebase User Management
                </CardTitle>
                <CardDescription>View and manage all registered users from Firestore</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl bg-gradient-to-r from-white to-purple-50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-purple-500 text-white font-bold">
                              {user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-lg">{user.name || "Unknown"}</p>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{user.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone || "N/A"}</span>
                            </div>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">Wallet: ₹{user.walletBalance || 0}</p>
                          <p className="text-sm text-gray-500">{user.orders || 0} orders</p>
                          <Badge variant="default">Firebase</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Transfer Tab */}
          <TabsContent value="wallet">
            <Card className="bg-white shadow-xl rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="w-6 h-6 text-green-600" />
                  Firebase Money Transfer
                </CardTitle>
                <CardDescription>
                  Transfer money from admin wallet (₹{admin.walletBalance.toLocaleString()}) to user wallets via
                  Firebase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-emerald-800">Firebase Admin Wallet</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-900">₹{admin.walletBalance.toLocaleString()}</p>
                  </div>

                  <div>
                    <Label htmlFor="user-select" className="text-lg font-medium">
                      Select User
                    </Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl">
                        <SelectValue placeholder="Choose a user to transfer money" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name || "Unknown"} - Current: ₹{user.walletBalance || 0}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transfer-amount" className="text-lg font-medium">
                      Amount to Transfer (₹)
                    </Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="Enter amount"
                      max={admin.walletBalance}
                      className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl"
                    />
                    <p className="text-sm text-gray-500 mt-1">Maximum: ₹{admin.walletBalance.toLocaleString()}</p>
                  </div>

                  <div>
                    <Label htmlFor="transfer-note" className="text-lg font-medium">
                      Transfer Note (Optional)
                    </Label>
                    <Input
                      id="transfer-note"
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      placeholder="e.g., Bonus payment, Refund, etc."
                      className="mt-2 border-2 border-gray-200 focus:border-green-400 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[100, 500, 1000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setTransferAmount(amount.toString())}
                        disabled={amount > admin.walletBalance || isLoading}
                        className="rounded-xl hover:bg-green-100 hover:border-green-300"
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={handleTransferToUser}
                    disabled={
                      !selectedUser ||
                      !transferAmount ||
                      Number.parseFloat(transferAmount) > admin.walletBalance ||
                      Number.parseFloat(transferAmount) <= 0 ||
                      isLoading
                    }
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl py-3 text-lg font-bold shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Transferring...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Transfer via Firebase
                      </>
                    )}
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">🔥 Firebase Integration:</p>
                    <p className="text-sm text-blue-700 mt-1">
                      All transfers are processed through Firebase Firestore with real-time updates and transaction
                      logging.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Wallet Tab */}
          <TabsContent value="admin-wallet">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Database className="w-6 h-6 text-emerald-600" />
                    Firebase Admin Wallet
                  </CardTitle>
                  <CardDescription>Manage your Firebase admin wallet funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl">
                      <p className="text-emerald-800 text-xl font-medium mb-2">Current Balance</p>
                      <p className="text-5xl font-bold text-emerald-900 mb-4">
                        ₹{admin.walletBalance.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-emerald-700">
                        <Database className="w-5 h-5" />
                        <span>Firebase Powered</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-lg font-medium text-gray-800">Add Funds (Demo)</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[5000, 10000, 25000, 50000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            onClick={() => addAdminFunds(amount, `Admin wallet top-up of ₹${amount}`)}
                            disabled={isLoading}
                            className="rounded-xl hover:bg-emerald-100 hover:border-emerald-300 py-3"
                          >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `+₹${amount.toLocaleString()}`}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                      <p className="text-sm text-red-800 font-medium">🔥 Firebase Admin Privileges:</p>
                      <ul className="text-sm text-red-700 mt-2 space-y-1">
                        <li>• Real-time Firebase authentication</li>
                        <li>• Firestore database integration</li>
                        <li>• Secure admin-only access</li>
                        <li>• Live transaction tracking</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <History className="w-6 h-6 text-blue-600" />
                    Firebase Transaction History
                  </CardTitle>
                  <CardDescription>Complete record of admin wallet activity from Firestore</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {adminTransactions.length === 0 ? (
                        <div className="text-center py-8">
                          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No transactions yet</p>
                        </div>
                      ) : (
                        adminTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-white to-gray-50"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-3 rounded-full ${
                                  transaction.type === "credit"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {transaction.type === "credit" ? (
                                  <ArrowDownRight className="w-5 h-5" />
                                ) : (
                                  <ArrowUpRight className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-lg">{transaction.description}</p>
                                <p className="text-sm text-gray-500">📅 {transaction.date}</p>
                                {transaction.recipientName && (
                                  <p className="text-xs text-blue-600 font-medium">
                                    👤 To: {transaction.recipientName}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`font-bold text-xl ${
                                  transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {transaction.type === "credit" ? "💰 Added" : "💸 Transferred"}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discount Codes Tab */}
          <TabsContent value="discounts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Gift className="w-6 h-6 text-pink-600" />
                    Add Discount Code
                  </CardTitle>
                  <CardDescription>Create new discount codes in Firebase</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddDiscount} className="space-y-6">
                    <div>
                      <Label htmlFor="discount-code" className="text-lg font-medium">
                        Discount Code
                      </Label>
                      <Input
                        id="discount-code"
                        value={newDiscount.code}
                        onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                        placeholder="e.g., SAVE20"
                        className="mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount-amount" className="text-lg font-medium">
                        Discount Amount (₹)
                      </Label>
                      <Input
                        id="discount-amount"
                        type="number"
                        value={newDiscount.amount}
                        onChange={(e) => setNewDiscount({ ...newDiscount, amount: e.target.value })}
                        placeholder="e.g., 50"
                        className="mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount-description" className="text-lg font-medium">
                        Description
                      </Label>
                      <Input
                        id="discount-description"
                        value={newDiscount.description}
                        onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                        placeholder="e.g., Special offer for new users"
                        className="mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-xl py-3 text-lg font-bold shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Add to Firebase
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-600" />
                    Firebase Discount Codes
                  </CardTitle>
                  <CardDescription>Manage discount codes stored in Firestore</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {discountCodes.map((code) => (
                        <div
                          key={code.id}
                          className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-white to-pink-50"
                        >
                          <div>
                            <p className="font-bold text-lg">{code.code}</p>
                            <p className="text-green-600 font-bold">₹{code.amount} off</p>
                            <p className="text-sm text-gray-500">{code.description}</p>
                            <p className="text-xs text-blue-600">Used {code.usageCount || 0} times</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={code.active ? "default" : "secondary"}>
                              {code.active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleDiscountCode(code.id, code.active)}
                              disabled={isLoading}
                              className="rounded-xl"
                            >
                              {code.active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDiscountCode(code.id)}
                              disabled={isLoading}
                              className="rounded-xl hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Firebase Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-bold text-blue-800 mb-2">📊 Real-time Performance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-600">Total Orders</p>
                          <p className="text-2xl font-bold text-blue-800">{orders.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-blue-800">
                            ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h3 className="font-bold text-green-800 mb-2">📈 Firebase Metrics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-600">Active Users</span>
                          <span className="font-bold text-green-800">{users.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Active Products</span>
                          <span className="font-bold text-green-800">{products.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Discount Codes</span>
                          <span className="font-bold text-green-800">{discountCodes.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <h3 className="font-bold text-emerald-800 mb-2">💰 Firebase Wallet Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Admin Balance</span>
                          <span className="font-bold text-emerald-800">₹{admin.walletBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Total Transfers</span>
                          <span className="font-bold text-emerald-800">
                            ₹
                            {adminTransactions
                              .filter((t) => t.type === "debit")
                              .reduce((sum, t) => sum + t.amount, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <PieChart className="w-6 h-6 text-purple-600" />
                    Order Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                      <span className="text-yellow-800">🕐 Pending Orders</span>
                      <span className="font-bold text-yellow-800">
                        {orders.filter((o) => o.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <span className="text-green-800">📦 Completed Orders</span>
                      <span className="font-bold text-green-800">
                        {orders.filter((o) => o.status === "delivered").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                      <span className="text-red-800">❌ Cancelled Orders</span>
                      <span className="font-bold text-red-800">
                        {orders.filter((o) => o.status === "cancelled").length}
                      </span>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h3 className="font-bold text-purple-800 mb-2">🎯 Success Rate</h3>
                      <div className="text-3xl font-bold text-purple-800">
                        {orders.length > 0
                          ? ((orders.filter((o) => o.status === "delivered").length / orders.length) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  function getStatusColor(status: string) {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "out-for-delivery":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "pending":
        return "🕐 Pending"
      case "confirmed":
        return "✅ Confirmed"
      case "preparing":
        return "👨‍🍳 Preparing"
      case "out-for-delivery":
        return "🚚 Out for Delivery"
      case "delivered":
        return "📦 Delivered"
      case "cancelled":
        return "❌ Cancelled"
      default:
        return status
    }
  }
}
