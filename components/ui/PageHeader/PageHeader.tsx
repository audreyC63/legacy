/**
 * ------------------------------------------------------------------
 * Legacy
 * UI - PageHeader
 * ------------------------------------------------------------------
 * En-tête principal des pages.
 * ------------------------------------------------------------------
 */

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <header className="mb-10">
      <span className="text-5xl">🐺</span>

      <h1 className="mt-6 text-4xl font-bold text-[#2F2F2F]">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-[#6B6B6B]">
          {subtitle}
        </p>
      )}
    </header>
  );
}