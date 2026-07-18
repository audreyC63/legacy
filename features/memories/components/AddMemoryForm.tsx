"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import {
  createCloudEvent,
  deleteCloudEvent,
  getCloudEvents,
  toggleCloudFavorite,
  updateCloudEvent,
} from "@/services/cloud/events";
import {
  deleteCloudEventImages,
  getCloudEventImages,
  uploadCloudEventImage,
} from "@/services/cloud/media";
import { LegacyEvent } from "@/types/Event";
import { compressImage } from "@/utils/imageUtils";

function toIsoDate(date: string) {
  const [day, month, year] = date.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString();
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}T00:00:00`;
}

function toDisplayDate(date: string) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("fr-FR");
}

export default function AddMemoryForm() {
  const {
    family,
    setFamily,
    cloudFamilyId,
    cloudChildId,
    cloudLoading,
  } = useFamily();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const memories = (family.events ?? [])
    .filter((event) => event.type === "memory")
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  useEffect(() => {
    if (!cloudFamilyId || !cloudChildId) {
      return;
    }

    let active = true;

    async function loadMemories() {
      setLoadingMemories(true);
      setErrorMessage("");

      try {
        const cloudEvents = await getCloudEvents(
          cloudFamilyId as string,
          cloudChildId as string
        );

        const cloudMemories = cloudEvents.filter(
          (event) => event.type === "memory"
        );

        const imagesByEvent = await getCloudEventImages(
          cloudMemories.map((event) => event.id)
        );

        const memoriesWithImages = cloudMemories.map(
          (event) => ({
            ...event,
            images: imagesByEvent[event.id] ?? [],
          })
        );

        if (!active) return;

        setFamily((current) => ({
          ...current,
          events: [
            ...(current.events ?? []).filter(
              (event) => event.type !== "memory"
            ),
            ...memoriesWithImages,
          ],
        }));
      } catch (error) {
        console.error(
          "Impossible de charger les souvenirs.",
          error
        );

        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Impossible de charger les souvenirs."
          );
        }
      } finally {
        if (active) {
          setLoadingMemories(false);
        }
      }
    }

    void loadMemories();

    return () => {
      active = false;
    };
  }, [cloudChildId, cloudFamilyId, setFamily]);

  async function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageLoading(true);
    setErrorMessage("");

    try {
      const compressed = await compressImage(file);
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

  function resetForm() {
    setTitle("");
    setDate("");
    setDescription("");
    setImage("");
    setEditingId(null);
    setErrorMessage("");
  }

  async function handleSave() {
    if (!title.trim()) {
      setErrorMessage(
        "Veuillez saisir un titre."
      );
      return;
    }

    if (!cloudFamilyId || !cloudChildId) {
      setErrorMessage(
        "Votre espace familial cloud n’est pas encore prêt. Connectez-vous puis créez votre espace familial."
      );
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const eventDate = date
        ? toIsoDate(date)
        : new Date().toISOString();

      if (editingId) {
        const currentMemory = memories.find(
          (memory) => memory.id === editingId
        );

        if (!currentMemory) {
          throw new Error(
            "Le souvenir à modifier est introuvable."
          );
        }

        const updatedEvent = await updateCloudEvent(
          editingId,
          {
            title: title.trim(),
            description,
            date: eventDate,
          }
        );

        const newImageSelected =
          image.startsWith("data:image/");

        const imageWasRemoved =
          !image && currentMemory.images.length > 0;

        let finalImages = currentMemory.images;

        if (newImageSelected || imageWasRemoved) {
          await deleteCloudEventImages(editingId);
          finalImages = [];
        }

        if (newImageSelected) {
          const signedUrl =
            await uploadCloudEventImage({
              familyId: cloudFamilyId,
              childId: cloudChildId,
              eventId: editingId,
              dataUrl: image,
            });

          finalImages = [signedUrl];
        }

        const updatedWithImages: LegacyEvent = {
          ...updatedEvent,
          images: finalImages,
        };

        setFamily((current) => ({
          ...current,
          events: current.events.map((event) =>
            event.id === editingId
              ? updatedWithImages
              : event
          ),
        }));

        resetForm();
        return;
      }

      const createdEvent = await createCloudEvent({
        familyId: cloudFamilyId,
        childId: cloudChildId,
        type: "memory",
        title: title.trim(),
        description,
        date: eventDate,
        favorite: false,
      });

      let createdImages: string[] = [];

      try {
        if (image.startsWith("data:image/")) {
          const signedUrl =
            await uploadCloudEventImage({
              familyId: cloudFamilyId,
              childId: cloudChildId,
              eventId: createdEvent.id,
              dataUrl: image,
            });

          createdImages = [signedUrl];
        }
      } catch (error) {
        await deleteCloudEvent(createdEvent.id);
        throw error;
      }

      const createdWithImages: LegacyEvent = {
        ...createdEvent,
        images: createdImages,
      };

      setFamily((current) => ({
        ...current,
        events: [
          createdWithImages,
          ...(current.events ?? []),
        ],
      }));

      resetForm();
    } catch (error) {
      console.error(
        "Impossible d’enregistrer le souvenir.",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’enregistrer le souvenir."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleFavorite(memory: LegacyEvent) {
    setErrorMessage("");

    try {
      const updated = await toggleCloudFavorite(
        memory.id,
        !memory.favorite
      );

      setFamily((current) => ({
        ...current,
        events: current.events.map((event) =>
          event.id === memory.id
            ? {
                ...updated,
                images: memory.images,
              }
            : event
        ),
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le favori."
      );
    }
  }

  async function handleDelete(memory: LegacyEvent) {
    const confirmed = window.confirm(
      `Supprimer le souvenir « ${memory.title} » ?`
    );

    if (!confirmed) return;

    setErrorMessage("");

    try {
      await deleteCloudEventImages(memory.id);
      await deleteCloudEvent(memory.id);

      setFamily((current) => ({
        ...current,
        events: current.events.filter(
          (event) => event.id !== memory.id
        ),
      }));

      if (editingId === memory.id) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le souvenir."
      );
    }
  }

  function startEditing(memory: LegacyEvent) {
    setEditingId(memory.id);
    setTitle(memory.title);
    setDate(toDisplayDate(memory.date));
    setDescription(memory.description);
    setImage(memory.images?.[0] ?? "");
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const unavailable =
    cloudLoading ||
    !cloudFamilyId ||
    !cloudChildId;

  return (
    <>
      <Card>
        <h2 className="text-2xl font-semibold text-black">
          {editingId
            ? "Modifier le souvenir"
            : "Ajouter un souvenir"}
        </h2>

        {unavailable && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-black">
            Connectez-vous et créez votre espace familial
            cloud avant d’ajouter un souvenir.
          </div>
        )}

        <div className="mt-6 space-y-4">
          <Input
            value={title}
            onChange={setTitle}
            placeholder="Titre"
          />

          <Input
            value={date}
            onChange={setDate}
            placeholder="Date (JJ/MM/AAAA)"
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
                alt="Aperçu du souvenir"
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
            placeholder="Racontez ce moment..."
          />

          {errorMessage && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
            >
              {errorMessage}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <Button
            onClick={handleSave}
            disabled={
              unavailable ||
              imageLoading ||
              saving
            }
          >
            {saving
              ? "Enregistrement..."
              : editingId
                ? "Mettre à jour"
                : "Enregistrer"}
          </Button>

          {editingId && (
            <Button
              onClick={resetForm}
              disabled={saving}
            >
              Annuler la modification
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-black">
          Souvenirs enregistrés
        </h2>

        {loadingMemories ? (
          <p className="mt-4 text-black">
            Chargement des souvenirs…
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {memories.length === 0 ? (
              <p className="text-black">
                Aucun souvenir cloud.
              </p>
            ) : (
              memories.map((memory) => (
                <div
                  key={memory.id}
                  className="border-b border-gray-200 pb-5 last:border-b-0"
                >
                  {memory.images?.[0] && (
                    <img
                      src={memory.images[0]}
                      alt={memory.title}
                      className="mb-4 h-48 w-full rounded-2xl object-cover"
                    />
                  )}

                  <p className="font-semibold text-black">
                    {memory.favorite ? "⭐ " : ""}
                    {memory.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-700">
                    {new Date(
                      memory.date
                    ).toLocaleDateString("fr-FR")}
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm text-black">
                    {memory.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={() =>
                        startEditing(memory)
                      }
                    >
                      Modifier
                    </Button>

                    <Button
                      onClick={() =>
                        void handleFavorite(memory)
                      }
                    >
                      {memory.favorite
                        ? "⭐ Retirer des favoris"
                        : "☆ Ajouter aux favoris"}
                    </Button>

                    <Button
                      onClick={() =>
                        void handleDelete(memory)
                      }
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </>
  );
}