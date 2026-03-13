import Link from "next/link";
import { Menu, ShoppingBag, UserRound } from "lucide-react";

import { getCartDetail } from "@/lib/cart";
import { primaryNavigation, siteConfig } from "@/lib/site";

export async function Header() {
  const cart = await getCartDetail();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-900/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 flex-col">
            <span className="font-serif text-[1.7rem] tracking-[0.18em] text-brand-900 sm:text-[2rem] sm:tracking-[0.22em]">{siteConfig.name}</span>
            <span className="eyebrow text-[10px] uppercase text-brand-700/80">{siteConfig.tagline}</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm tracking-[0.08em] text-brand-900/80 md:flex">
            {primaryNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="relative hover:text-brand-700 after:absolute after:left-0 after:top-full after:h-px after:w-0 after:bg-brand-700 after:transition-all after:duration-300 hover:after:w-full">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-brand-900 sm:gap-3">
            <Link href="/cuenta" aria-label="Mi cuenta" className="rounded-full p-2 hover:bg-brand-900/5">
              <UserRound className="h-5 w-5" />
            </Link>
            <Link href="/carrito" aria-label="Carrito" className="relative rounded-full p-2 hover:bg-brand-900/5">
              <ShoppingBag className="h-5 w-5" />
              {cart.count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-900 px-1 text-[10px] text-white">
                  {cart.count}
                </span>
              ) : null}
            </Link>
            <details className="group relative md:hidden">
              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-brand-900/10 bg-white/70 text-brand-900 transition hover:bg-white">
                <Menu className="h-5 w-5" />
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-3rem))] overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-paper/95 p-3 shadow-[0_24px_80px_rgba(16,28,48,0.18)] backdrop-blur-xl">
                <div className="rounded-[1.35rem] border border-brand-900/8 bg-white/70 p-4">
                  <p className="eyebrow text-[10px] uppercase text-brand-700/80">Navegacion</p>
                  <div className="mt-4 grid gap-2">
                    {primaryNavigation.map((item) => (
                      <Link key={item.href} href={item.href} className="rounded-[1rem] px-4 py-3 text-sm tracking-[0.08em] text-brand-900/82 transition hover:bg-brand-900/5 hover:text-brand-700">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link href="/cuenta" className="rounded-[1.15rem] border border-brand-900/8 bg-white/70 px-4 py-3 text-sm text-brand-900/82 transition hover:bg-white">
                    Mi cuenta
                  </Link>
                  <Link href="/carrito" className="rounded-[1.15rem] border border-brand-900/8 bg-brand-900 px-4 py-3 text-sm text-white transition hover:bg-brand-700">
                    Carrito{cart.count > 0 ? ` (${cart.count})` : ""}
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
