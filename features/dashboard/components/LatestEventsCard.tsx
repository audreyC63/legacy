import Card from "@/components/ui/Card";

const events = [
  {
    icon: "🐺",
    title: "Legacy est prêt",
    description: "Votre livre de vie peut commencer.",
  },
  {
    icon: "❤️",
    title: "Premier souvenir",
    description: "Ajoutez bientôt votre premier moment précieux.",
  },
];

export default function LatestEventsCard() {
  return (
    <Card>
      <p className="text-sm text-black">Derniers événements</p>

      <div className="mt-4 space-y-4">
        {events.map((event) => (
          <div key={event.title} className="flex gap-3">
            <div className="text-2xl">{event.icon}</div>

            <div>
              <p className="font-semibold text-black">{event.title}</p>
              <p className="text-sm text-black">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}