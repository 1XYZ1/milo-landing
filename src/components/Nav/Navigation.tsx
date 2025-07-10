// ResponsiveNavbar.tsx – SolidJS + TailwindCSS + daisyUI
// Corrección: el botón hamburguesa ahora ABRE y CIERRA el menú según su estado,
// y el overlay sigue cerrándolo al tocar fuera.
import type { Component } from "solid-js";

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: "#home", label: "Inicio" },
  { href: "#services", label: "Servicios" },
  { href: "#shop", label: "Tienda" },
  { href: "#contact", label: "Contacto" },
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
              <a href="#book" class="btn btn-accent btn-sm lg:btn-md">
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

      {/* ——— Drawer (mobile) ——— */}
      <div class="drawer-side fixed inset-0">
        {/* Overlay */}
        <label for="nav-drawer" class="drawer-overlay"></label>

        {/* Panel */}
        <aside class="bg-base-100 w-72 h-full p-6 space-y-6 overflow-y-auto">
          <h2 class="text-2xl font-semibold">Menú</h2>
          <ul class="flex flex-col text-lg gap-4">
            {links.map((l) => (
              <li>
                <a href={l.href} onClick={close}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#book" class="btn btn-accent mt-6" onClick={close}>
            Reservar
          </a>
        </aside>
      </div>
    </div>
  );
};

export default ResponsiveNavbar;
