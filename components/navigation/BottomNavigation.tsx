"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", icon: "🏠", label: "Accueil" },
  { href: "/memories", icon: "❤️", label: "Souvenirs" },
  { href: "/gallery", icon: "📸", label: "Galerie" },
  { href: "/growth", icon: "📈", label: "Croissance" },
  { href: "/health", icon: "🩺", label: "Santé" },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 pb-3 pt-2 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-around px-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-1 text-[11px] transition ${
                active
                  ? "bg-[#EDF5EC] font-semibold text-[#5E7A5B]"
                  : "text-black"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}