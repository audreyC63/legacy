"use client";

import Button from "@/components/ui/Button";

type Filter = "all" | "memory" | "photo" | "growth" | "health";

type Props = {
  value: Filter;
  onChange: (value: Filter) => void;
};

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "memory", label: "❤️ Souvenirs" },
  { value: "photo", label: "📸 Photos" },
  { value: "growth", label: "📈 Croissance" },
  { value: "health", label: "🩺 Santé" },
];

export default function TimelineFilters({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}