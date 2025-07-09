"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin"
  walletBalance: number
}

interface AdminTransaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  recipientId?: string
  recipientName?: string
}

interface AdminContextType {
  admin: AdminUser | null
  adminTransactions: AdminTransaction[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  transferToUser: (userId: string, userName: string, amount: number, description?: string) => boolean
  addAdminFunds: (amount: number, description: string) => void
  getAdminTransactions: () => AdminTransaction[]
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Admin credentials
const ADMIN_EMAIL = "admin@kalingamart.com"
const ADMIN_PASSWORD = "admin123"

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [adminTransactions, setAdminTransactions] = useState<AdminTransaction[]>([])

  // Load admin data from localStorage on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem("kalingamart-admin")
    const savedTransactions = localStorage.getItem("kalingamart-admin-transactions")

    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
    }

    if (savedTransactions) {
      setAdminTransactions(JSON.parse(savedTransactions))
    } else {
      // Initialize with welcome transaction if no transactions exist
      const initialTransaction: AdminTransaction = {
        id: `txn_initial_${Date.now()}`,
        type: "credit",
        amount: 50000,
        description: "Initial admin wallet balance",
        date: new Date().toISOString().split("T")[0],
      }
      setAdminTransactions([initialTransaction])
    }
  }, [])

  // Save admin to localStorage whenever admin changes
  useEffect(() => {
    if (admin) {
      localStorage.setItem("kalingamart-admin", JSON.stringify(admin))
    } else {
      localStorage.removeItem("kalingamart-admin")
    }
  }, [admin])

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("kalingamart-admin-transactions", JSON.stringify(adminTransactions))
  }, [adminTransactions])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: AdminUser = {
        id: "admin_001",
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        walletBalance: 50000, // ₹50,000 initial balance
      }

      setAdmin(adminUser)
      return true
    }
    return false
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("kalingamart-admin-auth")
  }

  const transferToUser = (userId: string, userName: string, amount: number, description?: string): boolean => {
    if (!admin || amount <= 0 || amount > admin.walletBalance) {
      return false
    }

    // Deduct from admin wallet
    const updatedAdmin = { ...admin, walletBalance: admin.walletBalance - amount }
    setAdmin(updatedAdmin)

    // Add transaction record
    const transaction: AdminTransaction = {
      id: `txn_${Date.now()}`,
      type: "debit",
      amount,
      description: description || `Transfer to ${userName}`,
      date: new Date().toISOString().split("T")[0],
      recipientId: userId,
      recipientName: userName,
    }

    setAdminTransactions((prev) => [transaction, ...prev])

    // Update user's wallet balance in their localStorage
    const savedUsers = localStorage.getItem("kalingamart-users") || "[]"
    const users = JSON.parse(savedUsers)
    const updatedUsers = users.map((user: any) => {
      if (user.id === userId) {
        return { ...user, walletBalance: (user.walletBalance || 0) + amount }
      }
      return user
    })
    localStorage.setItem("kalingamart-users", JSON.stringify(updatedUsers))

    // Also update current user if they're the recipient
    const currentUser = localStorage.getItem("kalingamart-user")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id === userId) {
        user.walletBalance = (user.walletBalance || 0) + amount
        localStorage.setItem("kalingamart-user", JSON.stringify(user))
      }
    }

    return true
  }

  const addAdminFunds = (amount: number, description: string) => {
    if (admin && amount > 0) {
      const updatedAdmin = { ...admin, walletBalance: admin.walletBalance + amount }
      setAdmin(updatedAdmin)

      // Add credit transaction
      const transaction: AdminTransaction = {
        id: `txn_${Date.now()}`,
        type: "credit",
        amount,
        description,
        date: new Date().toISOString().split("T")[0],
      }

      setAdminTransactions((prev) => [transaction, ...prev])
    }
  }

  const getAdminTransactions = (): AdminTransaction[] => {
    return adminTransactions
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        adminTransactions,
        login,
        logout,
        transferToUser,
        addAdminFunds,
        getAdminTransactions,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
