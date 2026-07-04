"use client";

import Link from "next/link";
import { useState } from "react";

import { useFamily } from "@/providers/FamilyProvider";

export default function SideMenu() {
  const { family } = useFamily();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard", icon: "🏠", label: "Accueil" },
    { href: "/memories", icon: "❤️", label: "Souvenirs" },
    { href: "/gallery", icon: "📸", label: "Galerie" },
    { href: "/growth", icon: "📈", label: "Croissance" },
    { href: "/health", icon: "🩺", label: "Santé" },
    { href: "/timeline", icon: "📖", label: "Timeline" },
    { href: "/profile", icon: "👶", label: "Profil" },
    { href: "/settings", icon: "⚙️", label: "Paramètres" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#7C9A7A] text-xl text-white shadow-lg transition hover:bg-[#6D8B6B]"
      >
        ☰
      </button>

      <div
        className={`fixed inset-0 z-50 transition ${
          open ? "visible bg-black/40" : "invisible bg-black/0"
        }`}
        onClick={() => setOpen(false)}
      >
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-0 top-0 flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* En-tête */}
          <div className="bg-[#7C9A7A] px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              {family.profilePhoto ? (
                <img
                  src={family.profilePhoto}
                  alt="Profil"
                  className="h-16 w-16 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl">
                  👶
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold">
                  {family.childName || "Mon enfant"}
                </h2>

                {family.birthDate && (
                  <p className="text-sm text-green-100">
                    Né(e) le{" "}
                    {new Date(family.birthDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3 text-black transition hover:bg-[#EDF5EC]"
                >
                  <span className="text-2xl">{link.icon}</span>

                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            <hr className="my-8" />

            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Bientôt
            </p>

            <div className="space-y-2 text-gray-500">
              <p>☁️ Synchronisation</p>
              <p>📤 Export PDF</p>
              <p>🔔 Notifications</p>
            </div>
          </nav>

          {/* Pied */}
          <div className="border-t border-gray-200 p-6 text-center text-sm text-gray-500">
            Legacy V1 Beta
          </div>
        </aside>
      </div>
    </>
  );
}