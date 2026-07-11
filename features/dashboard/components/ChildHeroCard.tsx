"use client";

import Card from "@/components/ui/Card";

type Props = {
  childName: string;
  isBorn: boolean | null;
  birthDate: string;
  pregnancyDate: string;
  profilePhoto?: string;
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const PREGNANCY_DURATION_DAYS = 280;

function parseInputDate(value: string) {
  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function getToday() {
  const today = new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
}

function calculateAge(birthDate: string) {
  const birth = parseInputDate(birthDate);

  if (!birth) return "";

  const today = getToday();

  let years =
    today.getFullYear() - birth.getFullYear();

  let months =
    today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 1) {
    const totalDays = Math.max(
      Math.floor(
        (today.getTime() - birth.getTime()) /
          DAY_IN_MS
      ),
      0
    );

    const totalMonths = Math.floor(
      totalDays / 30.4375
    );

    if (totalMonths < 1) {
      return `${totalDays} jour${
        totalDays > 1 ? "s" : ""
      }`;
    }

    return `${totalMonths} mois`;
  }

  return `${years} an${
    years > 1 ? "s" : ""
  } • ${months} mois`;
}

function calculatePregnancy(dueDateValue: string) {
  const dueDate = parseInputDate(dueDateValue);

  if (!dueDate) {
    return {
      progress: "",
      remaining: "",
    };
  }

  const today = getToday();

  const remainingDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) /
      DAY_IN_MS
  );

  if (remainingDays < 0) {
    return {
      progress: "La date prévue est dépassée",
      remaining: "",
    };
  }

  const elapsedDays = Math.max(
    PREGNANCY_DURATION_DAYS - remainingDays,
    0
  );

  const weeks = Math.min(
    Math.floor(elapsedDays / 7),
    40
  );

  const extraDays = elapsedDays % 7;

  const progress =
    extraDays > 0
      ? `${weeks} semaines + ${extraDays} jour${
          extraDays > 1 ? "s" : ""
        }`
      : `${weeks} semaine${
          weeks > 1 ? "s" : ""
        } de grossesse`;

  const remaining =
    remainingDays === 0
      ? "La rencontre est prévue aujourd’hui ❤️"
      : `Plus que ${remainingDays} jour${
          remainingDays > 1 ? "s" : ""
        } avant votre rencontre`;

  return {
    progress,
    remaining,
  };
}

export default function ChildHeroCard({
  childName,
  isBorn,
  birthDate,
  pregnancyDate,
  profilePhoto,
}: Props) {
  const pregnancy =
    calculatePregnancy(pregnancyDate);

  return (
    <Card>
      <div className="flex items-center gap-5">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={childName || "Photo de l'enfant"}
            className="h-24 w-24 shrink-0 rounded-full border-4 border-[#EDF5EC] object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#EDF5EC] text-5xl shadow-sm">
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

          {isBorn === true ? (
            <p className="mt-2 font-medium text-black">
              {calculateAge(birthDate) ||
                "Date de naissance à compléter"}
            </p>
          ) : isBorn === false ? (
            <>
              <p className="mt-2 font-medium text-black">
                {pregnancy.progress ||
                  "Date prévue à compléter"}
              </p>

              {pregnancy.remaining && (
                <p className="mt-1 text-sm text-black">
                  {pregnancy.remaining}
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 font-medium text-black">
              Profil à compléter
            </p>
          )}

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