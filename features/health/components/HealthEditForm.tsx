"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import { updateEvent } from "@/services/events";
import { LegacyEvent } from "@/types/Event";

type Props = {
  event: LegacyEvent;
  onDone: () => void;
};

export default function HealthEditForm({ event, onDone }: Props) {
  const { setFamily } = useFamily();

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date.split("T")[0]);

  function save() {
    setFamily((current) =>
      updateEvent(current, event.id, {
        title,
        description,
        date: date || event.date,
      })
    );

    onDone();
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        Modifier le suivi santé
      </h2>

      <div className="mt-5 space-y-4">
        <Input value={title} onChange={setTitle} placeholder="Titre" />

        <Input type="date" value={date} onChange={setDate} />

        <Textarea
          value={description}
          onChange={setDescription}
          placeholder="Description"
        />

        <Button onClick={save}>Mettre à jour</Button>

        <Button onClick={onDone}>Annuler</Button>
      </div>
    </Card>
  );
}