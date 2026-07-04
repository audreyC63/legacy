import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`
        w-full
        rounded-2xl
        bg-[#7C9A7A]
        px-5
        py-3
        font-semibold
        text-white
        shadow-sm
        transition-all
        duration-200
        hover:bg-[#6D8B6B]
        hover:shadow-md
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
}