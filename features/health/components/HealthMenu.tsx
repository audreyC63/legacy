"use client";

import Card from "@/components/ui/Card";

export type HealthTab =
  | "temperature"
  | "medication"
  | "vaccines"
  | "hospitalizations"
  | "allergies"
  | "documents";

type Props = {
  selected: HealthTab;
  onSelect: (tab: HealthTab) => void;
};

const items: { icon: string; label: string; value: HealthTab }[] = [
  { icon: "🌡️", label: "Température", value: "temperature" },
  { icon: "💊", label: "Médicaments", value: "medication" },
  { icon: "💉", label: "Vaccins", value: "vaccines" },
  { icon: "🏥", label: "Hospitalisations", value: "hospitalizations" },
  { icon: "🤧", label: "Allergies", value: "allergies" },
  { icon: "📄", label: "Documents", value: "documents" },
];

export default function HealthMenu({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.value}
          onClick={() => onSelect(item.value)}
          className="cursor-pointer"
        >
          <Card>
            <div
              className={`flex flex-col items-center rounded-2xl py-4 ${
                selected === item.value
                  ? "bg-[#EDF5EC]"
                  : ""
              }`}
            >
              <div className="text-4xl">{item.icon}</div>

              <p className="mt-3 text-center font-semibold">
                {item.label}
              </p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}