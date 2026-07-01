/**
 * ------------------------------------------------------------------
 * Legacy
 * UI - Button
 * ------------------------------------------------------------------
 * Bouton principal de l'application.
 * ------------------------------------------------------------------
 */

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-[#7C9A7A] py-4 text-lg font-semibold text-white transition hover:opacity-90"
    >
      {children}
    </button>
  );
}