import Card from "@/components/ui/Card";

type Props = {
  childName: string;
  isBorn: boolean | null;
  birthDate: string;
  pregnancyDate: string;
};

export default function ChildHeroCard({
  childName,
  isBorn,
}: Props) {
  return (
    <Card>
      <div className="flex items-center gap-5">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F8F6F2] text-5xl">
          👶
        </div>

        <div>
          <p className="text-sm font-semibold text-black">
            Livre de vie
          </p>

          <h2 className="mt-2 text-4xl font-bold text-black">
            {childName || "Votre enfant"}
          </h2>

          <p className="mt-2 text-black">
            {isBorn === false
              ? "Votre histoire commence déjà."
              : "Votre histoire commence ici."}
          </p>
        </div>
      </div>
    </Card>
  );
}