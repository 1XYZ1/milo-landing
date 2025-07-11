// LocationMapLeaflet.tsx – SolidJS + Leaflet (dynamic import)
// Soluciona el error «window is not defined» cargando Leaflet solo en el cliente.
// Instalación:  pnpm add leaflet   (y opcional @types/leaflet)
// Importa el CSS de Leaflet globalmente una vez:
//   @import "leaflet/dist/leaflet.css";
import type { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import type * as Leaflet from "leaflet";

interface LocationMapProps {
  address: string;
  lat: number;
  lon: number;
  googleMapsUrl: string;
  wazeUrl: string;
}

const LocationMapLeaflet: Component<LocationMapProps> = (props) => {
  let mapContainer!: HTMLDivElement;
  let map: Leaflet.Map | undefined;

  onMount(async () => {
    // ⬇️ Dinámicamente importa Leaflet solo en el navegador.
    const L: typeof Leaflet = (await import("leaflet")).default as any;

    map = L.map(mapContainer, {
      center: [props.lat, props.lon],
      zoom: 16,
      scrollWheelZoom: false,
      zoomControl: false,
    });

    // Agregar control de zoom en posición personalizada
    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Crear un marcador personalizado
    const customIcon = L.divIcon({
      html: `
                <div class="bg-primary rounded-full p-1 shadow-lg border-4 border-white">
          <img
            src="/icons/paw.svg"
            alt="Paw"
            class="w-6 h-6 filter brightness-0 invert"
          />
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: "custom-marker",
    });

    L.marker([props.lat, props.lon], { icon: customIcon }).addTo(map)
      .bindPopup(`
        <div class="p-2 text-center">
          <div class="font-bold text-lg mb-1">🐾 Milo Pet Grooming</div>
          <div class="text-sm text-gray-600">${props.address}</div>
        </div>
      `);
  });

  onCleanup(() => map?.remove());

  return (
    <section
      id="location"
      class="py-20 bg-gradient-to-br from-base-100 to-base-200 relative overflow-hidden"
      aria-labelledby="loc-heading"
    >
      {/* Decorative background elements */}
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-32 h-32 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div class="text-center mb-16">
          <h2
            id="loc-heading"
            class="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4"
          >
            Visítanos
          </h2>
          <p class="text-xl text-base-content/70 max-w-2xl mx-auto">
            Estamos ubicados en el corazón de Santiago, listos para cuidar a tu
            mascota con amor y profesionalismo
          </p>
        </div>

        {/* Main content grid */}
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          {/* LEFT COLUMN - Contact Information */}
          <div class="order-2 lg:order-1">
            {/* Contact Info Card */}
            <div class="bg-white rounded-3xl shadow-xl p-8 border border-base-300 h-full flex flex-col">
              <h3 class="text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                Información de Contacto
              </h3>

              <div class="space-y-6 flex-grow">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-base-content text-lg mb-1">
                      Dirección
                    </h4>
                    <address class="not-italic text-base-content/70 leading-relaxed">
                      {props.address}
                    </address>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-base-content text-lg mb-1">
                      Teléfono
                    </h4>
                    <a
                      href="tel:+56912345678"
                      class="text-primary hover:text-primary-focus transition-colors font-medium"
                    >
                      +56 9 1234 5678
                    </a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-base-content text-lg mb-1">
                      Horarios
                    </h4>
                    <div class="text-base-content/70 space-y-1">
                      <p>Lunes - Viernes: 9:00 - 18:00</p>
                      <p>Sábados: 9:00 - 14:00</p>
                      <p class="text-primary font-medium">Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div class="mt-8 pt-6 border-t border-base-300">
                <h3 class="text-lg font-semibold text-base-content mb-3">
                  Contacta con nosotros
                </h3>
                <div class="flex gap-2">
                  <a
                    href="https://wa.me/56912345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    WhatsApp
                  </a>

                  <a
                    href="tel:+56912345678"
                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    Llamar
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Map & Navigation */}
          <div class="order-1 lg:order-2">
            {/* Unified Map & Navigation Card */}
            <div class="bg-white rounded-3xl shadow-xl border border-base-300 h-full flex flex-col">
              {/* Map Section */}
              <div class="overflow-hidden rounded-t-3xl flex-grow">
                <div class="h-80 lg:h-96 relative">
                  <div ref={mapContainer} class="w-full h-full" />
                  {/* Map overlay with loading state */}
                  <div class="absolute inset-0 bg-base-200/10 pointer-events-none opacity-0 transition-opacity duration-300 leaflet-loading"></div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div class="p-6 border-t border-base-300">
                <h3 class="text-lg font-semibold text-base-content mb-3">
                  ¿Cómo llegar?
                </h3>
                <div class="flex gap-2">
                  <a
                    href={props.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Maps
                  </a>

                  <a
                    href={props.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    Waze
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMapLeaflet;
