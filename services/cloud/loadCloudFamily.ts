import { supabase } from "@/lib/supabase/client";
import { Family } from "@/types/Family";

type FamilyMemberRow = {
  family_id: string;
};

type ChildRow = {
  id: string;
  family_id: string;
  first_name: string;
  is_born: boolean | null;
  birth_date: string | null;
  expected_birth_date: string | null;
  profile_photo_path: string | null;
  birth_place: string | null;
  birth_weight_kg: number | null;
  birth_height_cm: number | null;
  blood_group: string | null;
  eye_color: string | null;
  hair_color: string | null;
};

export type CloudFamilyResult = {
  familyId: string;
  childId: string;
  family: Partial<Family>;
};

export async function loadCloudFamily(): Promise<CloudFamilyResult | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle<FamilyMemberRow>();

  if (membershipError) {
    throw membershipError;
  }

  if (!membership) {
    return null;
  }

  const {
    data: child,
    error: childError,
  } = await supabase
    .from("children")
    .select(
      `
        id,
        family_id,
        first_name,
        is_born,
        birth_date,
        expected_birth_date,
        profile_photo_path,
        birth_place,
        birth_weight_kg,
        birth_height_cm,
        blood_group,
        eye_color,
        hair_color
      `
    )
    .eq("family_id", membership.family_id)
    .limit(1)
    .maybeSingle<ChildRow>();

  if (childError) {
    throw childError;
  }

  if (!child) {
    return null;
  }

  return {
    familyId: membership.family_id,
    childId: child.id,

    family: {
      childName: child.first_name,
      isBorn: child.is_born,
      birthDate: child.birth_date ?? "",
      pregnancyDate: child.expected_birth_date ?? "",
      birthPlace: child.birth_place ?? "",
      birthWeight:
        child.birth_weight_kg === null
          ? ""
          : String(child.birth_weight_kg),
      birthHeight:
        child.birth_height_cm === null
          ? ""
          : String(child.birth_height_cm),
      bloodGroup: child.blood_group ?? "",
      eyeColor: child.eye_color ?? "",
      hairColor: child.hair_color ?? "",
    },
  };
}