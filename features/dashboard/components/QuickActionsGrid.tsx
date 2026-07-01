import Card from "@/components/ui/Card";

const actions = [
  { icon: "❤️", label: "Souvenir" },
  { icon: "📸", label: "Photo" },
  { icon: "📈", label: "Croissance" },
  { icon: "🩺", label: "Santé" },
];

export default function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Card key={action.label}>
          <p className="text-2xl">{action.icon}</p>
          <p className="mt-2 font-semibold text-[#2F2F2F]">
            {action.label}
          </p>
        </Card>
      ))}
    </div>
  );
}