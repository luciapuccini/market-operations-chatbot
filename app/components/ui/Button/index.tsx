import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utilities/cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-[var(--ring)] focus-visible:ring-1 focus-visible:ring-[color-mix(in_oklch,var(--ring)_50%,transparent)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--destructive)] aria-invalid:ring-1 aria-invalid:ring-[color-mix(in_oklch,var(--destructive)_20%,transparent)] dark:aria-invalid:border-[color-mix(in_oklch,var(--destructive)_50%,transparent)] dark:aria-invalid:ring-[color-mix(in_oklch,var(--destructive)_40%,transparent)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in_oklch,var(--primary)_80%,transparent)]",
        outline:
          "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] aria-expanded:bg-[var(--muted)] aria-expanded:text-[var(--foreground)] dark:border-[var(--input)] dark:bg-[color-mix(in_oklch,var(--input)_30%,transparent)] dark:hover:bg-[color-mix(in_oklch,var(--input)_50%,transparent)]",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-[var(--secondary)] aria-expanded:text-[var(--secondary-foreground)]",
        ghost:
          "hover:bg-[var(--muted)] hover:text-[var(--foreground)] aria-expanded:bg-[var(--muted)] aria-expanded:text-[var(--foreground)] dark:hover:bg-[color-mix(in_oklch,var(--muted)_50%,transparent)]",
        destructive:
          "bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] text-[var(--destructive)] hover:bg-[color-mix(in_oklch,var(--destructive)_20%,transparent)] focus-visible:border-[color-mix(in_oklch,var(--destructive)_40%,transparent)] focus-visible:ring-[color-mix(in_oklch,var(--destructive)_20%,transparent)] dark:bg-[color-mix(in_oklch,var(--destructive)_20%,transparent)] dark:hover:bg-[color-mix(in_oklch,var(--destructive)_30%,transparent)] dark:focus-visible:ring-[color-mix(in_oklch,var(--destructive)_40%,transparent)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-none px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-none px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-none [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-none",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",

  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export default React.memo(Button);
