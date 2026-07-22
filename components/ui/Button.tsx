type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-full font-medium transition";
  

  const variantStyles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border border-slate-300 text-slate-700 hover:bg-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-slate-900 hover:bg-slate-100",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}