import { supabase } from "@/lib/supabase/client";

import type {
  BabyCareEntry,
  BabyContext,
  CreateBottleInput,
  CreateDiaperInput,
} from "@/features/baby/types";

function getStoredActiveFamilyId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("legacy-active-family-id");
}

export async function getActiveBabyContext(): Promise<BabyContext> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Vous devez être connecté.");
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("family_members")
    .select("family_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (membershipError) {
    throw membershipError;
  }

  if (!memberships || memberships.length === 0) {
    throw new Error(
      "Votre compte n'est encore associé à aucune famille.",
    );
  }

  const storedFamilyId = getStoredActiveFamilyId();

  const activeMembership =
    memberships.find(
      (membership) => membership.family_id === storedFamilyId,
    ) ?? memberships[0];

  const familyId = activeMembership.family_id;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      "legacy-active-family-id",
      familyId,
    );
  }

  const { data: children, error: childError } = await supabase
    .from("children")
    .select("id, created_at")
    .eq("family_id", familyId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (childError) {
    throw childError;
  }

  if (!children || children.length === 0) {
    throw new Error(
      "Aucun enfant n'est encore associé à cette famille.",
    );
  }

  return {
    userId: user.id,
    familyId,
    childId: children[0].id,
  };
}

export async function getTodayBabyCareEntries(
  familyId: string,
  childId: string,
): Promise<BabyCareEntry[]> {
  const beginningOfDay = new Date();

  beginningOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("baby_care_entries")
    .select("*")
    .eq("family_id", familyId)
    .eq("child_id", childId)
    .gte("occurred_at", beginningOfDay.toISOString())
    .order("occurred_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as BabyCareEntry[];
}

export async function createBottleEntry(
  input: CreateBottleInput,
): Promise<BabyCareEntry> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Vous devez être connecté.");
  }

  const amountMl = Math.round(input.amountMl);

  if (!Number.isFinite(amountMl) || amountMl <= 0) {
    throw new Error("La quantité du biberon est invalide.");
  }

  const { data, error } = await supabase
    .from("baby_care_entries")
    .insert({
      family_id: input.familyId,
      child_id: input.childId,
      created_by: user.id,
      entry_type: "bottle",
      occurred_at: input.occurredAt ?? new Date().toISOString(),
      amount_ml: amountMl,
      diaper_content: null,
      note: input.note?.trim() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as BabyCareEntry;
}

export async function createDiaperEntry(
  input: CreateDiaperInput,
): Promise<BabyCareEntry> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Vous devez être connecté.");
  }

  const { data, error } = await supabase
    .from("baby_care_entries")
    .insert({
      family_id: input.familyId,
      child_id: input.childId,
      created_by: user.id,
      entry_type: "diaper",
      occurred_at: input.occurredAt ?? new Date().toISOString(),
      amount_ml: null,
      diaper_content: input.content,
      note: input.note?.trim() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as BabyCareEntry;
}

export async function deleteBabyCareEntry(
  entryId: string,
): Promise<void> {
  const { error } = await supabase
    .from("baby_care_entries")
    .delete()
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}

export function subscribeToBabyCareEntries(
  familyId: string,
  childId: string,
  onChange: () => void,
): () => void {
  const channel = supabase
    .channel(`baby-care-${familyId}-${childId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "baby_care_entries",
        filter: `family_id=eq.${familyId}`,
      },
      (payload) => {
        const row =
          payload.new &&
          typeof payload.new === "object" &&
          "child_id" in payload.new
            ? payload.new
            : payload.old;

        if (
          row &&
          typeof row === "object" &&
          "child_id" in row &&
          row.child_id !== childId
        ) {
          return;
        }

        onChange();
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}