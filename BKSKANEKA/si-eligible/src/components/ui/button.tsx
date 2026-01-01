import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const base =
      "inline-flex items-center gap-2 justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60";

    const styles =
      variant === "outline"
        ? "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50"
        : "bg-blue-600 text-white hover:bg-blue-700";

    return (
      <button ref={ref} className={`${base} ${styles} ${className}`.trim()} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
