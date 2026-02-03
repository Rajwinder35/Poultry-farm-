import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-semibold text-farm-700">
          Chahal Farm
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-farm-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-farm-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-farm-700"
        >
          Request Order
        </Link>
      </div>
      <nav className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 text-xs font-medium text-slate-600 md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-farm-600">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
