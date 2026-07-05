import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function FormSection({
  title,
  children,
}: Props) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-black">
        {title}
      </h2>

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}