"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MapPin, Camera, Save, Edit3, Shield, Bell, Heart, Star, Gift } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/header"
import Link from "next/link"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
      country: user?.address?.country || "India",
    },
  })
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center animate-fade-in-up">
            <div className="text-8xl mb-6">🔐</div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Please login to access your profile
            </h2>
            <p className="text-gray-600 mb-8 text-lg">Sign in to view and edit your profile information!</p>
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewImage(result)
        setProfileData({ ...profileData, profilePicture: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    updateProfile({
      name: profileData.name,
      phone: profileData.phone,
      profilePicture: profileData.profilePicture,
      address: profileData.address,
    })
    setIsEditing(false)
    alert("Profile updated successfully! 🎉")
  }

  const handleCancel = () => {
    setProfileData({
      name: user.name,
      phone: user.phone || "",
      email: user.email,
      profilePicture: user.profilePicture || "",
      address: user.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
    })
    setPreviewImage(user.profilePicture || "")
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          👤 My Profile
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 rounded-2xl shadow-xl animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Picture */}
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                    <AvatarImage src={previewImage || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
                  <p className="text-gray-600 text-lg mb-4">{user.email}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                      <Gift className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-bold">₹{user.walletBalance} Wallet</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-700 font-bold">Premium Member</span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex gap-3">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="bg-transparent border-2 border-gray-300 hover:bg-gray-100 rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="bg-white shadow-lg rounded-xl p-1 w-full">
              <TabsTrigger value="personal" className="rounded-lg flex-1">
                <User className="w-4 h-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="address" className="rounded-lg flex-1">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-lg flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg flex-1">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl shadow-xl animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-lg font-medium">
                        👤 Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-lg font-medium">
                        📞 Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email" className="text-lg font-medium">
                        📧 Email Address
                      </Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        disabled
                        className="mt-2 border-2 border-gray-200 bg-gray-100 rounded-xl"
                      />
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card className="bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-2xl shadow-xl animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="street" className="text-lg font-medium">
                        🏠 Street Address
                      </Label>
                      <Textarea
                        id="street"
                        value={profileData.address.street}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: { ...profileData.address, street: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                        placeholder="Enter your complete street address..."
                        className="mt-2 border-2 border-green-200 focus:border-green-400 rounded-xl"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="city" className="text-lg font-medium">
                          🏙️ City
                        </Label>
                        <Input
                          id="city"
                          value={profileData.address.city}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: { ...profileData.address, city: e.target.value },
                            })
                          }
                          disabled={!isEditing}
                          className="mt-2 border-2 border-green-200 focus:border-green-400 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-lg font-medium">
                          🗺️ State
                        </Label>
                        <Input
                          id="state"
                          value={profileData.address.state}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: { ...profileData.address, state: e.target.value },
                            })
                          }
                          disabled={!isEditing}
                          className="mt-2 border-2 border-green-200 focus:border-green-400 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode" className="text-lg font-medium">
                          📮 PIN Code
                        </Label>
                        <Input
                          id="pincode"
                          value={profileData.address.pincode}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: { ...profileData.address, pincode: e.target.value },
                            })
                          }
                          disabled={!isEditing}
                          className="mt-2 border-2 border-green-200 focus:border-green-400 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-lg font-medium">
                          🌍 Country
                        </Label>
                        <Input
                          id="country"
                          value={profileData.address.country}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: { ...profileData.address, country: e.target.value },
                            })
                          }
                          disabled={!isEditing}
                          className="mt-2 border-2 border-green-200 focus:border-green-400 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="bg-gradient-to-br from-white to-pink-50 border-2 border-pink-100 rounded-2xl shadow-xl animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Heart className="w-6 h-6 text-pink-600" />
                    Food Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl">
                      <h3 className="text-lg font-bold text-green-800 mb-3">🌱 Dietary Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                          <span className="text-green-700">Vegetarian</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                          <span className="text-green-700">Vegan</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                          <span className="text-green-700">Gluten-Free</span>
                        </label>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                      <h3 className="text-lg font-bold text-orange-800 mb-3">🌶️ Spice Level</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="radio" name="spice" className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-700">Mild</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="radio" name="spice" className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-700">Medium</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="radio" name="spice" className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-700">Spicy</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 rounded-2xl shadow-xl animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl">
                      <h3 className="text-lg font-bold text-blue-800 mb-3">🔐 Password</h3>
                      <p className="text-blue-700 text-sm mb-4">Last changed: Never</p>
                      <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">Change Password</Button>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl">
                      <h3 className="text-lg font-bold text-green-800 mb-3">📱 Two-Factor Auth</h3>
                      <p className="text-green-700 text-sm mb-4">Status: Disabled</p>
                      <Button className="bg-green-600 hover:bg-green-700 rounded-xl">Enable 2FA</Button>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Bell className="w-6 h-6 text-orange-600" />
                      <h3 className="text-lg font-bold text-orange-800">🔔 Notification Settings</h3>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-orange-700">Order Updates</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-orange-700">Promotional Offers</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-orange-700">New Menu Items</span>
                        <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="mt-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl shadow-xl animate-fade-in-up animation-delay-400">
            <CardHeader>
              <CardTitle className="text-2xl text-center">⚡ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/orders">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl py-4 text-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                    📦 My Orders
                  </Button>
                </Link>
                <Link href="/wallet">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl py-4 text-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                    💰 My Wallet
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl py-4 text-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                    📞 Support
                  </Button>
                </Link>
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
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  )
}
