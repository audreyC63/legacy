type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function FormTextarea({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-32 w-full rounded-2xl border border-gray-300 bg-white p-4 outline-none transition focus:border-[#7C9A7A]"
    />
  );
}