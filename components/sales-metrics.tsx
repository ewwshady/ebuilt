export default function SalesMetrics() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              eBuilt Increases
            </span>{" "}
            your Sales
          </h2>
          <p className="text-lg text-gray-600">Powerful analytics and insights to grow your revenue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Growth</h3>
            <img src="/placeholder.svg?height=300&width=500" alt="Revenue Analytics" className="w-full rounded-lg" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Insights</h3>
            <img src="/placeholder.svg?height=300&width=500" alt="Customer Insights" className="w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
