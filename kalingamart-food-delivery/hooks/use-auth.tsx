"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  walletBalance: number
  profilePicture?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
}

interface WalletTransaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  orderId?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>
  logout: () => void
  updateWalletBalance: (amount: number, description: string, orderId?: string) => void
  getWalletTransactions: () => WalletTransaction[]
  addWalletFunds: (amount: number, description: string) => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([])

  // Load user and transactions from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("kalingamart-user")
    const savedTransactions = localStorage.getItem("kalingamart-wallet-transactions")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedTransactions) {
      setWalletTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("kalingamart-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("kalingamart-user")
    }
  }, [user])

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("kalingamart-wallet-transactions", JSON.stringify(walletTransactions))
  }, [walletTransactions])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would call Firebase Auth
    if (email && password) {
      const userId = email.split("@")[0] + "_" + Date.now()
      const mockUser: User = {
        id: userId,
        name: email.split("@")[0],
        email,
        walletBalance: 50, // Welcome bonus
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      }

      setUser(mockUser)

      // Add welcome bonus transaction for new user
      const welcomeTransaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        type: "credit",
        amount: 50,
        description: "Welcome bonus",
        date: new Date().toISOString().split("T")[0],
      }

      setWalletTransactions([welcomeTransaction])

      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock signup - in real app, this would call Firebase Auth
    if (name && email && password) {
      const userId = name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now()
      const mockUser: User = {
        id: userId,
        name,
        email,
        phone,
        walletBalance: 50, // Welcome bonus
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      }

      setUser(mockUser)

      // Add welcome bonus transaction for new user
      const welcomeTransaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        type: "credit",
        amount: 50,
        description: "Welcome bonus",
        date: new Date().toISOString().split("T")[0],
      }

      setWalletTransactions([welcomeTransaction])

      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setWalletTransactions([])
  }

  const updateWalletBalance = (amount: number, description: string, orderId?: string) => {
    if (user) {
      const newBalance = user.walletBalance + amount
      setUser({ ...user, walletBalance: newBalance })

      // Add transaction record
      const transaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        type: amount > 0 ? "credit" : "debit",
        amount: Math.abs(amount),
        description,
        date: new Date().toISOString().split("T")[0],
        orderId,
      }

      setWalletTransactions((prev) => [transaction, ...prev])
    }
  }

  const addWalletFunds = (amount: number, description: string) => {
    if (user) {
      const newBalance = user.walletBalance + amount
      setUser({ ...user, walletBalance: newBalance })

      // Add credit transaction
      const transaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        type: "credit",
        amount,
        description,
        date: new Date().toISOString().split("T")[0],
      }

      setWalletTransactions((prev) => [transaction, ...prev])
    }
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const getWalletTransactions = (): WalletTransaction[] => {
    return walletTransactions
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateWalletBalance,
        getWalletTransactions,
        addWalletFunds,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
