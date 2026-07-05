import Input from "@/components/ui/Input";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black">
        {label}
      </label>

      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}