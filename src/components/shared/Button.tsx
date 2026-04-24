"use client";

export const variants = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  cancel: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent hover:bg-gray-100",
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
