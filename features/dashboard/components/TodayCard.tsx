import Card from "@/components/ui/Card";

type TodayCardProps = {
  isBorn: boolean | null;
};

export default function TodayCard({ isBorn }: TodayCardProps) {
  return (
    <Card>
      <p className="text-sm text-black">Aujourd'hui</p>

      <h3 className="mt-2 text-xl font-semibold text-black">
        {isBorn === false
          ? "Votre histoire commence déjà."
          : "Un nouveau souvenir peut commencer aujourd'hui."}
      </h3>

      <p className="mt-3 text-black">
        Legacy gardera les moments importants, les photos, la santé et les
        grandes étapes au même endroit.
      </p>
    </Card>
  );
}