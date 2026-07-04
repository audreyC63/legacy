type TextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export default function Textarea({
  value,
  onChange,
  placeholder,
  rows = 5,
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full
        rounded-2xl
        border
        border-gray-300
        bg-white
        p-4
        text-base
        text-black
        placeholder:text-black
        outline-none
        transition
        focus:border-[#7C9A7A]
        focus:ring-2
        focus:ring-[#7C9A7A]/20
      "
    />
  );
}