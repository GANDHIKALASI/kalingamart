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
  Shield,
} from "lucide-react"
import { useAdmin } from "@/hooks/use-admin"
import { useOrders } from "@/hooks/use-orders"
import { useRouter } from "next/navigation"

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 1247,
  totalOrders: 156,
  totalRevenue: 45000,
  totalProducts: 27,
  todayOrders: 23,
  pendingOrders: 8,
  completedOrders: 148,
  cancelledOrders: 0,
}

// Mock users data (this would come from a database in real app)
const mockUsers = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    walletBalance: 250,
    orders: 12,
    joinDate: "2024-01-15",
    status: "active",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "user_2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    walletBalance: 150,
    orders: 8,
    joinDate: "2024-02-20",
    status: "active",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: "user_3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+91 9876543212",
    walletBalance: 300,
    orders: 15,
    joinDate: "2024-01-10",
    status: "active",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
  },
]

// Food products data
const foodProducts = [
  {
    id: 1,
    name: "Chicken Biryani",
    price: 299,
    category: "biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop",
    description: "Aromatic basmati rice with tender chicken pieces",
    rating: 4.5,
    status: "active",
    stock: 50,
  },
  {
    id: 2,
    name: "Paneer Makhani",
    price: 229,
    category: "curry",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop",
    description: "Rich and creamy paneer curry",
    rating: 4.4,
    status: "active",
    stock: 30,
  },
  {
    id: 3,
    name: "Margherita Pizza",
    price: 249,
    category: "pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
    description: "Classic pizza with fresh tomato sauce and mozzarella",
    rating: 4.3,
    status: "active",
    stock: 25,
  },
]

// Discount codes management
const discountCodes = [
  { id: 1, code: "WOWGANDHI", amount: 30, description: "Special Gandhi discount", active: true, usageCount: 45 },
  { id: 2, code: "NEWUSER", amount: 10, description: "New user discount", active: true, usageCount: 123 },
  { id: 3, code: "SAVE50", amount: 50, description: "Big savings discount", active: false, usageCount: 12 },
]

