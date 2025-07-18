// ReviewsSection.tsx – SolidJS + TailwindCSS + daisyUI + Generic Carousel
// Usando el componente genérico para Reviews con funcionalidad de modal especializada

import type { Component } from "solid-js";
import { For } from "solid-js";
import GenericCarousel, {
  type CarouselItem,
  type MediaItem,
} from "../../shared/GenericCarousel";

export interface Review extends CarouselItem {
  author: string;
  rating: number;
  date: string;
  text: string;
  // Hereda media, id, title, description, link de CarouselItem
}

interface ReviewsSectionProps {
  overallRating: number;
  totalReviews: number;
  placeUrl: string;
  reviews: Review[];
}

const ReviewsSection: Component<ReviewsSectionProps> = (props) => {
  // Custom modal content para reviews
  const reviewModalContent = (item: Review) => (
    <div>
      {/* Author info */}
      <div class="flex items-center gap-3 mb-6">
        <div class="rating rating-sm">
          <For each={[1, 2, 3, 4, 5]}>
            {(i) => (
              <span
                class={`mask mask-star-2 w-4 h-4 ${
                  i <= item.rating ? "bg-warning" : "bg-base-300"
                }`}
              />
            )}
          </For>
        </div>
        <time class="text-sm text-base-content/60">{item.date}</time>
      </div>

      {/* Review text */}
      <blockquote class="text-base lg:text-lg leading-relaxed text-base-content mb-6">
        "{item.text}"
      </blockquote>

      {/* Footer */}
      <div class="flex items-center justify-between pt-4 border-t border-base-300">
        <span class="text-sm text-base-content/60">
          Reseña verificada en Google
        </span>
        <a
          href={props.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-focus transition-colors font-medium"
        >
          Ver en Google
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );

  return (
    <section
      class="py-16 lg:py-20 bg-base-100"
      aria-labelledby="reviews-heading"
    >
      <div class="container mx-auto px-4 lg:px-6 max-w-7xl space-y-12">
        {/* Header section */}
        <header class="text-center space-y-6">
          <h2
            id="reviews-heading"
            class="text-3xl lg:text-5xl font-bold text-base-content"
          >
            Opiniones de Nuestros Clientes
          </h2>

          <div class="flex justify-center items-center gap-3">
            <span class="text-4xl lg:text-5xl font-bold text-primary">
              {props.overallRating.toFixed(1)}
            </span>
            <div class="rating rating-lg">
              <For each={[1, 2, 3, 4, 5]}>
                {(i) => (
                  <input
                    type="radio"
                    class="mask mask-star-2 bg-warning"
                    name="overall-rating"
                    disabled
                    checked={i === Math.round(props.overallRating)}
                  />
                )}
              </For>
            </div>
          </div>

          <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
            Basado en <strong>{props.totalReviews}</strong> reseñas verificadas
            en{" "}
            <a
              href={props.placeUrl}
              class="link link-primary font-medium hover:link-hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google
            </a>
          </p>
        </header>

        {/* Reviews Carousel usando componente genérico */}
        <GenericCarousel
          items={props.reviews}
          cardStyle="review"
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
            delay: 3500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
            playOnInit: true,
          }}
          enableModal={true}
          modalTitle={(item: Review) => item.author}
          modalContent={reviewModalContent}
          ariaLabel="Reseñas de clientes"
          prevAriaLabel="Reseña anterior"
          nextAriaLabel="Reseña siguiente"
        />
      </div>
    </section>
  );
};

export default ReviewsSection;
