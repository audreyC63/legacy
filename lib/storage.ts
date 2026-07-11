export const STORAGE_KEY = "legacy-family";

const STORAGE_WARNING_KEY = "legacy-storage-warning";

export function saveFamily(data: unknown) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    sessionStorage.removeItem(STORAGE_WARNING_KEY);
  } catch (error) {
    const quotaExceeded =
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED");

    if (quotaExceeded) {
      const warningAlreadyDisplayed =
        sessionStorage.getItem(STORAGE_WARNING_KEY);

      if (!warningAlreadyDisplayed) {
        sessionStorage.setItem(
          STORAGE_WARNING_KEY,
          "true"
        );

        window.alert(
          "L'espace de stockage de Legacy est presque plein. Les nouvelles images doivent être compressées ou certaines anciennes photos supprimées."
        );
      }

      console.error(
        "Espace localStorage insuffisant.",
        error
      );

      return;
    }

    console.error(
      "Impossible d'enregistrer les données Legacy.",
      error
    );
  }
}

export function loadFamily() {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error(
      "Impossible de charger les données Legacy.",
      error
    );

    return null;
  }
}