import Card from "@/components/ui/Card";
import { LegacyEvent } from "@/types/Event";

type Props = {
  event: LegacyEvent;
};

export default function TimelineItem({ event }: Props) {
  const icons = {
    memory: "❤️",
    photo: "📸",
    growth: "📈",
    health: "🩺",
    pregnancy: "🤰",
  };

  return (
    <Card>
      <div className="flex gap-4">
        <div className="text-3xl">
          {icons[event.type]}
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString("fr-FR")}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-[#2F2F2F]">
            {event.title}
          </h3>

          {event.description && (
            <p className="mt-2 text-[#6B6B6B]">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}