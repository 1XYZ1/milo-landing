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
    <section
      class="relative isolate min-h-[90vh]"
      aria-label="Hero principal con servicios de peluquería canina"
    >
      {/* Añadir skip link */}
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"
      >
        Saltar al contenido principal
      </a>

      {/* Mejorar contraste en móviles */}
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/40 lg:from-black/60 lg:to-black/30" />

      {/* Video o imagen de fondo */}
      {props.isVideo ? (
        <video
          class="absolute inset-0 w-full h-full object-cover"
          src={props.mediaSrc}
          autoplay
          muted
          loop
          playsinline
          preload="metadata" // En vez de auto
          poster={props.mediaSrc2} // Imagen de respaldo
        />
      ) : (
        <img
          src={props.mediaSrc}
          class="absolute inset-0 w-full h-full object-cover"
          alt=""
          aria-hidden="true"
          loading="eager" // Para el hero
        />
      )}

      {/* Contenido */}
      <div class="relative z-10 flex items-center justify-center min-h-[90vh] lg:grid lg:grid-cols-12 lg:items-center gap-8 lg:gap-12 px-4 md:px-8 max-w-7xl mx-auto py-16 lg:py-24">
        {/* Contenido principal - 7 columnas */}
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <h1
            class="text-5xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold leading-tight tracking-tight
                     text-white
                     drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                     [text-shadow:0_2px_8px_rgba(0,0,0,0.5),0_0_20px_rgba(0,0,0,0.3)]"
          >
            Haz que tu mascota
            <span class="text-accent drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {" "}
              brille{" "}
            </span>
            como nunca
          </h1>
          <p
            class="text-lg sm:text-xl lg:text-2xl font-medium text-white/90
            max-w-prose mx-auto lg:mx-0
           [text-shadow:0_2px_10px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.7)]"
          >
            Peluquería profesional para mascotas.
            <br />
            <span class="text-accent font-semibold">
              Reserva fácil, resultados increíbles
            </span>
            .
          </p>

          {/* Mover beneficios ANTES de los CTAs para dar más contexto */}
          {/* Beneficios con mejor contraste */}
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
            {[
              {
                icon: "/icons/scissors.svg",
                label: "Profesionales",
                desc: "Expertos certificados",
              },
              {
                icon: "/icons/shower.svg",
                label: "Baño Premium",
                desc: "Agua temperada",
              },
              {
                icon: "/icons/massage.svg",
                label: "Sin Estrés",
                desc: "Ambiente relajado",
              },
              {
                icon: "/icons/medical.svg",
                label: "Cuidado Total",
                desc: "Salud y belleza",
              },
            ].map((benefit) => (
              <div class="group">
                <div
                  class="bg-black/50 hover:bg-orange-500/90 backdrop-blur-sm
                         transition-all duration-300 rounded-xl p-3 flex flex-col
                         items-center gap-2 hover:scale-[1.05]
                         border border-white/30 hover:border-orange-300
                         shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                >
                  <img
                    src={benefit.icon}
                    alt={benefit.label}
                    class="w-6 h-6 group-hover:scale-110 transition-transform brightness-0 invert"
                  />
                  <div class="text-center">
                    <span class="text-md font-bold block text-white">
                      {benefit.label}
                    </span>
                    <span class="text-[12px] text-white/90 hidden sm:block">
                      {benefit.desc}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            {/* CTA Principal - Verde natural */}
            <a
              href="#book"
              class="btn bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                     text-lg px-8 py-4 lg:px-12 lg:py-6 lg:text-xl rounded-lg transition-all duration-200
                     shadow-[0_6px_20px_rgba(5,150,105,0.4)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.5)]
                     border border-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]
                     focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            >
              Reservar Ahora
            </a>

            {/* CTA Secundario */}
            <a
              href="#services"
              class="btn bg-black/60 hover:bg-black/80 text-white border-2 border-white/60
                     hover:border-white font-medium text-lg px-6 py-4 lg:px-10 lg:py-6 lg:text-xl rounded-lg
                     transition-all duration-200 backdrop-blur-sm"
            >
              Ver Servicios
            </a>
          </div>
        </div>

        {/* Media - 5 columnas */}
        {/* <figure class="lg:col-span-5 relative w-full">
          {props.isVideo ? (
            <video
              class="w-full object-cover aspect-video rounded-lg"
              src={props.mediaSrc2}
              autoplay
              muted
              loop
              playsinline
              preload="metadata"
            />
          ) : (
            <img
              src={props.mediaSrc2}
              class="w-full object-cover aspect-video rounded-lg"
              alt="Resultado del servicio de peluquería"
              loading="lazy"
            />
          )}
        </figure> */}
      </div>
    </section>
  );
};

export default HeroSection;
