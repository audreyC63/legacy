export const STORAGE_KEY = "legacy-family";

export function saveFamily(data: unknown) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

export function loadFamily() {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  return JSON.parse(data);
}