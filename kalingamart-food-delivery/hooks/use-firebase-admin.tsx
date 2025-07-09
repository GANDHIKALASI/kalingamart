"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  adminOperations,
  userOperations,
  orderOperations,
  productOperations,
  discountOperations,
} from "@/lib/firebase-admin"

interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin"
  walletBalance: number
}

interface FirebaseAdminContextType {
  admin: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  transferToUser: (userId: string, userName: string, amount: number, description?: string) => Promise<boolean>
  addAdminFunds: (amount: number, description: string) => Promise<void>
  getAdminTransactions: () => Promise<any[]>
  getAllUsers: () => Promise<any[]>
  getAllOrders: () => Promise<any[]>
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
  getAllProducts: () => Promise<any[]>
  addProduct: (productData: any) => Promise<string>
  updateProduct: (productId: string, productData: any) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
  getAllDiscountCodes: () => Promise<any[]>
  addDiscountCode: (discountData: any) => Promise<string>
  updateDiscountCode: (discountId: string, discountData: any) => Promise<void>
  deleteDiscountCode: (discountId: string) => Promise<void>
}

const FirebaseAdminContext = createContext<FirebaseAdminContextType | undefined>(undefined)

export function FirebaseAdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // Check if user is admin and get admin profile
        const adminProfile = await adminOperations.getAdminProfile(user.uid)
        if (adminProfile) {
          setAdmin({
            id: user.uid,
            email: user.email!,
            name: adminProfile.name || "Admin",
            role: "admin",
            walletBalance: adminProfile.walletBalance || 50000,
          })
        } else {
          // If user exists but not in admins collection, sign them out
          await signOut(auth)
          setAdmin(null)
        }
      } else {
        setAdmin(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if user is admin
      const adminProfile = await adminOperations.getAdminProfile(user.uid)
      if (!adminProfile) {
        await signOut(auth)
        return false
      }

      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      setAdmin(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const transferToUser = async (
    userId: string,
    userName: string,
    amount: number,
    description?: string,
  ): Promise<boolean> => {
    if (!admin || amount <= 0 || amount > admin.walletBalance) {
      return false
    }

    const success = await adminOperations.transferToUser(
      admin.id,
      userId,
      amount,
      description || `Transfer to ${userName}`,
    )

    if (success) {
      // Update local admin state
      setAdmin((prev) => (prev ? { ...prev, walletBalance: prev.walletBalance - amount } : null))
    }

    return success
  }

  const addAdminFunds = async (amount: number, description: string): Promise<void> => {
    if (!admin) return

    await adminOperations.updateAdminWallet(admin.id, amount, description)
    setAdmin((prev) => (prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null))
  }

  const getAdminTransactions = async (): Promise<any[]> => {
    if (!admin) return []
    return await adminOperations.getAdminTransactions(admin.id)
  }

  const getAllUsers = async (): Promise<any[]> => {
    return await userOperations.getAllUsers()
  }

  const getAllOrders = async (): Promise<any[]> => {
    return await orderOperations.getAllOrders()
  }

  const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
    await orderOperations.updateOrderStatus(orderId, status)
  }

  const getAllProducts = async (): Promise<any[]> => {
    return await productOperations.getAllProducts()
  }

  const addProduct = async (productData: any): Promise<string> => {
    return await productOperations.addProduct(productData)
  }

  const updateProduct = async (productId: string, productData: any): Promise<void> => {
    await productOperations.updateProduct(productId, productData)
  }

  const deleteProduct = async (productId: string): Promise<void> => {
    await productOperations.deleteProduct(productId)
  }

  const getAllDiscountCodes = async (): Promise<any[]> => {
    return await discountOperations.getAllDiscountCodes()
  }

  const addDiscountCode = async (discountData: any): Promise<string> => {
    return await discountOperations.addDiscountCode(discountData)
  }

  const updateDiscountCode = async (discountId: string, discountData: any): Promise<void> => {
    await discountOperations.updateDiscountCode(discountId, discountData)
  }

  const deleteDiscountCode = async (discountId: string): Promise<void> => {
    await discountOperations.deleteDiscountCode(discountId)
  }

  return (
    <FirebaseAdminContext.Provider
      value={{
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
      }}
    >
      {children}
    </FirebaseAdminContext.Provider>
  )
}

export function useFirebaseAdmin() {
  const context = useContext(FirebaseAdminContext)
  if (context === undefined) {
    throw new Error("useFirebaseAdmin must be used within a FirebaseAdminProvider")
  }
  return context
}