export default function AdminDashboard() {
  const { admin, login, logout, transferToUser, addAdminFunds, adminTransactions } = useAdmin()
  const { orders: allOrders } = useOrders()
  const router = useRouter()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState(allOrders)
  const [users, setUsers] = useState(mockUsers)
  const [products, setProducts] = useState(foodProducts)
  const [codes, setCodes] = useState(discountCodes)

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

  // Update orders when allOrders changes
  useEffect(() => {
    setOrders(allOrders)
  }, [allOrders])

  // Load users from localStorage and merge with mock data
  useEffect(() => {
    const savedUsers = localStorage.getItem("kalingamart-users")
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers)
      // Merge with mock users, prioritizing saved data
      const mergedUsers = [...mockUsers]
      parsedUsers.forEach((savedUser: any) => {
        const existingIndex = mergedUsers.findIndex((u) => u.id === savedUser.id)
        if (existingIndex >= 0) {
          mergedUsers[existingIndex] = { ...mergedUsers[existingIndex], ...savedUser }
        } else {
          mergedUsers.push(savedUser)
        }
      })
      setUsers(mergedUsers)
    }
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)
      if (!success) {
        alert("Invalid admin credentials! Please use admin@kalingamart.com / admin123")
      }
    } catch (error) {
      alert("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogout = () => {
    logout()
    router.push("/")
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  // Enhanced wallet transfer function
  const handleTransferToUser = () => {
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

    const success = transferToUser(
      selectedUserData.id,
      selectedUserData.name,
      amount,
      transferNote || `Admin transfer to ${selectedUserData.name}`,
    )

    if (success) {
      // Update local users state
      setUsers(
        users.map((user) =>
          user.id === selectedUserData.id ? { ...user, walletBalance: user.walletBalance + amount } : user,
        ),
      )

      // Reset form
      setTransferAmount("")
      setSelectedUser("")
      setTransferNote("")

      alert(`₹${amount} transferred to ${selectedUserData.name} successfully!`)
    } else {
      alert("Transfer failed. Please try again.")
    }
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      price: Number.parseInt(newProduct.price),
      category: newProduct.category,
      image: newProduct.image,
      description: newProduct.description,
      rating: 4.0,
      status: "active",
      stock: Number.parseInt(newProduct.stock),
    }
    setProducts([...products, product])
    setNewProduct({ name: "", price: "", description: "", category: "", image: "", stock: "" })
    alert("Product added successfully!")
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
      alert("Product deleted successfully!")
    }
  }

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    const newCode = {
      id: codes.length + 1,
      code: newDiscount.code.toUpperCase(),
      amount: Number.parseInt(newDiscount.amount),
      description: newDiscount.description,
      active: true,
      usageCount: 0,
    }
    setCodes([...codes, newCode])
    setNewDiscount({ code: "", amount: "", description: "" })
    alert("Discount code added successfully!")
  }

  const toggleDiscountCode = (id: number) => {
    setCodes(codes.map((code) => (code.id === id ? { ...code, active: !code.active } : code)))
  }

  const deleteDiscountCode = (id: number) => {
    if (confirm("Are you sure you want to delete this discount code?")) {
      setCodes(codes.filter((c) => c.id !== id))
      alert("Discount code deleted successfully!")
    }
  }

  // Admin login form
  if (!admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              🛡️ Admin Access
            </CardTitle>
            <CardDescription className="text-lg">Secure Admin Panel Login</CardDescription>
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
                  placeholder="admin@kalingamart.com"
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
                  placeholder="Enter admin password"
                  className="mt-2 border-2 border-red-200 focus:border-red-400 rounded-xl h-12"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 rounded-xl py-3 text-lg font-bold shadow-lg"
              >
                {isLoading ? "🔐 Authenticating..." : "🔐 Admin Login"}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-800 font-medium">🔑 Admin Credentials:</p>
              <p className="text-sm text-red-700">Email: admin@kalingamart.com</p>
              <p className="text-sm text-red-700">Password: admin123</p>
              <p className="text-xs text-red-600 mt-2">⚠️ Admin access only - separate from user accounts</p>
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
                <Shield className="w-8 h-8 text-red-400" />
                KALINGAMART Admin Panel
              </h1>
              <p className="text-slate-300 mt-2">Advanced Administrative Dashboard</p>
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
                <p className="text-sm text-slate-400">Admin ID: {admin.id}</p>
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
              <p className="text-xs opacity-80">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Orders</CardTitle>
              <ShoppingBag className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orders.length}</div>
              <p className="text-xs opacity-80">+{mockStats.todayOrders} today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{mockStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs opacity-80">+15% from last month</p>
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
              <p className="text-xs opacity-80">Available funds</p>
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
                  {orders.length === 0 ? (
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
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹{order.total}</p>
                            <Badge className={`${getStatusColor(order.status)}`}>{getStatusText(order.status)}</Badge>
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
                    <Wallet className="w-6 h-6 text-emerald-600" />
                    Admin Wallet Summary
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
                  Order Management
                </CardTitle>
                <CardDescription>Manage and track all customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
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
                              <p className="text-gray-600">User ID: {order.userId}</p>
                              <p className="text-sm text-gray-500">{order.items.length} items</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-bold text-xl text-green-600">₹{order.total}</p>
                          <p className="text-sm text-gray-500">{order.paymentMethod === "cod" ? "COD" : "Wallet"}</p>
                        </div>
                        <div className="ml-4">
                          <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
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
                  <CardDescription>Add a new food item to the menu</CardDescription>
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
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl py-3 text-lg font-bold shadow-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Product
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Package className="w-6 h-6 text-blue-600" />
                    Product Management
                  </CardTitle>
                  <CardDescription>Edit or remove existing products</CardDescription>
                </CardHeader>
                <CardContent>
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
                          <Badge variant={product.status === "active" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
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
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  User Management
                </CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
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
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg">{user.name}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                          </div>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">Wallet: ₹{user.walletBalance}</p>
                        <p className="text-sm text-gray-500">{user.orders} orders</p>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Transfer Tab */}
          <TabsContent value="wallet">
            <Card className="bg-white shadow-xl rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="w-6 h-6 text-green-600" />
                  Transfer Money to Users
                </CardTitle>
                <CardDescription>
                  Transfer money from admin wallet (₹{admin.walletBalance.toLocaleString()}) to user wallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto space-y-6">
                  <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-emerald-800">Admin Wallet Balance</span>
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
                            {user.name} - Current: ₹{user.walletBalance}
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
                        disabled={amount > admin.walletBalance}
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
                      Number.parseFloat(transferAmount) <= 0
                    }
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl py-3 text-lg font-bold shadow-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Transfer from Admin Wallet
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">🔒 Admin Only:</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Only admin can transfer money from the admin wallet. This action will be recorded in both admin
                      and user transaction histories.
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
                    <CreditCard className="w-6 h-6 text-emerald-600" />
                    Admin Wallet Control
                  </CardTitle>
                  <CardDescription>Manage your admin wallet funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl">
                      <p className="text-emerald-800 text-xl font-medium mb-2">Current Balance</p>
                      <p className="text-5xl font-bold text-emerald-900 mb-4">
                        ₹{admin.walletBalance.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-emerald-700">
                        <Shield className="w-5 h-5" />
                        <span>Admin Exclusive</span>
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
                            className="rounded-xl hover:bg-emerald-100 hover:border-emerald-300 py-3"
                          >
                            +₹{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                      <p className="text-sm text-red-800 font-medium">🔒 Admin Privileges:</p>
                      <ul className="text-sm text-red-700 mt-2 space-y-1">
                        <li>• Exclusive admin wallet access</li>
                        <li>• Transfer to any user account</li>
                        <li>• Complete transaction control</li>
                        <li>• Separate from user system</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <History className="w-6 h-6 text-blue-600" />
                    Admin Transaction History
                  </CardTitle>
                  <CardDescription>Complete record of admin wallet activity</CardDescription>
                </CardHeader>
                <CardContent>
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
                                <p className="text-xs text-blue-600 font-medium">👤 To: {transaction.recipientName}</p>
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
                  <CardDescription>Create new discount codes for users</CardDescription>
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
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-xl py-3 text-lg font-bold shadow-lg"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Add Discount Code
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-600" />
                    Manage Discount Codes
                  </CardTitle>
                  <CardDescription>View and manage existing discount codes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {codes.map((code) => (
                      <div
                        key={code.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-white to-pink-50"
                      >
                        <div>
                          <p className="font-bold text-lg">{code.code}</p>
                          <p className="text-green-600 font-bold">₹{code.amount} off</p>
                          <p className="text-sm text-gray-500">{code.description}</p>
                          <p className="text-xs text-blue-600">Used {code.usageCount} times</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={code.active ? "default" : "secondary"}>
                            {code.active ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDiscountCode(code.id)}
                            className="rounded-xl"
                          >
                            {code.active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDiscountCode(code.id)}
                            className="rounded-xl hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    Platform Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-bold text-blue-800 mb-2">📊 Today's Performance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-600">Orders</p>
                          <p className="text-2xl font-bold text-blue-800">{mockStats.todayOrders}</p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600">Revenue</p>
                          <p className="text-2xl font-bold text-blue-800">
                            ₹{(mockStats.todayOrders * 250).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h3 className="font-bold text-green-800 mb-2">📈 Growth Metrics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-600">User Growth</span>
                          <span className="font-bold text-green-800">+12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Order Growth</span>
                          <span className="font-bold text-green-800">+8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Revenue Growth</span>
                          <span className="font-bold text-green-800">+15%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <h3 className="font-bold text-emerald-800 mb-2">💰 Admin Wallet Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Current Balance</span>
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
                    Order Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                      <span className="text-yellow-800">🕐 Pending Orders</span>
                      <span className="font-bold text-yellow-800">{mockStats.pendingOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <span className="text-green-800">📦 Completed Orders</span>
                      <span className="font-bold text-green-800">{mockStats.completedOrders}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                      <span className="text-red-800">❌ Cancelled Orders</span>
                      <span className="font-bold text-red-800">{mockStats.cancelledOrders}</span>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h3 className="font-bold text-purple-800 mb-2">🎯 Success Rate</h3>
                      <div className="text-3xl font-bold text-purple-800">
                        {(
                          (mockStats.completedOrders / (mockStats.completedOrders + mockStats.cancelledOrders)) *
                          100
                        ).toFixed(1)}
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
