"use client"

export function LogoMarquee() {
  const items = [
    { logo: "/logos/ce.png", alt: "community edition", url: "https://github.com/LF-Decentralized-Trust-labs/gitmesh" },
    { logo: "/logos/ee.png", alt: "enterprise edition", url: "https://alveoli.app" },
  ]

  return (
    <div className="overflow-hidden">
      <div className="relative overflow-hidden bg-black py-16 -rotate-[5deg] mt-32 mb-16 min-w-[120vw] -mx-[10vw] left-0">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {[...items, ...items, ...items, ...items].map((item, index) => (
            <img
              key={index}
              src={item.logo || "/placeholder.svg"}
              alt={item.alt}
              className="h-18 w-auto cursor-pointer"
              onClick={() => window.open(item.url, '_blank')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
