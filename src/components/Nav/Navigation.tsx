// ResponsiveNavbar.tsx – SolidJS + TailwindCSS + daisyUI
// Versión mejorada para móvil con mejor uso del espacio
import type { Component } from "solid-js";

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Sobre Nosotros" },
  { href: "/#services", label: "Servicios" },
  { href: "/#gallery", label: "Galería" },
  { href: "/#reviews", label: "Reseñas" },
  { href: "/#location", label: "Ubicación" },
];

const ResponsiveNavbar: Component<{ children?: any }> = (props) => {
  let drawer!: HTMLInputElement;
  const toggle = () => drawer && (drawer.checked = !drawer.checked);
  const close = () => drawer && (drawer.checked = false);

  return (
    <div class="drawer">
      {/* Hidden checkbox para controlar el drawer */}
      <input
        id="nav-drawer"
        ref={drawer}
        type="checkbox"
        class="drawer-toggle"
      />

      {/* ——— Page Content ——— */}
      <div class="drawer-content flex flex-col">
        <header
          class="navbar fixed z-50 w-full bg-base-100/80 backdrop-blur-md shadow-md text-base-content px-4 lg:px-8"
          role="navigation"
          aria-label="Primary"
        >
          {/* Contenedor centralizado */}
          <div class="max-w-7xl mx-auto flex w-full items-center">
            {/* Start */}
            <div class="navbar-start">
              {/* Botón hamburguesa (móvil) */}
              <button
                aria-label="Alternar menú"
                class="btn btn-square btn-ghost lg:hidden"
                onClick={toggle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <a href="/" class="ml-2 text-2xl font-bold tracking-tight">
                Miloysusamigos
              </a>
            </div>

            {/* Center (desktop links) */}
            <nav class="hidden lg:flex navbar-center">
              <ul class="menu menu-horizontal gap-6 text-base lg:text-lg font-medium">
                {links.map((l) => (
                  <li>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* End (CTA) */}
            <div class="navbar-end hidden lg:flex">
              <a href="/#location" class="btn btn-accent btn-sm lg:btn-md">
                Reservar
              </a>
            </div>
          </div>
        </header>

        {/* Main slot */}
        <main class="pt-10 lg:pt-10 min-h-screen bg-base-200">
          {props.children}
        </main>
      </div>

      {/* ——— Drawer (mobile) - MEJORADO ——— */}
      <div class="drawer-side fixed inset-0 z-60">
        {/* Overlay */}
        <label for="nav-drawer" class="drawer-overlay"></label>

        {/* Panel mejorado */}
        <aside class="bg-base-100 w-80 h-full flex flex-col shadow-2xl relative z-10">
          {/* Header del drawer */}
          <div class="p-6 border-b border-base-200">
            <h2 class="text-2xl font-bold text-base-content">Menú</h2>
          </div>

          {/* Links con mejor espaciado y diseño */}
          <nav class="flex-1 px-6 py-8">
            <ul class="space-y-2">
              {links.map((l) => (
                <li>
                  <a
                    href={l.href}
                    onClick={close}
                    class="block w-full px-4 py-4 text-xl font-medium text-base-content hover:bg-base-200 hover:text-accent rounded-lg transition-all duration-200 ease-in-out border-2 border-transparent hover:border-accent/20"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botón reservar mejorado - fijo en la parte inferior */}
          <div class="p-6 border-t border-base-200 bg-base-50/50">
            <a
              href="/#location"
              class="btn btn-accent btn-lg w-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={close}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Reservar Hora
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResponsiveNavbar;
