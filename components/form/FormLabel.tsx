type Props = {
  children: React.ReactNode;
};

export default function FormLabel({
  children,
}: Props) {
  return (
    <label className="block text-sm font-medium text-[#2F2F2F]">
      {children}
    </label>
  );
}