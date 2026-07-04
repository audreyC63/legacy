"use client";

import Input from "@/components/ui/Input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TimelineSearch({
  value,
  onChange,
}: Props) {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder="🔍 Rechercher un souvenir, une photo, un vaccin..."
    />
  );
}