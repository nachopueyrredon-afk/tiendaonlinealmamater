import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium tracking-[0.08em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-brand-900 text-white shadow-[0_12px_30px_rgba(16,28,48,0.18)] hover:-translate-y-0.5 hover:bg-brand-700",
        secondary: "bg-white/88 text-brand-900 ring-1 ring-brand-900/10 hover:-translate-y-0.5 hover:bg-white",
        ghost: "text-brand-900 hover:bg-brand-900/5"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({ className, variant, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    children: ReactNode;
  };

export function ButtonLink({ className, variant, href, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant }), className)} href={href} {...props}>
      {children}
    </Link>
  );
}
