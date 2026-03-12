export default function BranchGrowth() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Branch</span>{" "}
            Growing with eBuilt
          </h2>
          <p className="text-lg text-gray-300">See how businesses are thriving with our platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <img
                src={`/placeholder.svg?height=200&width=300&query=ecommerce product showcase ${item}`}
                alt={`Product ${item}`}
                className="w-full rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Featured Store {item}</h3>
              <p className="text-gray-300">Discover how they're growing their business with eBuilt</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mt-16 text-center">
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
              450k+
            </div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
              98.5%
            </div>
            <div className="text-gray-300">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-gray-300">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
