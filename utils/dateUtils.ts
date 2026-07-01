export function getAgeLabel(birthDate: string) {
  if (!birthDate) return "Âge à compléter";

  const birth = new Date(birthDate);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0 && months <= 0) {
    return "Quelques jours";
  }

  if (years <= 0) {
    return `${months} mois`;
  }

  return `${years} an${years > 1 ? "s" : ""} • ${months} mois`;
}

export function getDaysUntilLabel(expectedDate: string) {
  if (!expectedDate) return "Date prévue à compléter";

  const expected = new Date(expectedDate);
  const today = new Date();

  const diff = expected.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return "La rencontre approche ❤️";
  }

  return `Plus que ${days} jour${days > 1 ? "s" : ""} avant votre rencontre`;
}