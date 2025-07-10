// ServicesSection.tsx – SolidJS + TailwindCSS + daisyUI
// Lightweight, responsive grid listing service cards with video or image.
import type { Component } from "solid-js";

export interface Service {
  title: string;
  description: string;
  slug: string; // page path e.g. "/services/grooming"
  mediaSrc: string;
  isVideo?: boolean;
}

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: Component<ServicesSectionProps> = (props) => {
  return (
    <section class="py-16 bg-base-200" aria-labelledby="services-heading">
      <div class="container mx-auto px-6">
        <h2
          id="services-heading"
          class="text-3xl lg:text-5xl font-bold text-center mb-12"
        >
          Nuestros Servicios
        </h2>

        <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {props.services.map((svc) => (
            <article class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
              {svc.isVideo ? (
                <figure>
                  <video
                    src={svc.mediaSrc}
                    autoplay
                    muted
                    loop
                    playsinline
                    class="w-full h-40 object-cover"
                  ></video>
                </figure>
              ) : (
                <figure>
                  <img
                    src={svc.mediaSrc}
                    alt={svc.title}
                    class="w-full h-40 object-cover"
                    loading="lazy"
                  />
                </figure>
              )}

              <div class="card-body p-5">
                <h3 class="card-title text-xl lg:text-2xl">{svc.title}</h3>
                <p class="text-sm lg:text-base opacity-90 line-clamp-3">
                  {svc.description}
                </p>
                <div class="card-actions justify-end pt-4">
                  <a href={svc.slug} class="btn btn-outline btn-sm lg:btn-md">
                    Ver más
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
