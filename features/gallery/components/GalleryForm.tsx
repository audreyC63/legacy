"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";

import {
  createCloudEvent,
  deleteCloudEvent,
  updateCloudEvent,
} from "@/services/cloud/events";

import {
  deleteCloudEventImages,
  uploadCloudEventImage,
} from "@/services/cloud/media";

import { LegacyEvent } from "@/types/Event";
import { compressImage } from "@/utils/imageUtils";

type Props = {
  editingEvent?: LegacyEvent | null;
  onDone?: () => void;
};

function toIsoDate(date: string) {
  const [day, month, year] = date.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString();
  }

  return `${year}-${month.padStart(
    2,
    "0"
  )}-${day.padStart(2, "0")}T00:00:00`;
}

function toDisplayDate(date: string) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("fr-FR");
}

function cleanPhotoTitle(title: string) {
  return title.replace(/^📸\s*/, "");
}

export default function GalleryForm({
  editingEvent,
  onDone,
}: Props) {
  const {
    setFamily,
    cloudFamilyId,
    cloudChildId,
    cloudLoading,
  } = useFamily();

  const [title, setTitle] = useState(() =>
    editingEvent
      ? cleanPhotoTitle(editingEvent.title)
      : ""
  );

  const [date, setDate] = useState(() =>
    editingEvent
      ? toDisplayDate(editingEvent.date)
      : ""
  );

  const [description, setDescription] =
    useState(
      () => editingEvent?.description ?? ""
    );

  const [image, setImage] = useState(
    () => editingEvent?.images?.[0] ?? ""
  );

  const [imageLoading, setImageLoading] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const cloudUnavailable =
    cloudLoading ||
    !cloudFamilyId ||
    !cloudChildId;

  async function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageLoading(true);
    setErrorMessage("");

    try {
      const compressed =
        await compressImage(file);

      setImage(compressed);
    } catch {
      setErrorMessage(
        "Cette image n’a pas pu être ajoutée."
      );
    } finally {
      setImageLoading(false);
      event.target.value = "";
    }
  }

  async function savePhoto() {
    if (!title.trim()) {
      setErrorMessage(
        "Veuillez saisir un titre."
      );
      return;
    }

    if (!image) {
      setErrorMessage(
        "Veuillez choisir une photo."
      );
      return;
    }

    if (!cloudFamilyId || !cloudChildId) {
      setErrorMessage(
        "Connectez-vous et créez votre espace familial cloud avant d’ajouter une photo."
      );
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const eventDate = date
        ? toIsoDate(date)
        : editingEvent?.date ??
          new Date().toISOString();

      if (editingEvent) {
        const updatedEvent =
          await updateCloudEvent(
            editingEvent.id,
            {
              title: `📸 ${title.trim()}`,
              description,
              date: eventDate,
            }
          );

        const newImageSelected =
          image.startsWith("data:image/");

        const imageRemoved =
          !image &&
          (editingEvent.images?.length ?? 0) > 0;

        let finalImages =
          editingEvent.images ?? [];

        if (newImageSelected || imageRemoved) {
          await deleteCloudEventImages(
            editingEvent.id
          );

          finalImages = [];
        }

        if (newImageSelected) {
          const signedUrl =
            await uploadCloudEventImage({
              familyId: cloudFamilyId,
              childId: cloudChildId,
              eventId: editingEvent.id,
              dataUrl: image,
            });

          finalImages = [signedUrl];
        }

        const eventWithImage: LegacyEvent = {
          ...updatedEvent,
          images: finalImages,
        };

        setFamily((current) => ({
          ...current,
          events: current.events.map(
            (event) =>
              event.id === editingEvent.id
                ? eventWithImage
                : event
          ),
        }));

        onDone?.();
        return;
      }

      const createdEvent =
        await createCloudEvent({
          familyId: cloudFamilyId,
          childId: cloudChildId,
          type: "photo",
          title: `📸 ${title.trim()}`,
          description,
          date: eventDate,
          favorite: false,
        });

      try {
        const signedUrl =
          await uploadCloudEventImage({
            familyId: cloudFamilyId,
            childId: cloudChildId,
            eventId: createdEvent.id,
            dataUrl: image,
          });

        const eventWithImage: LegacyEvent = {
          ...createdEvent,
          images: [signedUrl],
        };

        setFamily((current) => ({
          ...current,
          events: [
            eventWithImage,
            ...(current.events ?? []),
          ],
        }));

        setTitle("");
        setDate("");
        setDescription("");
        setImage("");
      } catch (error) {
        await deleteCloudEvent(
          createdEvent.id
        );

        throw error;
      }
    } catch (error) {
      console.error(
        "Impossible d’enregistrer la photo.",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’enregistrer la photo."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        {editingEvent
          ? "Modifier la photo"
          : "Nouvelle photo"}
      </h2>

      {cloudUnavailable && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-black">
          Connectez-vous et créez votre espace
          familial cloud avant d’ajouter une photo.
        </div>
      )}

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Titre"
          value={title}
          onChange={setTitle}
        />

        <Input
          placeholder="Date (JJ/MM/AAAA)"
          value={date}
          onChange={setDate}
        />

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-6 text-center">
          <span className="text-4xl">📸</span>

          <span className="mt-2 font-semibold text-black">
            {image
              ? "Changer la photo"
              : "Ajouter une photo"}
          </span>

          <span className="mt-1 text-sm text-black">
            Touchez ici pour choisir une image
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
            disabled={imageLoading || saving}
          />
        </label>

        {imageLoading && (
          <p className="text-center text-sm text-black">
            Préparation de l’image…
          </p>
        )}

        {image && (
          <div>
            <img
              src={image}
              alt="Aperçu"
              className="h-52 w-full rounded-2xl object-cover"
            />

            <button
              type="button"
              onClick={() => setImage("")}
              className="mt-2 font-semibold text-red-700"
            >
              Retirer la photo
            </button>
          </div>
        )}

        <Textarea
          value={description}
          onChange={setDescription}
          placeholder="Description"
        />

        {errorMessage && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            {errorMessage}
          </div>
        )}

        <Button
          onClick={savePhoto}
          disabled={
            cloudUnavailable ||
            imageLoading ||
            saving
          }
        >
          {saving
            ? "Enregistrement..."
            : editingEvent
              ? "Mettre à jour"
              : "Enregistrer"}
        </Button>

        {editingEvent && (
          <Button
            onClick={() => onDone?.()}
            disabled={saving}
          >
            Annuler la modification
          </Button>
        )}
      </div>
    </Card>
  );
}