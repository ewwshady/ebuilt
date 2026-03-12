export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Restaurant Owner",
      content: "eBuilt transformed how we manage orders. Our efficiency increased by 40% in the first month!",
      avatar: "professional woman",
    },
    {
      name: "Michael Chen",
      role: "E-commerce Manager",
      content: "The multi-tenant features are exactly what we needed. Managing multiple stores has never been easier.",
      avatar: "professional man",
    },
    {
      name: "Emily Rodriguez",
      role: "Fashion Boutique",
      content: "Beautiful templates and powerful tools. We launched our online store in just 2 days!",
      avatar: "professional woman 2",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-purple-600">Customers</span> Say About Us
          </h2>
          <p className="text-lg text-gray-600">Join thousands of satisfied customers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
