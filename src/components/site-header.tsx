import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-100">
          WatchDecode
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-zinc-300 transition hover:text-zinc-100">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
