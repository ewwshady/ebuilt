import EasySteps from "@/components/easy-steps"
import Features from "@/components/features"
import SalesMetrics from "@/components/sales-metrics"
import Integrations from "@/components/integrations"
// import BranchGrowth from "@/components/branch-growth"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
// import LogoBanner from "@/components/logo-banner"
import BusinessCards from "@/components/business-cards"
// import OrderManagement from "@/components/order-management"


export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      {/* <LogoBanner /> */}
      <BusinessCards />
      {/* <OrderManagement /> */}
      <EasySteps />
      <Features />
      {/* <SalesMetrics /> */}
      {/* <Integrations /> */}
      {/* <BranchGrowth /> */}
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}