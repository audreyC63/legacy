import { supabase } from "@/lib/supabase/client";

import { getActiveBabyContext } from "@/features/baby/services/baby-care";

export interface CloudChildProfile {
  childName: string;
  birthDate: string;
  birthPlace: string;
  birthWeight: string;
  birthHeight: string;
  bloodGroup: string;
  eyeColor: string;
  hairColor: string;
  profilePhoto: string;
}

type ChildProfileRow = {
  id: string;
  first_name: string | null;
  birth_date: string | null;
  birth_place: string | null;
  birth_weight_kg: number | null;
  birth_height_cm: number | null;
  blood_group: string | null;
  eye_color: string | null;
  hair_color: string | null;
  profile_photo_path: string | null;
};

export const emptyCloudChildProfile: CloudChildProfile = {
  childName: "",
  birthDate: "",
  birthPlace: "",
  birthWeight: "",
  birthHeight: "",
  bloodGroup: "",
  eyeColor: "",
  hairColor: "",
  profilePhoto: "",
};

function numberToString(
  value: number | null,
): string {
  return value === null ? "" : String(value);
}

function stringToNumber(
  value: string,
): number | null {
  const normalizedValue = value
    .trim()
    .replace(",", ".");

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
}

function mapRowToProfile(
  row: ChildProfileRow,
): CloudChildProfile {
  return {
    childName: row.first_name ?? "",
    birthDate: row.birth_date ?? "",
    birthPlace: row.birth_place ?? "",
    birthWeight: numberToString(
      row.birth_weight_kg,
    ),
    birthHeight: numberToString(
      row.birth_height_cm,
    ),
    bloodGroup: row.blood_group ?? "",
    eyeColor: row.eye_color ?? "",
    hairColor: row.hair_color ?? "",
    profilePhoto: row.profile_photo_path ?? "",
  };
}

const childProfileColumns = `
  id,
  first_name,
  birth_date,
  birth_place,
  birth_weight_kg,
  birth_height_cm,
  blood_group,
  eye_color,
  hair_color,
  profile_photo_path
`;

export async function getChildProfile(): Promise<{
  childId: string;
  profile: CloudChildProfile;
}> {
  const context = await getActiveBabyContext();

  const { data, error } = await supabase
    .from("children")
    .select(childProfileColumns)
    .eq("id", context.childId)
    .eq("family_id", context.familyId)
    .single();

  if (error) {
    throw error;
  }

  const child = data as ChildProfileRow;

  return {
    childId: child.id,
    profile: mapRowToProfile(child),
  };
}

export async function saveChildProfile(
  profile: CloudChildProfile,
): Promise<CloudChildProfile> {
  const context = await getActiveBabyContext();

  const childName = profile.childName.trim();
  const birthDate = profile.birthDate.trim();

  if (!childName) {
    throw new Error(
      "Le prénom de l'enfant est obligatoire.",
    );
  }

  const { data, error } = await supabase
    .from("children")
    .update({
      first_name: childName,
      birth_date: birthDate || null,

      /*
       * Dès qu'une date de naissance existe,
       * l'enfant est considéré comme né.
       */
      is_born: Boolean(birthDate),

      birth_place:
        profile.birthPlace.trim() || null,

      birth_weight_kg: stringToNumber(
        profile.birthWeight,
      ),

      birth_height_cm: stringToNumber(
        profile.birthHeight,
      ),

      blood_group:
        profile.bloodGroup.trim() || null,

      eye_color:
        profile.eyeColor.trim() || null,

      hair_color:
        profile.hairColor.trim() || null,

      /*
       * Temporairement, cette colonne reçoit l'image
       * compressée. Elle pourra être déplacée ensuite
       * dans Supabase Storage.
       */
      profile_photo_path:
        profile.profilePhoto || null,
    })
    .eq("id", context.childId)
    .eq("family_id", context.familyId)
    .select(childProfileColumns)
    .single();

  if (error) {
    throw error;
  }

  return mapRowToProfile(
    data as ChildProfileRow,
  );
}