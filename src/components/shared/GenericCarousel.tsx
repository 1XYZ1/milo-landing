// GenericCarousel.tsx – SolidJS + TailwindCSS + DaisyUI + Embla Carousel
// Componente genérico que combina la estructura visual de Gallery con funcionalidad de modal
// Completamente reutilizable para cualquier tipo de contenido

import type { Component, JSX } from "solid-js";
import {
  onMount,
  onCleanup,
  createSignal,
  For,
  Show,
  createEffect,
} from "solid-js";
import createEmblaCarousel from "embla-carousel-solid";
import type { EmblaOptionsType } from "embla-carousel";
import Autoplay, { type AutoplayOptionsType } from "embla-carousel-autoplay";

// Interface para elementos de media
export interface MediaItem {
  src: string;
  isVideo?: boolean;
  alt?: string;
}

// Interface genérica para items del carousel
export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  media: MediaItem[];
  link?: string;
  // Campos adicionales específicos del tipo de contenido
  [key: string]: any;
}

export interface GenericCarouselProps<T extends CarouselItem> {
  // Data
  items: T[];

  // Configuración del carousel
  emblaOptions?: Partial<EmblaOptionsType>;
  autoplayOptions?: Partial<AutoplayOptionsType>;

  // Layout responsive
  slidesPerView?: {
    default: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };

  // Navegación
  showNavigation?: boolean;
  showDots?: boolean;

  // Modal
  enableModal?: boolean;
  modalTitle?: (item: T) => string;
  modalContent?: (item: T) => JSX.Element;

  // Personalización visual
  cardStyle?: "gallery" | "review" | "custom";
  customCardRender?: (item: T, openModal: (item: T) => void) => JSX.Element;

  // Accesibilidad
  ariaLabel?: string;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
}

