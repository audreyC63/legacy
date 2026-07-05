import Link from "next/link";

import Card from "@/components/ui/Card";

const actions = [
  { icon: "❤️", label: "Souvenirs", href: "/memories" },
  { icon: "📖", label: "Timeline", href: "/timeline" },
  { icon: "📈", label: "Croissance", href: "/growth" },
  { icon: "🩺", label: "Santé", href: "/health" },
];

export default function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Card>
            <p className="text-3xl">{action.icon}</p>

            <p className="mt-4 font-semibold text-black">
              {action.label}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}