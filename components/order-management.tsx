export default function OrderManagement() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              Order Management
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 text-balance">
              Streamlined Order Management System
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-pretty">
              Track, manage, and fulfill orders seamlessly. Get real-time updates, manage inventory, and keep your
              customers happy with our powerful order management tools.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time order tracking",
                "Automated inventory management",
                "Multi-channel order sync",
                "Custom fulfillment workflows",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Order Management Dashboard"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
