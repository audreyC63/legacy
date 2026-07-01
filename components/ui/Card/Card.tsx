/**
 * ------------------------------------------------------------------
 * Legacy
 * UI - Card
 * ------------------------------------------------------------------
 * Carte réutilisable dans toute l'application.
 * ------------------------------------------------------------------
 */

type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      {children}
    </div>
  );
}