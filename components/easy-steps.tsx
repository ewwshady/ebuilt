export default function EasySteps() {
  const steps = [
    { number: 1, title: "Sign Up", description: "Create your account in seconds" },
    { number: 2, title: "Customize", description: "Personalize your storefront" },
    { number: 3, title: "Add Products", description: "Upload your inventory" },
    { number: 4, title: "Set Pricing", description: "Configure your pricing strategy" },
    { number: 5, title: "Go Live", description: "Launch your online store" },
    { number: 6, title: "Grow", description: "Scale your business with insights" },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
            Simple Setup Process
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Launch Your Store in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600"> 6 Simple Steps</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get your online business up and running in minutes with our intuitive setup process
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-purple-100 via-purple-300 to-violet-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="group relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  {/* Step number with gradient */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">{step.number}</span>
                  </div>
                  
                  {/* Step indicator line */}
                  <div className="absolute top-8 -right-4 w-4 h-0.5 bg-gradient-to-r from-purple-200 to-violet-200 lg:hidden"></div>
                  
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Hover arrow */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="inline-flex items-center text-purple-600 font-semibold text-sm">
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Connector dots for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-6 w-12 h-12">
                    <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}