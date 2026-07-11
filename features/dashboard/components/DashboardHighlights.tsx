"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function DashboardHighlights() {
  const { family } = useFamily();

  const events = family.events ?? [];

  const favorites = [...events]
    .filter((event) => event.favorite)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 3);

  const today = new Date();

  const anniversaryEvents = [...events]
    .filter((event) => {
      const eventDate = new Date(event.date);

      return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() < today.getFullYear()
      );
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-black">
            ⭐ Vos favoris
          </h2>

          <Link
            href="/timeline"
            className="text-sm font-semibold text-[#5E7A5B]"
          >
            Voir tout
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {favorites.length === 0 ? (
            <p className="text-black">
              Aucun favori pour le moment.
            </p>
          ) : (
            favorites.map((event) => (
              <div
                key={event.id}
                className="flex gap-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
              >
                {event.images?.[0] ? (
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#EDF5EC] text-2xl">
                    ⭐
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-semibold text-black">
                    {event.title}
                  </p>

                  <p className="mt-1 text-sm text-black">
                    {new Date(event.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-black">
          📅 Aujourd’hui dans vos souvenirs
        </h2>

        <div className="mt-5 space-y-4">
          {anniversaryEvents.length === 0 ? (
            <p className="text-black">
              Aucun souvenir à cette date pour le moment.
            </p>
          ) : (
            anniversaryEvents.map((event) => {
              const eventDate = new Date(event.date);
              const yearsAgo =
                today.getFullYear() - eventDate.getFullYear();

              return (
                <div
                  key={event.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="font-semibold text-black">
                    Il y a {yearsAgo} an{yearsAgo > 1 ? "s" : ""}
                  </p>

                  <p className="mt-1 text-black">
                    {event.title}
                  </p>

                  {event.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-black">
                      {event.description}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}