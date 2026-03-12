import { 
  Palette, 
  Truck, 
  Smartphone, 
  Plug, 
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      title: "Customize Your Website",
      description: "Build a stunning website with our drag-and-drop builder. No coding required.",
      icon: Palette,
      points: [
       
        "professionally designed templates",
        "Custom color schemes & fonts",
        "Mobile-responsive design"
      ]
    },
    {
      title: "Setup Delivery Charges",
      description: "Configure flexible delivery zones and pricing for your business.",
      icon: Truck,
      points: [
        "Dynamic zone-based pricing",
        
        "Scheduled delivery options",
        "Multiple carrier integration"
      ]
    },
    {
      title: "Streamline Your Devices",
      description: "Manage your business from anywhere with mobile, tablet, and desktop apps.",
      icon: Smartphone,
      points: [
        "Cross-platform compatibility",
        "Real-time sync across devices",
        "Offline mode support",
        "Touch-optimized interfaces"
      ]
    },
    {
      title: "One Click Plug-ins",
      description: "Extend functionality with powerful integrations and plugins.",
      icon: Plug,
      points: [
        "Payment gateway integration",
        "Email marketing tools",
        "Analytics & reporting",
        "Inventory management"
      ]
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"> Scale Your Business</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools designed to help you build, manage, and grow your online presence
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full">
                {/* Icon Container */}
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-violet-600 blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-full"></div>
                    <feature.icon className="relative w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Feature Points */}
                  <ul className="space-y-3 mb-8">
                    {feature.points?.map((point, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Link */}
                  <div className="inline-flex items-center text-purple-600 font-semibold text-sm group/link cursor-pointer">
                    <span className="group-hover/link:underline">Learn more about this feature</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <feature.icon className="w-full h-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">99.9%</div>
              <p className="text-gray-600 text-sm font-medium">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">24/7</div>
              <p className="text-gray-600 text-sm font-medium">Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">100+</div>
              <p className="text-gray-600 text-sm font-medium">Integrations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">10K+</div>
              <p className="text-gray-600 text-sm font-medium">Active Stores</p>
            </div>
          </div>
        </div> */}

        {/* Bottom CTA */}
        {/* <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-6 items-center bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 sm:p-10">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to transform your business?</h3>
              <p className="text-gray-600">Join thousands of successful store owners</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Start Free Trial
              </button>
              <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                View All Features
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}