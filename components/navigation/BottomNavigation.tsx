"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/dashboard",
    icon: "🏠",
    label: "Accueil",
  },
  {
    href: "/memories",
    icon: "❤️",
    label: "Souvenirs",
  },
  {
    href: "/timeline",
    icon: "📖",
    label: "Timeline",
  },
  {
    href: "/health",
    icon: "🩺",
    label: "Santé",
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-md justify-around py-3">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-sm ${
                active
                  ? "font-semibold text-[#7C9A7A]"
                  : "text-gray-500"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}