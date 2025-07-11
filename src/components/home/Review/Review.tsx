// ReviewsSection.tsx – SolidJS + TailwindCSS + daisyUI + Embla Carousel
// Preview carousel  ➜  Modal con galería completa (fotos + videos) y puntuación.
// Soluciona: carrusel modal iniciaba mal, ahora usa instancia Embla directa.
// Añade overlay oscuro y estrellas de rating dentro del modal.
// Dependencias: embla-carousel, embla-carousel-solid, embla-carousel-autoplay
//   pnpm add embla-carousel embla-carousel-solid embla-carousel-autoplay

import type { Component } from "solid-js";
import { createSignal, Show, onCleanup, onMount } from "solid-js";
import createEmblaCarousel from "embla-carousel-solid";
import Autoplay from "embla-carousel-autoplay";
import EmblaCarousel from "embla-carousel";

interface ReviewMedia {
  src: string;
  isVideo?: boolean;
  alt?: string;
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
  media: ReviewMedia[];
}

interface ReviewsSectionProps {
  overallRating: number;
  totalReviews: number;
  placeUrl: string;
  reviews: Review[];
}

const ReviewsSection: Component<ReviewsSectionProps> = (props) => {
  /* Preview carousel (auto) */
  const [previewEmbla] = createEmblaCarousel(
    () => ({ loop: true }),
    () => [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  /* Modal state */
  const [open, setOpen] = createSignal(false);
  const [current, setCurrent] = createSignal<Review | null>(null);
  const [currentSlide, setCurrentSlide] = createSignal(0);

  /* Modal Embla refs */
  let modalViewport!: HTMLDivElement;
  let modalEmbla: any | undefined;

  const initModalEmbla = () => {
    modalEmbla?.destroy();
    modalEmbla = EmblaCarousel(modalViewport, {
      loop: true,
      dragFree: false,
      containScroll: "trimSnaps",
    });

    // Actualizar indicador de slide actual
    modalEmbla.on("select", () => {
      setCurrentSlide(modalEmbla.selectedScrollSnap());
    });

    setCurrentSlide(0);
  };

  const openModal = (rv: Review) => {
    setCurrent(rv);
    setOpen(true);

    // Solo en el cliente
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    queueMicrotask(initModalEmbla);
  };

  const closeModal = () => {
    setOpen(false);

    // Solo en el cliente
    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
    }

    modalEmbla?.destroy();
    modalEmbla = undefined;
  };

  // Navegación del carousel
  const scrollPrev = () => modalEmbla?.scrollPrev();
  const scrollNext = () => modalEmbla?.scrollNext();
  const scrollTo = (index: number) => modalEmbla?.scrollTo(index);

  // Navegación con teclado
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open()) return;

    switch (e.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowLeft":
        scrollPrev();
        break;
      case "ArrowRight":
        scrollNext();
        break;
    }
  };

  // Event listeners solo en el cliente
  onMount(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("keydown", handleKeyDown);
    }
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }
    modalEmbla?.destroy();
  });

  return (
    <section class="py-16 bg-base-100" aria-labelledby="reviews-heading">
      <div class="container mx-auto px-6 space-y-12">
        {/* Resumen calificación */}
        <header class="text-center space-y-4">
          <h2 id="reviews-heading" class="text-3xl lg:text-5xl font-bold">
            Opiniones de Nuestros Clientes
          </h2>
          <div class="flex justify-center items-center gap-2">
            <span class="text-4xl font-semibold">
              {props.overallRating.toFixed(1)}
            </span>
            <div class="rating rating-lg">
              {[1, 2, 3, 4, 5].map((i) => (
                <input
                  type="radio"
                  class="mask mask-star-2 bg-primary"
                  name="overall-star"
                  disabled
                  checked={i === Math.round(props.overallRating)}
                />
              ))}
            </div>
          </div>
          <p class="text-base-content/80">
            Basado en {props.totalReviews} reseñas verificadas en&nbsp;
            <a
              href={props.placeUrl}
              class="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google
            </a>
          </p>
        </header>

        {/* Carrusel de vista previa */}
        <div class="embla overflow-hidden" ref={previewEmbla}>
          <div class="embla__container flex gap-4 md:gap-6">
            {props.reviews.map((rv) => {
              const isLongText = rv.text.length > 120;
              const previewText = isLongText
                ? rv.text.slice(0, 120).trim()
                : rv.text;

              return (
                <article
                  class="embla__slide min-w-[280px] sm:min-w-[320px] lg:min-w-[350px] max-w-[380px] bg-white dark:bg-base-200 rounded-xl shadow-sm border border-base-300/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col group"
                  onClick={() => openModal(rv)}
                >
                  {/* Media preview con aspect ratio 1:1 */}
                  <div class="relative overflow-hidden rounded-t-xl">
                    <Show when={rv.media[0]}>
                      {(m) =>
                        m().isVideo ? (
                          <video
                            src={m().src}
                            autoplay
                            muted
                            loop
                            playsinline
                            class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <img
                            src={m().src}
                            alt={m().alt || rv.author}
                            loading="lazy"
                            class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )
                      }
                    </Show>

                    {/* Overlay gradient sutil */}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div class="p-5 flex-1 flex flex-col space-y-3">
                    {/* Header con info del autor */}
                    <header class="flex items-start justify-between">
                      <div class="flex-1 min-w-0">
                        <h3 class="font-medium text-base text-base-content truncate mb-1">
                          {rv.author}
                        </h3>
                        <div class="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <svg
                              class={`w-3.5 h-3.5 ${
                                i <= rv.rating
                                  ? "text-yellow-400"
                                  : "text-base-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <time class="text-xs text-base-content/50 whitespace-nowrap ml-2">
                        {rv.date}
                      </time>
                    </header>

                    {/* Texto de la reseña */}
                    <div class="flex-1">
                      <blockquote class="text-sm text-base-content/80 leading-relaxed">
                        "{previewText}
                        {isLongText && "..."}"
                      </blockquote>

                      <Show when={isLongText}>
                        <button
                          class="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary-focus transition-colors font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(rv);
                          }}
                        >
                          Leer más
                          <svg
                            class="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </Show>
                    </div>

                    {/* Footer con indicador de galería */}
                    <footer class="flex items-center justify-between pt-2 border-t border-base-300/30">
                      <Show
                        when={rv.media.length > 1}
                        fallback={
                          <span class="text-xs text-base-content/40">
                            Reseña verificada
                          </span>
                        }
                      >
                        <div class="flex items-center gap-1 text-xs text-base-content/50">
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{rv.media.length} fotos</span>
                        </div>
                      </Show>

                      <div class="text-xs text-base-content/40">
                        Toca para ver más
                      </div>
                    </footer>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal mejorado */}
      <Show when={open() && current()}>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            class="relative w-full max-w-4xl max-h-[95vh] bg-white dark:bg-base-200 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header minimalista */}
            <header class="flex items-center justify-between p-6 border-b border-base-300">
              <div class="flex items-center gap-4">
                <div>
                  <h3 class="text-xl font-semibold text-base-content">
                    {current()!.author}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="rating rating-sm">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          class={`mask mask-star-2 w-4 h-4 ${
                            i <= current()!.rating
                              ? "bg-yellow-400"
                              : "bg-base-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span class="text-sm text-base-content/60">
                      {current()!.date}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeModal}
                class="btn btn-sm btn-ghost btn-circle hover:bg-base-300"
                aria-label="Cerrar modal"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            {/* Carrusel de galería */}
            <div class="relative">
              <div
                class="embla overflow-hidden"
                ref={(el) => (modalViewport = el)}
              >
                <div class="embla__container flex">
                  {current()!.media.map((m, index) => (
                    <div class="embla__slide min-w-full flex items-center justify-center bg-base-100 p-4">
                      {m.isVideo ? (
                        <video
                          src={m.src}
                          autoplay
                          muted
                          loop
                          playsinline
                          controls
                          class="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
                        />
                      ) : (
                        <img
                          src={m.src}
                          alt={
                            m.alt ||
                            `${current()!.author} - Imagen ${index + 1}`
                          }
                          class="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles de navegación */}
              <Show when={current()!.media.length > 1}>
                <button
                  onClick={scrollPrev}
                  class="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white/90 hover:bg-white border-0 shadow-lg"
                  aria-label="Imagen anterior"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={scrollNext}
                  class="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white/90 hover:bg-white border-0 shadow-lg"
                  aria-label="Imagen siguiente"
                >
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Show>

              {/* Indicadores de slides */}
              <Show when={current()!.media.length > 1}>
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {current()!.media.map((_, index) => (
                    <button
                      onClick={() => scrollTo(index)}
                      class={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentSlide() === index
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </Show>
            </div>

            {/* Contenido del testimonio */}
            <div class="p-6 space-y-4">
              <blockquote class="text-base leading-relaxed text-base-content">
                "{current()!.text}"
              </blockquote>

              <div class="flex items-center justify-between pt-4 border-t border-base-300">
                <span class="text-sm text-base-content/60">
                  Reseña verificada
                </span>
                <a
                  href={props.placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-focus transition-colors"
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
          </div>
        </div>
      </Show>
    </section>
  );
};

export default ReviewsSection;
