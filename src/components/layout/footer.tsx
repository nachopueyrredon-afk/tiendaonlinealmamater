import Link from "next/link";

const links = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/envios", label: "Envios" },
  { href: "/medios-de-pago", label: "Medios de pago" },
  { href: "/cambios-y-devoluciones", label: "Cambios y devoluciones" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacidad", label: "Privacidad y terminos" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-900/10 bg-paper/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-2xl text-brand-900">ALMA MATER</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-brand-900/70">
            Objetos religiosos contemporaneos y joyeria con sentido para regalar, contemplar y habitar.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-brand-900/75">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
