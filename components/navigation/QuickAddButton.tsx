"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const actions = [
  {
    href: "/memories",
    icon: "❤️",
    label: "Ajouter un souvenir",
  },
  {
    href: "/gallery",
    icon: "📸",
    label: "Ajouter une photo",
  },
  {
    href: "/growth",
    icon: "📈",
    label: "Ajouter une mesure",
  },
  {
    href: "/health",
    icon: "🩺",
    label: "Ajouter un suivi santé",
  },
];

export default function QuickAddButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hidden =
    pathname === "/" ||
    pathname.startsWith("/onboarding");

  if (hidden) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ajouter une information"
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#5E7A5B] text-3xl font-light text-white shadow-xl transition active:scale-95"
      >
        +
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                Ajouter
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-2xl text-black"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-black shadow-sm transition active:scale-[0.98]"
                >
                  <span className="text-3xl">
                    {action.icon}
                  </span>

                  <span className="font-semibold text-black">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 font-semibold text-black"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
}