// GallerySection.tsx – SolidJS + TailwindCSS + Generic Carousel
// Usando el componente genérico para Gallery con funcionalidad de modal

import type { Component } from "solid-js";
import GenericCarousel, {
  type CarouselItem,
} from "../../shared/GenericCarousel";

export interface GalleryItem extends CarouselItem {
  // Gallery items extend the generic CarouselItem
  // No additional fields needed for this use case
}

interface GallerySectionProps {
  items: GalleryItem[];
  heading?: string;
}

const GallerySection: Component<GallerySectionProps> = (props) => {
  return (
    <section
      class="py-16 lg:py-20 bg-gradient-to-b from-base-100 to-base-200"
      role="region"
      aria-labelledby="gallery-heading"
    >
      <div class="container mx-auto px-4 max-w-7xl">
        {/* Header */}
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

        {/* Gallery Carousel usando componente genérico */}
        <GenericCarousel
          items={props.items}
          cardStyle="gallery"
          slidesPerView={{
            default: "100%",
            sm: "50%",
            md: "33.333%",
            lg: "33.333%",
          }}
          emblaOptions={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false,
            containScroll: "trimSnaps",
            slidesToScroll: 1,
            duration: 25,
          }}
          autoplayOptions={{
            delay: 2500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
            playOnInit: true,
          }}
          enableModal={true}
          ariaLabel="Galería de trabajos"
          prevAriaLabel="Trabajo anterior"
          nextAriaLabel="Trabajo siguiente"
        />
      </div>
    </section>
  );
};

export default GallerySection;
