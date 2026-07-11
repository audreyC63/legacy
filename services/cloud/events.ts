import { supabase } from "@/lib/supabase/client";
import { EventType, LegacyEvent } from "@/types/Event";

type EventRow = {
  id: string;
  family_id: string;
  child_id: string;
  type: EventType;
  title: string;
  description: string;
  event_date: string;
  favorite: boolean;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

type CreateCloudEventInput = {
  familyId: string;
  childId: string;
  type: EventType;
  title: string;
  description?: string;
  date?: string;
  favorite?: boolean;
  metadata?: Record<string, unknown>;
};

type UpdateCloudEventInput = {
  title?: string;
  description?: string;
  date?: string;
  favorite?: boolean;
  metadata?: Record<string, unknown>;
};

function mapEventRow(row: EventRow): LegacyEvent {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description ?? "",
    date: row.event_date,
    createdAt: row.created_at,
    images: [],
    favorite: row.favorite,
  };
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "Vous devez être connecté pour modifier les événements."
    );
  }

  return user.id;
}

export async function getCloudEvents(
  familyId: string,
  childId: string
): Promise<LegacyEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
        id,
        family_id,
        child_id,
        type,
        title,
        description,
        event_date,
        favorite,
        created_at,
        metadata
      `
    )
    .eq("family_id", familyId)
    .eq("child_id", childId)
    .order("event_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as EventRow[]).map(mapEventRow);
}

export async function createCloudEvent(
  input: CreateCloudEventInput
): Promise<LegacyEvent> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("events")
    .insert({
      family_id: input.familyId,
      child_id: input.childId,
      type: input.type,
      title: input.title,
      description: input.description ?? "",
      event_date:
        input.date ?? new Date().toISOString(),
      favorite: input.favorite ?? false,
      metadata: input.metadata ?? {},
      created_by: userId,
      updated_by: userId,
    })
    .select(
      `
        id,
        family_id,
        child_id,
        type,
        title,
        description,
        event_date,
        favorite,
        created_at,
        metadata
      `
    )
    .single<EventRow>();

  if (error) {
    throw error;
  }

  return mapEventRow(data);
}

export async function updateCloudEvent(
  eventId: string,
  input: UpdateCloudEventInput
): Promise<LegacyEvent> {
  const userId = await getCurrentUserId();

  const payload: Record<string, unknown> = {
    updated_by: userId,
  };

  if (input.title !== undefined) {
    payload.title = input.title;
  }

  if (input.description !== undefined) {
    payload.description = input.description;
  }

  if (input.date !== undefined) {
    payload.event_date = input.date;
  }

  if (input.favorite !== undefined) {
    payload.favorite = input.favorite;
  }

  if (input.metadata !== undefined) {
    payload.metadata = input.metadata;
  }

  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", eventId)
    .select(
      `
        id,
        family_id,
        child_id,
        type,
        title,
        description,
        event_date,
        favorite,
        created_at,
        metadata
      `
    )
    .single<EventRow>();

  if (error) {
    throw error;
  }

  return mapEventRow(data);
}

export async function deleteCloudEvent(
  eventId: string
): Promise<void> {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    throw error;
  }
}

export async function toggleCloudFavorite(
  eventId: string,
  favorite: boolean
): Promise<LegacyEvent> {
  return updateCloudEvent(eventId, {
    favorite,
  });
}