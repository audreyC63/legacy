export type BabyCareEntryType = "bottle" | "diaper";

export type DiaperContent = "pee" | "poop" | "mixed" | "dry";

export interface BabyCareEntry {
  id: string;
  family_id: string;
  child_id: string;
  created_by: string;
  entry_type: BabyCareEntryType;
  occurred_at: string;
  amount_ml: number | null;
  diaper_content: DiaperContent | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface BabyContext {
  userId: string;
  familyId: string;
  childId: string;
}

export interface CreateBottleInput {
  familyId: string;
  childId: string;
  amountMl: number;
  occurredAt?: string;
  note?: string;
}

export interface CreateDiaperInput {
  familyId: string;
  childId: string;
  content: DiaperContent;
  occurredAt?: string;
  note?: string;
}