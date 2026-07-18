"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createBottleEntry,
  createDiaperEntry,
  deleteBabyCareEntry,
  getActiveBabyContext,
  getTodayBabyCareEntries,
  subscribeToBabyCareEntries,
} from "@/features/baby/services/baby-care";

import type {
  BabyCareEntry,
  BabyContext,
  DiaperContent,
} from "@/features/baby/types";

type FormMode = "bottle" | "diaper";

const bottlePresets = [30, 60, 90, 120, 150, 180];

const diaperOptions: Array<{
  value: DiaperContent;
  emoji: string;
  label: string;
}> = [
  {
    value: "pee",
    emoji: "💧",
    label: "Pipi",
  },
  {
    value: "poop",
    emoji: "💩",
    label: "Caca",
  },
  {
    value: "mixed",
    emoji: "💧💩",
    label: "Pipi + caca",
  },
  {
    value: "dry",
    emoji: "✓",
    label: "Sèche",
  },
];

function formatTime(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDuration(date: string): string {
  const elapsedMilliseconds =
    Date.now() - new Date(date).getTime();

  const elapsedMinutes = Math.max(
    0,
    Math.floor(elapsedMilliseconds / 60_000),
  );

  if (elapsedMinutes < 1) {
    return "à l'instant";
  }

  if (elapsedMinutes < 60) {
    return `il y a ${elapsedMinutes} min`;
  }

  const hours = Math.floor(elapsedMinutes / 60);
  const remainingMinutes = elapsedMinutes % 60;

  if (remainingMinutes === 0) {
    return `il y a ${hours} h`;
  }

  return `il y a ${hours} h ${remainingMinutes} min`;
}

function getDiaperLabel(
  content: DiaperContent | null,
): string {
  switch (content) {
    case "pee":
      return "Couche pipi";

    case "poop":
      return "Couche caca";

    case "mixed":
      return "Couche pipi + caca";

    case "dry":
      return "Couche sèche";

    default:
      return "Couche";
  }
}

function getDiaperEmoji(
  content: DiaperContent | null,
): string {
  switch (content) {
    case "pee":
      return "💧";

    case "poop":
      return "💩";

    case "mixed":
      return "💧💩";

    case "dry":
      return "✓";

    default:
      return "👶";
  }
}

export default function BabyTracker() {
  const [context, setContext] =
    useState<BabyContext | null>(null);

  const [entries, setEntries] = useState<BabyCareEntry[]>([]);
  const [mode, setMode] = useState<FormMode>("bottle");

  const [amount, setAmount] = useState("90");

  const [diaperContent, setDiaperContent] =
    useState<DiaperContent>("pee");

  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadEntries = useCallback(
    async (currentContext: BabyContext) => {
      const result = await getTodayBabyCareEntries(
        currentContext.familyId,
        currentContext.childId,
      );

      setEntries(result);
    },
    [],
  );

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function initialize() {
      try {
        setLoading(true);
        setError(null);

        const activeContext = await getActiveBabyContext();

        if (cancelled) {
          return;
        }

        setContext(activeContext);
        await loadEntries(activeContext);

        unsubscribe = subscribeToBabyCareEntries(
          activeContext.familyId,
          activeContext.childId,
          () => {
            void loadEntries(activeContext);
          },
        );
      } catch (initializationError) {
        if (cancelled) {
          return;
        }

        setError(
          initializationError instanceof Error
            ? initializationError.message
            : "Impossible de charger le journal.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [loadEntries]);

  const bottleEntries = useMemo(
    () =>
      entries.filter(
        (entry) => entry.entry_type === "bottle",
      ),
    [entries],
  );

  const diaperEntries = useMemo(
    () =>
      entries.filter(
        (entry) => entry.entry_type === "diaper",
      ),
    [entries],
  );

  const totalBottleMl = useMemo(
    () =>
      bottleEntries.reduce(
        (total, entry) => total + (entry.amount_ml ?? 0),
        0,
      ),
    [bottleEntries],
  );

  const lastBottle = bottleEntries[0] ?? null;
  const lastDiaper = diaperEntries[0] ?? null;

  async function handleSaveBottle() {
    if (!context) {
      return;
    }

    const parsedAmount = Number(amount);

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setError("Entre une quantité valide en millilitres.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await createBottleEntry({
        familyId: context.familyId,
        childId: context.childId,
        amountMl: parsedAmount,
        note,
      });

      setNote("");
      setSuccess(`Biberon de ${parsedAmount} ml enregistré.`);
      await loadEntries(context);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer le biberon.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveDiaper() {
    if (!context) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await createDiaperEntry({
        familyId: context.familyId,
        childId: context.childId,
        content: diaperContent,
        note,
      });

      setNote("");
      setSuccess("Couche enregistrée.");
      await loadEntries(context);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer la couche.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entryId: string) {
    if (!context) {
      return;
    }

    const confirmed = window.confirm(
      "Supprimer cette entrée du journal ?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      await deleteBabyCareEntry(entryId);
      await loadEntries(context);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer cette entrée.",
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-center text-slate-600">
            Chargement du journal…
          </p>
        </div>
      </main>
    );
  }

  if (!context) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Journal du bébé
          </h1>

          <p className="mt-4 text-sm text-red-600">
            {error ??
              "Impossible de trouver la famille ou l'enfant."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-xl px-4 py-6">
        <header className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                ● Synchronisation active
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Journal du bébé
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Biberons et couches d’aujourd’hui
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl">
              👶
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-2xl">🍼</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalBottleMl} ml
            </p>

            <p className="text-sm text-slate-500">
              {bottleEntries.length} biberon
              {bottleEntries.length > 1 ? "s" : ""}
            </p>

            {lastBottle && (
              <p className="mt-2 text-xs font-medium text-slate-600">
                Dernier {formatDuration(lastBottle.occurred_at)}
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-2xl">💧💩</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {diaperEntries.length}
            </p>

            <p className="text-sm text-slate-500">
              couche{diaperEntries.length > 1 ? "s" : ""}
            </p>

            {lastDiaper && (
              <p className="mt-2 text-xs font-medium text-slate-600">
                Dernière {formatDuration(lastDiaper.occurred_at)}
              </p>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("bottle");
                setSuccess(null);
              }}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                mode === "bottle"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              🍼 Biberon
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("diaper");
                setSuccess(null);
              }}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                mode === "diaper"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              💧💩 Couche
            </button>
          </div>

          {mode === "bottle" ? (
            <div className="mt-5">
              <label
                htmlFor="bottle-amount"
                className="block text-sm font-semibold text-slate-700"
              >
                Quantité du biberon
              </label>

              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-white px-4">
                <input
                  id="bottle-amount"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  className="min-w-0 flex-1 bg-transparent py-4 text-3xl font-bold text-slate-900 outline-none"
                />

                <span className="text-lg font-semibold text-slate-500">
                  ml
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {bottlePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                      amount === String(preset)
                        ? "border-amber-500 bg-amber-50 text-amber-800"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {preset} ml
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-700">
                Contenu de la couche
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {diaperOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setDiaperContent(option.value)
                    }
                    className={`rounded-2xl border p-4 text-left ${
                      diaperContent === option.value
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <span className="block text-2xl">
                      {option.emoji}
                    </span>

                    <span className="mt-2 block text-sm font-semibold text-slate-800">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <label
              htmlFor="baby-note"
              className="block text-sm font-semibold text-slate-700"
            >
              Note facultative
            </label>

            <input
              id="baby-note"
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ex. a bien bu, selle liquide…"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-amber-500"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </p>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (mode === "bottle") {
                void handleSaveBottle();
              } else {
                void handleSaveDiaper();
              }
            }}
            className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Enregistrement…"
              : mode === "bottle"
                ? "Enregistrer le biberon"
                : "Enregistrer la couche"}
          </button>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Aujourd’hui
            </h2>

            <span className="text-sm text-slate-500">
              {entries.length} entrée
              {entries.length > 1 ? "s" : ""}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="mt-3 rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="text-4xl">👶</p>

              <p className="mt-3 font-semibold text-slate-800">
                Rien d’enregistré aujourd’hui
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Le premier biberon ou changement de couche
                apparaîtra ici.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {entries.map((entry) => {
                const isBottle =
                  entry.entry_type === "bottle";

                return (
                  <article
                    key={entry.id}
                    className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                        isBottle
                          ? "bg-amber-100"
                          : "bg-sky-100"
                      }`}
                    >
                      {isBottle
                        ? "🍼"
                        : getDiaperEmoji(
                            entry.diaper_content,
                          )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-slate-900">
                          {isBottle
                            ? `${entry.amount_ml} ml`
                            : getDiaperLabel(
                                entry.diaper_content,
                              )}
                        </h3>

                        <time className="shrink-0 text-sm font-semibold text-slate-500">
                          {formatTime(entry.occurred_at)}
                        </time>
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatDuration(entry.occurred_at)}
                      </p>

                      {entry.note && (
                        <p className="mt-2 text-sm text-slate-600">
                          {entry.note}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      aria-label="Supprimer"
                      onClick={() =>
                        void handleDelete(entry.id)
                      }
                      className="shrink-0 rounded-xl px-2 py-2 text-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      ×
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}