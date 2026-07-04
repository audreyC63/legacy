type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header>
      <div className="text-4xl">🐺</div>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-black">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-base leading-7 text-gray-700">
          {subtitle}
        </p>
      )}
    </header>
  );
}