"use client";

import Card from "@/components/ui/Card";

type Props = {
  childName: string;
  isBorn: boolean | null;
  birthDate: string;
  pregnancyDate: string;
  profilePhoto?: string;
};

function calculateAge(birthDate: string) {
  if (!birthDate) return "";

  const birth = new Date(birthDate);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years <= 0) {
    return `${Math.max(months, 0)} mois`;
  }

  return `${years} an${years > 1 ? "s" : ""} • ${months} mois`;
}

function calculatePregnancy(pregnancyDate: string) {
  if (!pregnancyDate) return "";

  const start = new Date(pregnancyDate);
  const today = new Date();

  const days = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const weeks = Math.max(Math.floor(days / 7), 0);

  return `${weeks} semaine${weeks > 1 ? "s" : ""} de grossesse`;
}

export default function ChildHeroCard({
  childName,
  isBorn,
  birthDate,
  pregnancyDate,
  profilePhoto,
}: Props) {
  return (
    <Card>
      <div className="flex items-center gap-5">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={childName || "Photo de l'enfant"}
            className="h-24 w-24 rounded-full border-4 border-[#EDF5EC] object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EDF5EC] text-5xl shadow-sm">
            👶
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#5E7A5B]">
            Livre de vie
          </p>

          <h2 className="mt-1 break-words text-3xl font-bold text-black">
            {childName || "Votre enfant"}
          </h2>

          <p className="mt-2 font-medium text-black">
            {isBorn === true
              ? calculateAge(birthDate) || "Date de naissance à compléter"
              : isBorn === false
                ? calculatePregnancy(pregnancyDate) ||
                  "Date de grossesse à compléter"
                : "Profil à compléter"}
          </p>

          <p className="mt-2 text-sm text-black">
            {isBorn === true
              ? "Chaque souvenir construit son histoire ❤️"
              : isBorn === false
                ? "L’aventure commence déjà 🤰"
                : "Bienvenue dans votre livre de vie."}
          </p>
        </div>
      </div>
    </Card>
  );
}