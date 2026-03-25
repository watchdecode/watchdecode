import Link from "next/link";

const socialLinks = [
  { href: "https://x.com", label: "X" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://youtube.com", label: "YouTube" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-zinc-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <p className="text-sm text-zinc-600">
          © {new Date().getFullYear()} WatchDecode. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" className="text-sm text-zinc-700 transition hover:text-zinc-900">
            Privacy
          </Link>
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-zinc-700 transition hover:text-zinc-900"
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
