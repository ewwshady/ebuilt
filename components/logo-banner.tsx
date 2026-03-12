export default function LogoBanner() {
  const logos = [
    { name: "Zeblaze", src: "https://www.blanxer.com/Tbil/zeblaze.png", width: 120 },
    { name: "Nuelyte", src: "https://www.blanxer.com/Tbil/nuelyte.png", width: 120 },
    { name: "Ingco", src: "https://www.blanxer.com/Tbil/ingco.png", width: 110 },
    { name: "Kamakhya", src: "https://www.blanxer.com/Tbil/kamakhya.png", width: 130 },
    { name: "MPLuxury", src: "https://www.blanxer.com/Tbil/mpluxury.png", width: 120 },
  ]

  return (
    <section className="py-12 border-y border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wide">
          Trusted by leading companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-80">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="grayscale hover:grayscale-0 transition-all flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-10 object-contain"
                style={{ width: logo.width }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
