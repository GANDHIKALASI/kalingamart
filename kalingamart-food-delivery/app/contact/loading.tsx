export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-orange-800 mb-2">Loading Contact</h2>
        <p className="text-orange-600">Getting our contact information ready...</p>
      </div>
    </div>
  )
}
