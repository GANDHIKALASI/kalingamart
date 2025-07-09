import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Admin Operations
export const adminOperations = {
  // Get admin profile
  async getAdminProfile(adminId: string) {
    const adminDoc = await getDoc(doc(db, "admins", adminId))
    return adminDoc.exists() ? { id: adminDoc.id, ...adminDoc.data() } : null
  },

  // Update admin wallet balance
  async updateAdminWallet(adminId: string, amount: number, description: string) {
    const adminRef = doc(db, "admins", adminId)
    await updateDoc(adminRef, {
      walletBalance: increment(amount),
      lastUpdated: serverTimestamp(),
    })

    // Add transaction record
    await addDoc(collection(db, "adminTransactions"), {
      adminId,
      type: amount > 0 ? "credit" : "debit",
      amount: Math.abs(amount),
      description,
      timestamp: serverTimestamp(),
      date: new Date().toISOString().split("T")[0],
    })
  },

  // Transfer money to user
  async transferToUser(adminId: string, userId: string, amount: number, description: string) {
    try {
      // Update admin wallet (deduct)
      const adminRef = doc(db, "admins", adminId)
      await updateDoc(adminRef, {
        walletBalance: increment(-amount),
        lastUpdated: serverTimestamp(),
      })

      // Update user wallet (add)
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        walletBalance: increment(amount),
        lastUpdated: serverTimestamp(),
      })

      // Add admin transaction
      await addDoc(collection(db, "adminTransactions"), {
        adminId,
        type: "debit",
        amount,
        description,
        recipientId: userId,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split("T")[0],
      })

      // Add user transaction
      await addDoc(collection(db, "userTransactions"), {
        userId,
        type: "credit",
        amount,
        description: `Transfer from admin: ${description}`,
        fromAdmin: true,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split("T")[0],
      })

      return true
    } catch (error) {
      console.error("Transfer failed:", error)
      return false
    }
  },

  // Get admin transactions
  async getAdminTransactions(adminId: string) {
    const q = query(
      collection(db, "adminTransactions"),
      where("adminId", "==", adminId),
      orderBy("timestamp", "desc"),
      limit(50),
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },
}

// User Operations
export const userOperations = {
  // Get all users
  async getAllUsers() {
    const snapshot = await getDocs(collection(db, "users"))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  // Get user by ID
  async getUserById(userId: string) {
    const userDoc = await getDoc(doc(db, "users", userId))
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null
  },

  // Create or update user
  async createOrUpdateUser(userId: string, userData: any) {
    await setDoc(
      doc(db, "users", userId),
      {
        ...userData,
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    )
  },

  // Get user transactions
  async getUserTransactions(userId: string) {
    const q = query(
      collection(db, "userTransactions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(50),
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },
}

// Order Operations
export const orderOperations = {
  // Get all orders
  async getAllOrders() {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  // Create order
  async createOrder(orderData: any) {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    await updateDoc(doc(db, "orders", orderId), {
      status,
      lastUpdated: serverTimestamp(),
    })
  },
}

// Product Operations
export const productOperations = {
  // Get all products
  async getAllProducts() {
    const snapshot = await getDocs(collection(db, "products"))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  // Add product
  async addProduct(productData: any) {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
      status: "active",
    })
    return docRef.id
  },

  // Update product
  async updateProduct(productId: string, productData: any) {
    await updateDoc(doc(db, "products", productId), {
      ...productData,
      lastUpdated: serverTimestamp(),
    })
  },

  // Delete product
  async deleteProduct(productId: string) {
    await deleteDoc(doc(db, "products", productId))
  },
}

// Discount Operations
export const discountOperations = {
  // Get all discount codes
  async getAllDiscountCodes() {
    const snapshot = await getDocs(collection(db, "discountCodes"))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  // Add discount code
  async addDiscountCode(discountData: any) {
    const docRef = await addDoc(collection(db, "discountCodes"), {
      ...discountData,
      createdAt: serverTimestamp(),
      usageCount: 0,
      active: true,
    })
    return docRef.id
  },

  // Update discount code
  async updateDiscountCode(discountId: string, discountData: any) {
    await updateDoc(doc(db, "discountCodes", discountId), {
      ...discountData,
      lastUpdated: serverTimestamp(),
    })
  },

  // Delete discount code
  async deleteDiscountCode(discountId: string) {
    await deleteDoc(doc(db, "discountCodes", discountId))
  },
}
