// Firebase Setup Script
// Run this script to initialize your Firebase project structure

const admin = require("firebase-admin")

// Initialize Firebase Admin (you'll need to add your service account key)
const serviceAccount = require("./path-to-your-service-account-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
})

const db = admin.firestore()

async function setupFirebaseCollections() {
  try {
    console.log("Setting up Firebase collections...")

    // Create admin user
    const adminData = {
      name: "Admin",
      email: "admin@kalingamart.com",
      role: "admin",
      walletBalance: 50000,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    }

    await db.collection("admins").doc("admin_001").set(adminData)
    console.log("✅ Admin user created")

    // Create sample products
    const products = [
      {
        name: "Chicken Biryani",
        price: 299,
        category: "biryani",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop",
        description: "Aromatic basmati rice with tender chicken pieces",
        rating: 4.5,
        stock: 50,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: "Paneer Makhani",
        price: 229,
        category: "curry",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop",
        description: "Rich and creamy paneer curry",
        rating: 4.4,
        stock: 30,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: "Margherita Pizza",
        price: 249,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
        description: "Classic pizza with fresh tomato sauce and mozzarella",
        rating: 4.3,
        stock: 25,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ]

    for (const product of products) {
      await db.collection("products").add(product)
    }
    console.log("✅ Sample products created")

    // Create sample discount codes
    const discountCodes = [
      {
        code: "WOWGANDHI",
        amount: 30,
        description: "Special Gandhi discount",
        active: true,
        usageCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        code: "NEWUSER",
        amount: 10,
        description: "New user discount",
        active: true,
        usageCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ]

    for (const code of discountCodes) {
      await db.collection("discountCodes").add(code)
    }
    console.log("✅ Sample discount codes created")

    console.log("🎉 Firebase setup completed successfully!")
  } catch (error) {
    console.error("❌ Error setting up Firebase:", error)
  }
}

setupFirebaseCollections()
