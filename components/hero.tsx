import { Button } from "@/components/ui/button"
import { 
  Palette, 
  Truck, 
  Smartphone, 
  Plug, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Shield,
  Rocket,
  Target,
  Users,
  Clock,
  Globe,
  Settings,
  MessageSquare,
  CreditCard,
  Mail,
  Facebook,
  Instagram,
  DollarSign,
  PlugZap,
  Plus,
  Star,
  TrendingUp,
  BarChart,
  PieChart,
  Smartphone as Phone,
  Mail as Email,
  Palette as Design,
  ShoppingCart,
  Headphones,
  Cloud
} from 'lucide-react'
export default function Hero() {
  return (
   
       <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-violet-50 -z-10"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            All-in-One Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 block">
              Grow Your Business
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Comprehensive tools designed to help you build, manage, and scale your online presence with ease
          </p>
          
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Schedule Demo
            </button>
          </div> */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">99.9%</div>
            <p className="text-gray-600 text-sm">Uptime Guarantee</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
            <p className="text-gray-600 text-sm">Customer Support</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
            <p className="text-gray-600 text-sm">Integrations</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
            <p className="text-gray-600 text-sm">Happy Stores</p>
          </div>
        </div>
      </div>
<br></br>

        {/* Dashboard Images */}
        {/* <div className="relative w-full flex justify-center items-center">
          <img
            src="https://www.blanxer.com/images/dashboard-ui.png"
            alt="Dashboard"
            className="w-full max-w-5xl rounded-2xl shadow-2xl z-10"
          /> */}
          {/* Mobile overlay */}
          {/* <img
            src="https://www.blanxer.com/images/dashboard-ui.png"
            alt="Mobile View"
            className="absolute -bottom-8 right-1/4 w-48 sm:w-56 md:w-64 rounded-xl shadow-lg z-20"
          />
        </div> */}

    </section>

    //  <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-purple-50 to-purple-100">
    //   {/* Background gradient circle */}
    //   <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-violet-600/30 rounded-full blur-3xl" />

    //   <div className="container mx-auto relative text-center">
    //     {/* Heading */}
    //     <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4">
    //       <span className="text-purple-600">Launch</span> your online business
    //     </h1>
    //     <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
    //       within a few minutes
    //     </h1>

    //     {/* Description */}
    //     <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
    //       Build and manage your business website with eBuilt.
    //     </p>

    //     {/* Buttons */}
    //     <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
    //       <Button size="lg" className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">
    //         Contact Us at WhatsApp
    //       </Button>
    //       <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
    //         Start your 15 day free trial
    //       </Button>
    //     </div>

    //     {/* Dashboard Images */}
    //     <div className="relative w-full flex justify-center items-center">
    //       <img
    //         src="https://www.blanxer.com/images/dashboard-ui.png"
    //         alt="Dashboard"
    //         className="w-full max-w-5xl rounded-2xl shadow-2xl z-10"
    //       />
    //       {/* Mobile overlay */}
    //       <img
    //         src="https://www.blanxer.com/images/dashboard-ui.png"
    //         alt="Mobile View"
    //         className="absolute -bottom-8 right-1/4 w-48 sm:w-56 md:w-64 rounded-xl shadow-lg z-20"
    //       />
    //     </div>
    //   </div>
    // </section>
  )
}
