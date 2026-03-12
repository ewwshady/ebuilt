"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How do I get started with eBuilt?",
      answer:
        "Getting started is easy! Sign up for a free account, follow our onboarding wizard, and you can have your online store live in minutes.",
    },
    {
      question: "What payment methods do you support?",
      answer:
        "We support all major payment gateways including Stripe, PayPal, Square, and many more. You can enable multiple payment methods for your customers.",
    },
    {
      question: "Can I use my own domain name?",
      answer:
        "Yes! You can connect your custom domain to your eBuilt store. We provide step-by-step instructions to help you set it up.",
    },
    {
      question: "Is there a limit on products or orders?",
      answer:
        "No limits! All our plans offer unlimited products and orders. You only pay based on the features and support level you need.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "We offer 24/7 customer support via email, chat, and phone. Premium plans include dedicated account managers and priority support.",
    },
    {
      question: "Can I migrate from another platform?",
      answer:
        "We offer free migration assistance to help you move your products, customers, and data from other platforms.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">FAQ's</h2>
          <p className="text-lg text-gray-600">Everything you need to know about eBuilt</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="text-purple-600 font-semibold hover:underline">Contact our support team →</button>
        </div>
      </div>
    </section>
  )
}
