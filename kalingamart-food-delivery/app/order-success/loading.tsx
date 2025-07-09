export default function OrderSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Processing Order</h2>
        <p className="text-green-600">Please wait while we confirm your order...</p>
      </div>
    </div>
  )
}
