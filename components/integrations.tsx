import { 
  MessageSquare, 
  CreditCard, 
  Mail, 
  BarChart3, 
  Zap,
  Facebook,
  Instagram,
  DollarSign,
  PlugZap,
  Plus,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function Integrations() {
  const integrations = [
    { 
      name: "Facebook", 
      icon: Facebook,
      category: "Social Media",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Sync customer data and run targeted campaigns"
    },
    { 
      name: "Instagram", 
      icon: Instagram,
      category: "Social Media",
      color: "bg-pink-50",
      iconColor: "text-pink-600",
      description: "Connect your Instagram shop and tag products"
    },
    { 
      name: "WhatsApp", 
      icon: MessageSquare,
      category: "Messaging",
      color: "bg-green-50",
      iconColor: "text-green-600",
      description: "Send order updates and customer support messages"
    },
    { 
      name: "Stripe", 
      icon: CreditCard,
      category: "Payments",
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      description: "Secure payment processing with multiple currencies"
    },
    { 
      name: "PayPal", 
      icon: DollarSign,
      category: "Payments",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Accept PayPal and credit card payments"
    },
    { 
      name: "Mailchimp", 
      icon: Mail,
      category: "Marketing",
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
      description: "Email marketing automation and segmentation"
    },
    { 
      name: "Google Analytics", 
      icon: BarChart3,
      category: "Analytics",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "Track store performance and customer behavior"
    },
    { 
      name: "Zapier", 
      icon: Zap,
      category: "Automation",
      color: "bg-red-50",
      iconColor: "text-red-600",
      description: "Connect with 5000+ apps and automate workflows"
    },
  ]

  const categories = ["All", "Payments", "Social Media", "Marketing", "Analytics", "Automation"]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold mb-6">
            <PlugZap className="w-4 h-4" />
            Seamless Integration
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Connect with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"> 500+ Tools</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Extend your store's capabilities with powerful integrations for payments, marketing, analytics, and more
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  category === "All" 
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:text-purple-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {integration.category}
                </span>
              </div>
              
              {/* Icon Container */}
              <div className={`${integration.color} rounded-2xl p-4 inline-flex mb-6`}>
                <integration.icon className={`w-8 h-8 ${integration.iconColor}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                {integration.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {integration.description}
              </p>
              
              {/* Status & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Active
                </div>
                <div className="text-purple-600 font-medium text-sm group-hover:underline">
                  Configure
                </div>
              </div>
              
              {/* Hover Background Pattern */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
          
          {/* Add More Card */}
          <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:from-purple-100 group-hover:to-violet-100 transition-colors duration-300">
                <Plus className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">View All Integrations</h3>
              <p className="text-gray-600 text-sm mb-6">
                Explore 500+ additional integrations and plugins
              </p>
              <div className="inline-flex items-center text-purple-600 font-medium text-sm">
                <span>Browse Directory</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">One-Click Setup</h4>
            <p className="text-gray-600">Connect your favorite tools instantly with pre-built integrations</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl mb-6">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Real-Time Sync</h4>
            <p className="text-gray-600">Keep data synchronized across all your platforms automatically</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl mb-6">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Enterprise Security</h4>
            <p className="text-gray-600">Bank-level security for all data transfers and API connections</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Start Integrating Today
          </h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Connect your tools and unlock powerful workflows in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Explore All Integrations
            </button>
            <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
              Contact Sales
            </button>
          </div>
          <p className="text-purple-200 text-sm mt-8">
            No coding required • 24/7 support • 14-day free trial
          </p>
        </div>
      </div>
    </section>
  )
}