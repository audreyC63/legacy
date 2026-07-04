import Card from "@/components/ui/Card";
import { LegacyEvent } from "@/types/Event";

type Props = {
  event: LegacyEvent;
};

const styles = {
  memory: {
    icon: "❤️",
    label: "Souvenir",
    bg: "bg-red-50",
  },
  photo: {
    icon: "📸",
    label: "Photo",
    bg: "bg-blue-50",
  },
  growth: {
    icon: "📈",
    label: "Croissance",
    bg: "bg-green-50",
  },
  health: {
    icon: "🩺",
    label: "Santé",
    bg: "bg-yellow-50",
  },
  pregnancy: {
    icon: "🤰",
    label: "Grossesse",
    bg: "bg-purple-50",
  },
};

export default function TimelineItem({ event }: Props) {
  const style = styles[event.type];

  return (
    <Card>
      <div className={`rounded-2xl p-4 ${style.bg}`}>
        <div className="flex gap-4">
          <div className="text-3xl">{style.icon}</div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-black">
              {style.label} • {new Date(event.date).toLocaleDateString("fr-FR")}
            </p>

            <h3 className="mt-1 text-lg font-semibold text-[#2F2F2F]">
              {event.favorite ? "⭐ " : ""}
              {event.title}
            </h3>

            {event.description && (
              <p className="mt-2 whitespace-pre-line text-sm text-[#6B6B6B]">
                {event.description}
              </p>
            )}

            {event.images.length > 0 && (
              <img
                src={event.images[0]}
                alt={event.title}
                className="mt-4 h-48 w-full rounded-2xl object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}