import * as React from "react";
import { cn } from "../../utilities/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-none border border-[var(--input)] bg-transparent px-2.5 py-2 text-xs transition-colors outline-none placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--ring)] focus-visible:ring-1 focus-visible:ring-[color-mix(in_oklch,var(--ring)_50%,transparent)] disabled:cursor-not-allowed disabled:bg-[color-mix(in_oklch,var(--input)_50%,transparent)] disabled:opacity-50 aria-invalid:border-[var(--destructive)] aria-invalid:ring-1 aria-invalid:ring-[color-mix(in_oklch,var(--destructive)_20%,transparent)] dark:bg-[color-mix(in_oklch,var(--input)_30%,transparent)] dark:disabled:bg-[color-mix(in_oklch,var(--input)_80%,transparent)] dark:aria-invalid:border-[color-mix(in_oklch,var(--destructive)_50%,transparent)] dark:aria-invalid:ring-[color-mix(in_oklch,var(--destructive)_40%,transparent)] md:text-xs",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
