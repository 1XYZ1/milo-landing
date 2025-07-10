// HeroSection.tsx – SolidJS + TailwindCSS + daisyUI
// Reusable, lightweight hero component following UX/UI best practices.
// Props let you plug text, CTAs, image/video and control layout.
import type { Component } from "solid-js";

interface HeroProps {
  title: string;
  subtitle: string;
  /** URL of image or video poster. */
  mediaSrc: string;
  mediaSrc2: string;
  /** If true, treats mediaSrc as a video (autoplay + muted loop); otherwise image. */
  isVideo?: boolean;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const HeroSection: Component<HeroProps> = (props) => {
  return (
    <section class="relative isolate min-h-[90vh]">
      {/* Video o imagen de fondo */}
      {props.isVideo ? (
        <video
          class="absolute inset-0 w-full h-full object-cover"
          src={props.mediaSrc}
          autoplay
          muted
          loop
          playsinline
        />
      ) : (
        <img
          src={props.mediaSrc}
          class="absolute inset-0 w-full h-full object-cover"
          alt=""
          aria-hidden="true"
        />
      )}

      {/* Overlay para contraste */}
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />

      {/* Contenido */}
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20 px-4 md:px-8 max-w-7xl mx-auto py-20 lg:py-28">
        {/* Texto + beneficios */}
        <div class="space-y-8 text-center lg:text-left max-w-xl">
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white text-outline">
            ¡Haz que tu mascota{" "}
            <span class="text-accent">luzca increíble!</span>
          </h1>
          <p
            class="text-lg sm:text-xl lg:text-2xl font-medium text-white/90
           drop-shadow-legible max-w-prose mx-auto lg:mx-0"
          >
            Reserva tu <span class="text-accent font-semibold">hora </span>
            con unos cuantos{" "}
            <span class="text-accent font-semibold">clics</span>.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#book"
              class="btn btn-accent btn-lg btn-block sm:btn-wide text-black border-black"
            >
              Reservar ahora
            </a>
            <a
              href="#services"
              class="btn btn-accent btn-lg text-black border-black"
            >
              Ver servicios
            </a>
          </div>

          {/* Beneficios / features */}
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 text-white">
            {[
              { icon: "/icons/scissors.svg", label: "Profesionales" },
              { icon: "/icons/shower.svg", label: "Baños Tibios" },
              { icon: "/icons/massage.svg", label: "Sin Estres" },
              { icon: "/icons/medical.svg", label: "Salud Animal" },
            ].map((b) => (
              <a href="#services" class="group">
                <div
                  class="backdrop-blur-sm bg-white/10 hover:bg-accent/20
                            transition-all duration-300 rounded-xl p-4 flex flex-col
                            items-center gap-3 hover:scale-[1.05]"
                >
                  <img src={b.icon} alt="" class="w-8 h-8" aria-hidden="true" />
                  <span class="text-sm font-medium text-center">{b.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Media */}
        <figure class="max-w-md w-full lg:max-w-xl lg:justify-self-end border-3 rounded-xl border-white">
          {props.isVideo ? (
            <video
              class="w-full h-full object-cover rounded-xl"
              src={props.mediaSrc2}
              autoplay
              muted
              loop
              playsinline
            />
          ) : (
            <img
              src={props.mediaSrc}
              class="w-full h-full object-cover"
              alt=""
              aria-hidden="true"
            />
          )}
        </figure>
      </div>
    </section>
  );
};

export default HeroSection;
