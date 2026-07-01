"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function PhotoStep() {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-[#2F2F2F]">
        Une première photo 📸
      </h2>

      <p className="mt-2 text-[#6B6B6B]">
        Vous pourrez la modifier quand vous le souhaitez.
      </p>

      <label className="mt-8 flex h-40 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
        <span className="text-gray-500">
          Cliquez pour choisir une photo
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>

      <div className="mt-8">
        <Link href="/dashboard">
          <Button>Terminer</Button>
        </Link>
      </div>
    </Card>
  );
}