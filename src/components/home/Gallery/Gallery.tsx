// GallerySection.tsx – SolidJS + TailwindCSS + daisyUI + Embla Carousel
// Robust, mobile‑first gallery powered by embla-carousel-solid (≈6 KB gzipped).
// Accessible, performant and extensible.
// Install:  pnpm add embla-carousel-solid embla-carousel-autoplay
// Optional: pnpm add embla-carousel-aria  (adds full WAI‑ARIA spec compliance)

import type { Component } from "solid-js";
import createEmblaCarousel from "embla-carousel-solid";
import Autoplay from "embla-carousel-autoplay";
// import createEmblaAria from "embla-carousel-aria"; // if you need full ARIA plugin

export interface GalleryItem {
  mediaSrc: string;
  isVideo?: boolean;
  alt: string;
  caption: string;
  description: string;
  link: string;
}

interface GallerySectionProps {
  items: GalleryItem[];
  heading?: string;
}

const GallerySection: Component<GallerySectionProps> = (props) => {
  /* 1️⃣  set up Embla with options + plugins */
  const [emblaRef] = createEmblaCarousel(
    // options – one slide per view on mobile, three on ≥1024px
    () => ({
      align: "start",
      loop: true,
      slidesToScroll: 1,
      breakpoints: {
        1024: { slidesToScroll: 1 },
      },
    }),
    () => [Autoplay({ delay: 1800, stopOnInteraction: false })]
    // add createEmblaAria() here for accessibility
  );

  return (
    <section
      class="py-16 bg-base-200"
      role="region"
      aria-labelledby="gallery-heading"
    >
      <div class="container mx-auto px-6">
        <h2
          id="gallery-heading"
          class="text-3xl lg:text-5xl font-bold text-center mb-12"
        >
          {props.heading ?? "Nuestro Trabajo"}
        </h2>

        {/* Embla viewport */}
        <div class="embla overflow-hidden" ref={emblaRef}>
          {/* Embla container */}
          <div class="embla__container flex">
            {props.items.map((item) => (
              <div class="embla__slide min-w-full lg:min-w-[33%] pr-6">
                <figure class="relative rounded-box overflow-hidden shadow-lg">
                  {item.isVideo ? (
                    <video
                      src={item.mediaSrc}
                      autoplay
                      muted
                      loop
                      playsinline
                      class="w-full h-60 lg:h-64 object-cover"
                    ></video>
                  ) : (
                    <img
                      src={item.mediaSrc}
                      alt={item.alt}
                      loading="lazy"
                      class="w-full h-60 lg:h-64 object-cover"
                    />
                  )}
                  <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-base-100 space-y-2">
                    <h3 class="font-semibold text-lg lg:text-xl">
                      {item.caption}
                    </h3>
                    <p class="text-sm lg:text-base line-clamp-2">
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      class="btn btn-primary btn-sm lg:btn-md"
                    >
                      Ver detalle
                    </a>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