const GenericCarousel: Component<GenericCarouselProps<any>> = (props) => {
  // Main carousel state
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [canScrollPrev, setCanScrollPrev] = createSignal(false);
  const [canScrollNext, setCanScrollNext] = createSignal(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [currentItem, setCurrentItem] = createSignal<CarouselItem | null>(null);

  // Modal carousel state
  const [modalSelectedIndex, setModalSelectedIndex] = createSignal(0);
  const [modalCanScrollPrev, setModalCanScrollPrev] = createSignal(false);
  const [modalCanScrollNext, setModalCanScrollNext] = createSignal(false);

  // Convert slides per view to Embla breakpoints
  const convertToEmblaBreakpoints = () => {
    const slides = finalSlidesPerView();
    const getSlidesCount = (percentage: string) => {
      if (percentage === "100%") return 1;
      if (percentage === "50%") return 2;
      if (percentage === "33.333%") return 3;
      if (percentage === "25%") return 4;
      if (percentage === "20%") return 5;
      return 1;
    };

    return {
      "(min-width: 640px)": {
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
      },
      "(min-width: 768px)": {
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
      },
      "(min-width: 1024px)": {
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
      },
    };
  };

  // Default options
  const defaultEmblaOptions: EmblaOptionsType = {
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    duration: 25,
  };

  const defaultAutoplayOptions: AutoplayOptionsType = {
    delay: 2500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    stopOnFocusIn: true,
    playOnInit: true,
  };

  const defaultSlidesPerView = {
    default: "100%",
    sm: "50%",
    lg: "33.333%",
  };

  // Merge options
  const finalEmblaOptions = () => ({
    ...defaultEmblaOptions,
    ...props.emblaOptions,
  });

  const finalAutoplayOptions = () => ({
    ...defaultAutoplayOptions,
    ...props.autoplayOptions,
  });

  const finalSlidesPerView = () => ({
    ...defaultSlidesPerView,
    ...props.slidesPerView,
  });

  // Initialize carousels
  const [emblaRef, emblaApi] = createEmblaCarousel(finalEmblaOptions, () => [
    Autoplay(finalAutoplayOptions()),
  ]);

  const [modalEmblaRef, modalEmblaApi] = createEmblaCarousel(
    () => ({
      align: "center",
      loop: true,
      skipSnaps: false,
      dragFree: false,
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      duration: 20,
      axis: "x",
    }),
    () => []
  );

  // Navigation functions
  const scrollPrev = () => emblaApi()?.scrollPrev();
  const scrollNext = () => emblaApi()?.scrollNext();
  const scrollTo = (index: number) => emblaApi()?.scrollTo(index);

  const scrollModalPrev = () => modalEmblaApi()?.scrollPrev();
  const scrollModalNext = () => modalEmblaApi()?.scrollNext();
  const scrollModalTo = (index: number) => modalEmblaApi()?.scrollTo(index);

  // Modal management
  const openModal = (item: CarouselItem) => {
    if (props.enableModal === false) return;

    setCurrentItem(item);
    setIsModalOpen(true);
    setModalSelectedIndex(0);

    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);

    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen()) return;

    switch (e.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowLeft":
        scrollModalPrev();
        break;
      case "ArrowRight":
        scrollModalNext();
        break;
    }
  };

  // Event handlers
  const onSelect = () => {
    const api = emblaApi();
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };

  const onModalSelect = () => {
    const api = modalEmblaApi();
    if (!api) return;

    setModalSelectedIndex(api.selectedScrollSnap());
    setModalCanScrollPrev(api.canScrollPrev());
    setModalCanScrollNext(api.canScrollNext());
  };

  // Lifecycle
  onMount(() => {
    const api = emblaApi();
    if (api) {
      onSelect();
      api.on("select", onSelect);
      api.on("reInit", onSelect);
    }

    const modalApi = modalEmblaApi();
    if (modalApi) {
      onModalSelect();
      modalApi.on("select", onModalSelect);
      modalApi.on("reInit", onModalSelect);
    }

    if (typeof window !== "undefined") {
      document.addEventListener("keydown", handleKeyDown);
    }
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }

    emblaApi()?.destroy();
    modalEmblaApi()?.destroy();
  });

  // Reset modal carousel when item changes
  createEffect(() => {
    if (currentItem() && modalEmblaApi()) {
      setModalSelectedIndex(0);
      modalEmblaApi()?.scrollTo(0, true);
    }
  });

  // Generate responsive slide classes - Fixed for multiple slides
  const getSlideClasses = () => {
    // Use fixed responsive classes that work with Embla
    return "embla__slide flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/3 pl-4";
  };

  // Render card based on style
  const renderCard = (item: CarouselItem) => {
    if (props.customCardRender) {
      return props.customCardRender(item, openModal);
    }

    if (props.cardStyle === "review") {
      return renderReviewCard(item);
    }

    // Default: gallery style
    return renderGalleryCard(item);
  };

  // Gallery-style card (default)
  const renderGalleryCard = (item: CarouselItem) => (
    <figure
      class="relative rounded-xl overflow-hidden shadow-lg bg-base-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full cursor-pointer"
      onClick={() => openModal(item)}
    >
      <div class="relative aspect-[4/3] overflow-hidden">
        {item.media[0]?.isVideo ? (
          <video
            src={item.media[0].src}
            autoplay
            muted
            loop
            playsinline
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onLoadStart={(e) => e.currentTarget.play().catch(() => {})}
          />
        ) : (
          <img
            src={item.media[0]?.src}
            alt={item.media[0]?.alt || item.title}
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}

        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div class="p-5 bg-base-100 border-t border-base-200">
        <h3 class="font-bold text-lg text-base-content mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p class="text-sm text-base-content/70 line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        <div class="flex items-center justify-between text-xs text-base-content/60">
          <div class="flex items-center gap-2">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {item.media.length}{" "}
              {item.media.length === 1 ? "imagen" : "imágenes"}
            </span>
          </div>

          <span class="text-primary/80">Clic para ampliar</span>
        </div>
      </div>
    </figure>
  );

  // Review-style card
  const renderReviewCard = (item: CarouselItem) => {
    const isLongText = item.description.length > 80;
    const previewText = isLongText
      ? item.description.slice(0, 80).trim() + "..."
      : item.description;

    return (
      <article
        class="bg-base-200 rounded-2xl shadow-md hover:shadow-2xl border border-base-300/50 cursor-pointer transition-all duration-500 hover:-translate-y-1 flex flex-col h-full group"
        onClick={() => openModal(item)}
      >
        {item.media[0] && (
          <div class="relative overflow-hidden rounded-t-2xl aspect-square">
            {item.media[0].isVideo ? (
              <video
                src={item.media[0].src}
                autoplay
                muted
                loop
                playsinline
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <img
                src={item.media[0].src}
                alt={item.media[0].alt || item.title}
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            )}

            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}

        <div class="p-5 lg:p-6 flex-1 flex flex-col space-y-4">
          <header class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-lg text-base-content truncate mb-2">
                {item.title}
              </h3>
              {/* Rating stars */}
              {item.rating && (
                <div class="rating rating-sm mb-2">
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
              )}
              {/* Date */}
              {item.date && (
                <time class="text-sm text-base-content/60">{item.date}</time>
              )}
            </div>
          </header>

          <div class="flex-1">
            <blockquote class="text-sm lg:text-base text-base-content/80 leading-relaxed">
              "{previewText}"
            </blockquote>
          </div>

          <footer class="flex items-center justify-between pt-4 border-t border-base-300/30">
            <div class="flex items-center gap-2 text-sm text-base-content/60">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {item.media.length} {item.media.length === 1 ? "foto" : "fotos"}
              </span>
            </div>

            {isLongText && (
              <span class="text-xs text-base-content/50">
                Clic para ver completa
              </span>
            )}
          </footer>
        </div>
      </article>
    );
  };

  return (
    <>
      {/* Main Carousel */}
      <div
        class="relative pb-2"
        role="region"
        aria-label={props.ariaLabel || "Carousel"}
      >
        <div class="overflow-hidden" ref={emblaRef}>
          <div class="embla__container flex -ml-4">
            <For each={props.items}>
              {(item) => (
                <div class={getSlideClasses()}>
                  <div class="h-full">{renderCard(item)}</div>
                </div>
              )}
            </For>
          </div>
        </div>

        {/* Navigation Arrows */}
        {props.showNavigation !== false && (
          <>
            <button
              class="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={scrollPrev}
              disabled={!canScrollPrev()}
              aria-label={props.prevAriaLabel || "Anterior"}
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
              aria-label={props.nextAriaLabel || "Siguiente"}
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
          </>
        )}

        {/* Navigation Dots */}
        {props.showDots !== false && (
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
        )}
      </div>

      {/* Modal */}
      <Show when={isModalOpen() && currentItem()}>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            class="relative w-full max-w-4xl max-h-[95vh] bg-base-100 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <header class="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-base-300">
              <div class="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-base-content truncate">
                    {props.modalTitle
                      ? props.modalTitle(currentItem()!)
                      : currentItem()!.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={closeModal}
                class="btn btn-sm btn-ghost btn-circle hover:bg-base-300"
                aria-label="Cerrar modal"
              >
                <svg
                  class="w-6 h-6"
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

            {/* Modal carousel */}
            <div class="embla relative">
              <div class="embla__viewport overflow-hidden" ref={modalEmblaRef}>
                <div class="embla__container flex touch-pan-y">
                  <For each={currentItem()!.media}>
                    {(media, index) => (
                      <div class="embla__slide flex-[0_0_100%] min-w-0">
                        <div class="embla__slide__inner flex items-center justify-center bg-base-200 p-1 sm:p-2 lg:p-3 h-full">
                          {media.isVideo ? (
                            <video
                              src={media.src}
                              autoplay
                              muted
                              loop
                              playsinline
                              controls
                              class="max-w-full max-h-[40vh] sm:max-h-[50vh] lg:max-h-[60vh] w-auto h-auto object-contain rounded-lg shadow-lg"
                            />
                          ) : (
                            <img
                              src={media.src}
                              alt={
                                media.alt ||
                                `${currentItem()!.title} - Imagen ${
                                  index() + 1
                                }`
                              }
                              class="max-w-full max-h-[40vh] sm:max-h-[50vh] lg:max-h-[60vh] w-auto h-auto object-contain rounded-lg shadow-lg"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Modal navigation */}
              <Show when={currentItem()!.media.length > 1}>
                <button
                  onClick={scrollModalPrev}
                  class="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border-0 shadow-lg"
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
                  onClick={scrollModalNext}
                  class="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border-0 shadow-lg"
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

              {/* Modal dots */}
              <Show when={currentItem()!.media.length > 1}>
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <For each={currentItem()!.media}>
                    {(_, index) => (
                      <button
                        onClick={() => scrollModalTo(index())}
                        class={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                          modalSelectedIndex() === index()
                            ? "bg-base-100 scale-125"
                            : "bg-base-100/50 hover:bg-base-100/75"
                        }`}
                        aria-label={`Ir a imagen ${index() + 1}`}
                      />
                    )}
                  </For>
                </div>
              </Show>
            </div>

            {/* Modal content */}
            <div class="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6">
              {props.modalContent ? (
                props.modalContent(currentItem()!)
              ) : (
                <div>
                  <blockquote class="text-base lg:text-lg leading-relaxed text-base-content mb-4">
                    "{currentItem()!.description}"
                  </blockquote>

                  {currentItem()!.link && (
                    <div class="flex items-center justify-between pt-4 border-t border-base-300">
                      <span class="text-sm text-base-content/60">
                        Más información disponible
                      </span>
                      <a
                        href={currentItem()!.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-focus transition-colors font-medium"
                      >
                        Ver más detalles
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default GenericCarousel;
