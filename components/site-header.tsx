"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { wordmark } from "@/site.config";

// The sticky translucent nav on every page: the "Harriet." wordmark (links home)
// and the three section links. Active state is derived from the current path via
// usePathname — exact match for the journal home, prefix match for the sections
// so a nested route (e.g. /journal/africa) still lights "Journal".

const LINKS: { label: string; href: string }[] = [
  { label: "Journal", href: "/" },
  { label: "Photos", href: "/photos" },
  { label: "About", href: "/about" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/journal");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Primary">
        <Link href="/" className="nav-wordmark">
          {wordmark}.
        </Link>
        <ul className="nav-links">
          {LINKS.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link"
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
