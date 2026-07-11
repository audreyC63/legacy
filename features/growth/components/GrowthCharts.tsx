"use client";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

type Measure = {
  date: string;
  value: number;
};

function extractMeasure(description: string, label: string) {
  const line = description
    .split("\n")
    .find((item) => item.startsWith(label));

  if (!line) return null;

  const rawValue = line
    .replace(label, "")
    .replace(",", ".")
    .trim()
    .split(" ")[0];

  const value = Number(rawValue);

  return Number.isFinite(value) ? value : null;
}

function LineChart({
  title,
  unit,
  measures,
}: {
  title: string;
  unit: string;
  measures: Measure[];
}) {
  if (measures.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <h3 className="font-semibold text-black">{title}</h3>

        <p className="mt-3 text-sm text-black">
          Aucune donnée enregistrée.
        </p>
      </div>
    );
  }

  const width = 320;
  const height = 190;
  const padding = 28;

  const values = measures.map((measure) => measure.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;

  const points = measures.map((measure, index) => {
    const x =
      measures.length === 1
        ? width / 2
        : padding +
          (index * (width - padding * 2)) /
            (measures.length - 1);

    const y =
      height -
      padding -
      ((measure.value - minimum) / range) *
        (height - padding * 2);

    return {
      ...measure,
      x,
      y,
    };
  });

  const polylinePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-black">{title}</h3>

        <p className="text-sm font-semibold text-black">
          Dernière mesure : {measures[measures.length - 1].value} {unit}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto min-w-[320px] w-full"
          role="img"
          aria-label={`Courbe ${title}`}
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#9CA3AF"
            strokeWidth="1"
          />

          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#9CA3AF"
            strokeWidth="1"
          />

          {points.length > 1 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#5E7A5B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((point) => (
            <g key={`${point.date}-${point.value}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#5E7A5B"
              />

              <text
                x={point.x}
                y={point.y - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#000000"
              >
                {point.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 flex justify-between gap-3 text-xs text-black">
        <span>
          {new Date(measures[0].date).toLocaleDateString("fr-FR")}
        </span>

        <span>
          {new Date(
            measures[measures.length - 1].date
          ).toLocaleDateString("fr-FR")}
        </span>
      </div>
    </div>
  );
}

export default function GrowthCharts() {
  const { family } = useFamily();

  const growthEvents = [...(family.events ?? [])]
    .filter((event) => event.type === "growth")
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

  const weights = growthEvents
    .map((event) => {
      const value = extractMeasure(
        event.description,
        "Poids :"
      );

      return value === null
        ? null
        : {
            date: event.date,
            value,
          };
    })
    .filter((measure): measure is Measure => measure !== null);

  const heights = growthEvents
    .map((event) => {
      const value = extractMeasure(
        event.description,
        "Taille :"
      );

      return value === null
        ? null
        : {
            date: event.date,
            value,
          };
    })
    .filter((measure): measure is Measure => measure !== null);

  const headMeasurements = growthEvents
    .map((event) => {
      const value = extractMeasure(
        event.description,
        "Périmètre crânien :"
      );

      return value === null
        ? null
        : {
            date: event.date,
            value,
          };
    })
    .filter((measure): measure is Measure => measure !== null);

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        Courbes de croissance
      </h2>

      <p className="mt-2 text-black">
        Suivez l’évolution des mesures au fil du temps.
      </p>

      <div className="mt-6 space-y-6">
        <LineChart
          title="⚖️ Poids"
          unit="kg"
          measures={weights}
        />

        <LineChart
          title="📏 Taille"
          unit="cm"
          measures={heights}
        />

        <LineChart
          title="🧠 Périmètre crânien"
          unit="cm"
          measures={headMeasurements}
        />
      </div>
    </Card>
  );
}