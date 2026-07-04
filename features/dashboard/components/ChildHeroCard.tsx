import Card from "@/components/ui/Card";
import { getAgeLabel, getDaysUntilLabel } from "@/utils/dateUtils";

type ChildHeroCardProps = {
  childName: string;
  isBorn: boolean | null;
  birthDate: string;
  pregnancyDate: string;
};

export default function ChildHeroCard({
  childName,
  isBorn,
  birthDate,
  pregnancyDate,
}: ChildHeroCardProps) {
  const subtitle =
    isBorn === false
      ? getDaysUntilLabel(pregnancyDate)
      : getAgeLabel(birthDate);

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F8F6F2] text-4xl">
          👶
        </div>

        <div>
          <p className="text-sm text-black">Livre de vie</p>

          <h2 className="mt-1 text-3xl font-bold text-[#2F2F2F]">
            {childName || "Votre enfant"}
          </h2>

          <p className="mt-1 text-[#6B6B6B]">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}