"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Heart, Clock, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

const foodItems = [
  {
    id: 1,
    name: "Chicken Biryani",
    price: 299,
    image: "https://j6e2i8c9.delivery.rocketcdn.me/wp-content/uploads/2020/09/Chicken-Biryani-Recipe-01-1.jpg",
    rating: 4.8,
    category: "biryani",
    description: "Aromatic basmati rice with tender chicken pieces and traditional spices",
    cookTime: "45 min",
    isVeg: false,
  },
  {
    id: 2,
    name: "Mutton Biryani",
    price: 399,
    image: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop",
    rating: 4.9,
    category: "biryani",
    description: "Rich and flavorful mutton biryani with perfectly cooked rice",
    cookTime: "60 min",
    isVeg: false,
  },
  {
    id: 3,
    name: "Veg Biryani",
    price: 199,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
    rating: 4.5,
    category: "biryani",
    description: "Delicious vegetarian biryani with mixed vegetables and aromatic spices",
    cookTime: "40 min",
    isVeg: true,
  },
  {
    id: 4,
    name: "Margherita Pizza",
    price: 249,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    rating: 4.5,
    category: "pizza",
    description: "Classic pizza with fresh tomato sauce, mozzarella cheese, and basil",
    cookTime: "25 min",
    isVeg: true,
  },
  {
    id: 5,
    name: "Pepperoni Pizza",
    price: 329,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    rating: 4.7,
    category: "pizza",
    description: "Loaded with pepperoni slices and melted mozzarella cheese",
    cookTime: "30 min",
    isVeg: false,
  },
  {
    id: 6,
    name: "Paneer Makhani",
    price: 229,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
    rating: 4.6,
    category: "curry",
    description: "Rich and creamy paneer curry in tomato-based gravy",
    cookTime: "30 min",
    isVeg: true,
  },
  {
    id: 7,
    name: "Butter Chicken",
    price: 279,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    rating: 4.8,
    category: "curry",
    description: "Tender chicken in rich, creamy tomato-butter sauce",
    cookTime: "35 min",
    isVeg: false,
  },
  {
    id: 8,
    name: "Odia Thali",
    price: 199,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    rating: 4.7,
    category: "thali",
    description: "Traditional Odia meal with rice, dal, vegetables, and fish curry",
    cookTime: "20 min",
    isVeg: false,
  },
  {
    id: 9,
    name: "Gujarati Thali",
    price: 179,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    rating: 4.4,
    category: "thali",
    description: "Complete vegetarian thali with variety of Gujarati dishes",
    cookTime: "15 min",
    isVeg: true,
  },
  {
    id: 10,
    name: "Rasgulla",
    price: 89,
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
    rating: 4.9,
    category: "sweets",
    description: "Soft and spongy cottage cheese balls in sugar syrup",
    cookTime: "5 min",
    isVeg: true,
  },
  {
    id: 11,
    name: "Gulab Jamun",
    price: 79,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    rating: 4.8,
    category: "sweets",
    description: "Deep-fried milk solids soaked in rose-flavored sugar syrup",
    cookTime: "5 min",
    isVeg: true,
  },
  {
    id: 12,
    name: "Samosa",
    price: 49,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    rating: 4.3,
    category: "snacks",
    description: "Crispy triangular pastry filled with spiced potatoes and peas",
    cookTime: "10 min",
    isVeg: true,
  },
]

const categories = [
  { id: "all", name: "All Items", icon: "🍽️" },
  { id: "biryani", name: "Biryani", icon: "🍛" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "curry", name: "Curry", icon: "🍛" },
  { id: "thali", name: "Thali", icon: "🍽️" },
  { id: "sweets", name: "Sweets", icon: "🍬" },
  { id: "snacks", name: "Snacks", icon: "🥪" },
]

export default function CategoriesPage() {
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterVeg, setFilterVeg] = useState("all")

  const filteredItems = foodItems
    .filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesVegFilter = filterVeg === "all" || (filterVeg === "veg" ? item.isVeg : !item.isVeg)
      return matchesCategory && matchesSearch && matchesVegFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600">Discover delicious food from the best restaurants</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterVeg} onValueChange={setFilterVeg}>
              <SelectTrigger className="w-full md:w-48 border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-2 ${selectedCategory === category.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  : "border-orange-200 hover:bg-orange-50"
                  }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={item.isVeg ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                    {item.isVeg ? "🌱 Veg" : "🍖 Non-Veg"}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{item.cookTime}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-green-500 text-green-500" />
                    <span className="text-sm font-bold text-green-700">{item.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full px-4 font-bold"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
