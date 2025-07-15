// GallerySection.tsx – SolidJS + TailwindCSS + Embla Carousel
// Carousel infinito robusto siguiendo mejores prácticas
import type { Component } from "solid-js";
import { onMount, onCleanup, createSignal, For } from "solid-js";
import createEmblaCarousel from "embla-carousel-solid";
import Autoplay from "embla-carousel-autoplay";

export interface GalleryItem {
  id: string;
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
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [canScrollPrev, setCanScrollPrev] = createSignal(false);
  const [canScrollNext, setCanScrollNext] = createSignal(false);

  // Configuración optimizada para carousel infinito
  const [emblaRef, emblaApi] = createEmblaCarousel(
    () => ({
      align: "start",
      loop: true,
      skipSnaps: false,
      dragFree: false,
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      duration: 25,
      breakpoints: {
        "(min-width: 640px)": {
          slidesToScroll: 1,
          align: "start",
        },
        "(min-width: 1024px)": {
          slidesToScroll: 1,
          align: "start",
        },
      },
    }),
    () => [
      Autoplay({
        delay: 2500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: true,
      }),
    ]
  );

  // Funciones de navegación
  const scrollPrev = () => emblaApi()?.scrollPrev();
  const scrollNext = () => emblaApi()?.scrollNext();
  const scrollTo = (index: number) => emblaApi()?.scrollTo(index);

  // Manejo de eventos y estado
  const onSelect = () => {
    const api = emblaApi();
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };

  // Inicialización y cleanup
  onMount(() => {
    const api = emblaApi();
    if (!api) return;

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
  });

  onCleanup(() => {
    emblaApi()?.destroy();
  });

  return (
    <section
      class="py-16 lg:py-20 bg-gradient-to-b from-base-100 to-base-200"
      role="region"
      aria-labelledby="gallery-heading"
    >
      <div class="container mx-auto px-4 max-w-7xl">
        {/* Header mejorado */}
        <div class="text-center mb-16">
          <h2
            id="gallery-heading"
            class="text-4xl lg:text-6xl font-bold mb-4 text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            {props.heading ?? "Nuestro Trabajo"}
          </h2>
          <p class="text-lg lg:text-xl text-base-content/70 max-w-2xl mx-auto">
            Cada mascota recibe un cuidado personalizado y profesional
          </p>
        </div>

        {/* Embla Carousel Container */}
        <div class="relative">
          {/* Viewport sin padding extra */}
          <div class="overflow-hidden rounded-2xl -mx-4" ref={emblaRef}>
            {/* Container con las clases custom del CSS */}
            <div class="embla__container">
              <For each={props.items}>
                {(item) => (
                  <div class="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                    <div class="relative h-full">
                      <figure class="relative rounded-xl overflow-hidden shadow-lg bg-base-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                        {/* Media */}
                        <div class="relative aspect-[4/3] overflow-hidden">
                          {item.isVideo ? (
                            <video
                              src={item.mediaSrc}
                              autoplay
                              muted
                              loop
                              playsinline
                              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onLoadStart={(e) =>
                                e.currentTarget.play().catch(() => {})
                              }
                            />
                          ) : (
                            <img
                              src={item.mediaSrc}
                              alt={item.alt}
                              loading="lazy"
                              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          )}

                          {/* Overlay gradient mejorado */}
                          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Content overlay mejorado */}
                          <div class="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <div class="text-white space-y-3 w-full">
                              <h3 class="font-bold text-xl">{item.caption}</h3>
                              <p class="text-sm text-white/90 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                              <a
                                href={item.link}
                                class="btn btn-primary btn-sm hover:btn-secondary transition-colors duration-200 shadow-lg"
                              >
                                <svg
                                  class="w-4 h-4 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                Ver más
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Bottom content mejorado */}
                        <div class="p-5 bg-base-100 border-t border-base-200">
                          <h3 class="font-bold text-lg text-base-content mb-2">
                            {item.caption}
                          </h3>
                          <p class="text-sm text-base-content/70 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </figure>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Navigation Arrows mejorados */}
          <button
            class="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={scrollPrev}
            disabled={!canScrollPrev()}
            aria-label="Anterior"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            class="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={scrollNext}
            disabled={!canScrollNext()}
            aria-label="Siguiente"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation dots mejorados */}
        <div class="flex justify-center mt-10 space-x-3">
          <For each={props.items}>
            {(_, index) => (
              <button
                class={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index() === selectedIndex()
                    ? "bg-primary scale-125 shadow-lg shadow-primary/30"
                    : "bg-base-content/30 hover:bg-base-content/60"
                }`}
                onClick={() => scrollTo(index())}
                aria-label={`Ir a slide ${index() + 1}`}
              />
            )}
          </For>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
