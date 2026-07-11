"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useFamily } from "@/providers/FamilyProvider";

export default function SideMenu() {
  const { family } = useFamily();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="fixed left-5 top-5 z-50 rounded-xl bg-white p-3 shadow-lg"
        aria-label="Menu"
      >
        ☰
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-5 top-5 z-50 rounded-xl bg-white p-3 shadow-lg"
        aria-label="Menu"
      >
        ☰
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl"
          >
            <div className="bg-[#7C9A7A] p-6 text-white">
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
                  <h2 className="font-bold">
                    {family.childName || "Legacy"}
                  </h2>

                  <p className="text-sm">
                    {family.parentOne || "Famille"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col p-4">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                🏠 Accueil
              </Link>

              <Link
                href="/timeline"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                📖 Timeline
              </Link>

              <Link
                href="/memories"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                ❤️ Souvenirs
              </Link>

              <Link
                href="/gallery"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                📸 Galerie
              </Link>

              <Link
                href="/growth"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                📈 Croissance
              </Link>

              <Link
                href="/health"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                🩺 Santé
              </Link>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                👤 Profil
              </Link>

              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-gray-100"
              >
                ⚙️ Paramètres
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}