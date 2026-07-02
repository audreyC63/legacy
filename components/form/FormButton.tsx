import Button from "@/components/ui/Button";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export default function FormButton({
  children,
  onClick,
}: Props) {
  return (
    <div className="pt-2">
      <Button onClick={onClick}>
        {children}
      </Button>
    </div>
  );
}