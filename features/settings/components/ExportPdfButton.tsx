"use client";

import { jsPDF } from "jspdf";

import Button from "@/components/ui/Button";
import { useFamily } from "@/providers/FamilyProvider";
import { LegacyEvent } from "@/types/Event";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date inconnue";
  }

  return parsed.toLocaleDateString("fr-FR");
}

function cleanText(value: string) {
  return value
    .replace(/❤️|📸|📈|🩺|🤰|⭐|🌡️|💊|📄|💉|🏥|🤧/g, "")
    .trim();
}

function getSectionTitle(event: LegacyEvent) {
  switch (event.type) {
    case "memory":
      return "Souvenir";
    case "photo":
      return "Photo";
    case "growth":
      return "Croissance";
    case "health":
      return "Santé";
    case "pregnancy":
      return "Grossesse";
    default:
      return "Événement";
  }
}

function getImageFormat(image: string) {
  if (image.startsWith("data:image/png")) {
    return "PNG";
  }

  if (
    image.startsWith("data:image/webp") ||
    image.startsWith("data:image/jpeg") ||
    image.startsWith("data:image/jpg")
  ) {
    return "JPEG";
  }

  return "JPEG";
}

export default function ExportPdfButton() {
  const { family } = useFamily();

  function exportPdf() {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let y = MARGIN;

    function addPage() {
      pdf.addPage();
      y = MARGIN;
    }

    function ensureSpace(requiredHeight: number) {
      if (y + requiredHeight > PAGE_HEIGHT - MARGIN) {
        addPage();
      }
    }

    function addWrappedText(
      text: string,
      fontSize = 11,
      spacingAfter = 4,
      bold = false
    ) {
      if (!text.trim()) return;

      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(fontSize);
      pdf.setTextColor(0, 0, 0);

      const lines = pdf.splitTextToSize(text, CONTENT_WIDTH);
      const lineHeight = fontSize * 0.42;
      const blockHeight = Math.max(lines.length * lineHeight, lineHeight);

      ensureSpace(blockHeight + spacingAfter);

      pdf.text(lines, MARGIN, y);
      y += blockHeight + spacingAfter;
    }

    function addSectionHeading(title: string) {
      ensureSpace(16);

      pdf.setFillColor(237, 245, 236);
      pdf.roundedRect(
        MARGIN,
        y - 5,
        CONTENT_WIDTH,
        12,
        3,
        3,
        "F"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.setTextColor(47, 47, 47);
      pdf.text(title, MARGIN + 4, y + 3);

      y += 16;
    }

    function addImage(image: string, height = 58) {
      if (!image) return;

      ensureSpace(height + 8);

      try {
        pdf.addImage(
          image,
          getImageFormat(image),
          MARGIN,
          y,
          CONTENT_WIDTH,
          height,
          undefined,
          "FAST"
        );

        y += height + 8;
      } catch {
        addWrappedText(
          "L’image associée n’a pas pu être intégrée au PDF.",
          9,
          5
        );
      }
    }

    // Couverture
    pdf.setFillColor(248, 246, 242);
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(30);
    pdf.setTextColor(94, 122, 91);
    pdf.text("LEGACY", PAGE_WIDTH / 2, 42, {
      align: "center",
    });

    pdf.setFontSize(22);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      family.childName || "Livre de vie",
      PAGE_WIDTH / 2,
      60,
      { align: "center" }
    );

    if (family.profilePhoto) {
      try {
        pdf.addImage(
          family.profilePhoto,
          getImageFormat(family.profilePhoto),
          55,
          74,
          100,
          100,
          undefined,
          "FAST"
        );
      } catch {
        // Le PDF reste généré sans photo de couverture.
      }
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    const subtitle = family.birthDate
      ? `Né(e) le ${formatDate(family.birthDate)}`
      : "Chaque vie mérite d'être racontée.";

    pdf.text(subtitle, PAGE_WIDTH / 2, 192, {
      align: "center",
    });

    const parents = [family.parentOne, family.parentTwo]
      .filter(Boolean)
      .join(" & ");

    if (parents) {
      pdf.text(parents, PAGE_WIDTH / 2, 205, {
        align: "center",
      });
    }

    pdf.setFontSize(10);
    pdf.text(
      `Livre généré le ${new Date().toLocaleDateString("fr-FR")}`,
      PAGE_WIDTH / 2,
      276,
      { align: "center" }
    );

    addPage();

    // Profil
    addSectionHeading("Profil de l'enfant");

    addWrappedText(
      `Prénom : ${family.childName || "Non renseigné"}`,
      11
    );

    if (family.birthDate) {
      addWrappedText(
        `Date de naissance : ${formatDate(family.birthDate)}`,
        11
      );
    }

    if (family.birthPlace) {
      addWrappedText(
        `Lieu de naissance : ${family.birthPlace}`,
        11
      );
    }

    if (family.birthWeight) {
      addWrappedText(
        `Poids de naissance : ${family.birthWeight} kg`,
        11
      );
    }

    if (family.birthHeight) {
      addWrappedText(
        `Taille de naissance : ${family.birthHeight} cm`,
        11
      );
    }

    if (family.bloodGroup) {
      addWrappedText(
        `Groupe sanguin : ${family.bloodGroup}`,
        11
      );
    }

    if (family.eyeColor) {
      addWrappedText(
        `Couleur des yeux : ${family.eyeColor}`,
        11
      );
    }

    if (family.hairColor) {
      addWrappedText(
        `Couleur des cheveux : ${family.hairColor}`,
        11
      );
    }

    // Événements
    const sortedEvents = [...(family.events ?? [])].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    if (sortedEvents.length === 0) {
      addSectionHeading("Livre de vie");
      addWrappedText(
        "Aucun événement n'a encore été enregistré.",
        11
      );
    } else {
      addSectionHeading("Chronologie");

      sortedEvents.forEach((event) => {
        ensureSpace(28);

        pdf.setDrawColor(220, 220, 220);
        pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y += 7;

        addWrappedText(
          `${getSectionTitle(event)} — ${formatDate(event.date)}`,
          10,
          2,
          true
        );

        addWrappedText(
          `${event.favorite ? "Favori — " : ""}${cleanText(event.title)}`,
          14,
          3,
          true
        );

        if (event.description) {
          addWrappedText(
            cleanText(event.description),
            10,
            5
          );
        }

        if (event.images?.[0]) {
          addImage(event.images[0]);
        }

        y += 3;
      });
    }

    const safeName = (family.childName || "legacy")
      .toLowerCase()
      .replace(/[^a-z0-9àâäéèêëîïôöùûüç-]+/gi, "-")
      .replace(/^-+|-+$/g, "");

    pdf.save(`legacy-${safeName || "livre-de-vie"}.pdf`);
  }

  return (
    <Button onClick={exportPdf}>
      Exporter le livre en PDF
    </Button>
  );
}