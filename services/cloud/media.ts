import { supabase } from "@/lib/supabase/client";

const BUCKET_NAME = "family-media";
const SIGNED_URL_DURATION = 60 * 60 * 24 * 7;

type UploadEventImageInput = {
  familyId: string;
  childId: string;
  eventId: string;
  dataUrl: string;
};

type MediaRow = {
  id: string;
  event_id: string | null;
  storage_path: string;
  position: number;
};

function dataUrlToBlob(dataUrl: string) {
  const [header, encodedData] = dataUrl.split(",");

  if (!header || !encodedData) {
    throw new Error("L’image sélectionnée est invalide.");
  }

  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] ?? "image/jpeg";

  const binary = window.atob(encodedData);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], {
    type: mimeType,
  });
}

function getFileExtension(dataUrl: string) {
  if (dataUrl.startsWith("data:image/png")) {
    return "png";
  }

  if (dataUrl.startsWith("data:image/webp")) {
    return "webp";
  }

  return "jpg";
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
      "Vous devez être connecté pour ajouter une image."
    );
  }

  return user.id;
}

export async function uploadCloudEventImage({
  familyId,
  childId,
  eventId,
  dataUrl,
}: UploadEventImageInput): Promise<string> {
  const userId = await getCurrentUserId();

  const blob = dataUrlToBlob(dataUrl);
  const extension = getFileExtension(dataUrl);
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const storagePath = [
    familyId,
    childId,
    eventId,
    fileName,
  ].join("/");

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, blob, {
      contentType: blob.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: mediaError } = await supabase
    .from("event_media")
    .insert({
      family_id: familyId,
      child_id: childId,
      event_id: eventId,
      storage_path: storagePath,
      file_name: fileName,
      mime_type: blob.type,
      size_bytes: blob.size,
      position: 0,
      created_by: userId,
    });

  if (mediaError) {
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    throw mediaError;
  }

  const { data, error: signedUrlError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(
        storagePath,
        SIGNED_URL_DURATION
      );

  if (signedUrlError) {
    throw signedUrlError;
  }

  return data.signedUrl;
}

export async function getCloudEventImages(
  eventIds: string[]
): Promise<Record<string, string[]>> {
  if (eventIds.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from("event_media")
    .select(
      `
        id,
        event_id,
        storage_path,
        position
      `
    )
    .in("event_id", eventIds)
    .order("position", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as MediaRow[];

  if (rows.length === 0) {
    return {};
  }

  const paths = rows.map(
    (row) => row.storage_path
  );

  const {
    data: signedUrls,
    error: signedUrlsError,
  } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrls(
      paths,
      SIGNED_URL_DURATION
    );

  if (signedUrlsError) {
    throw signedUrlsError;
  }

  const result: Record<string, string[]> = {};

  rows.forEach((row, index) => {
    if (!row.event_id) return;

    const signedUrl =
      signedUrls?.[index]?.signedUrl;

    if (!signedUrl) return;

    if (!result[row.event_id]) {
      result[row.event_id] = [];
    }

    result[row.event_id].push(signedUrl);
  });

  return result;
}

export async function deleteCloudEventImages(
  eventId: string
): Promise<void> {
  const { data, error } = await supabase
    .from("event_media")
    .select("storage_path")
    .eq("event_id", eventId);

  if (error) {
    throw error;
  }

  const paths = (data ?? []).map(
    (row) => row.storage_path as string
  );

  if (paths.length > 0) {
    const { error: storageError } =
      await supabase.storage
        .from(BUCKET_NAME)
        .remove(paths);

    if (storageError) {
      throw storageError;
    }
  }

  const { error: deleteError } = await supabase
    .from("event_media")
    .delete()
    .eq("event_id", eventId);

  if (deleteError) {
    throw deleteError;
  }
}