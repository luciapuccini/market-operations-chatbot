import Logo from "@/app/components/ui/Logo";
import { cn } from "@/app/components/utilities";
import { ComponentProps } from "react";
import { JSX } from "react/jsx-runtime";

type ChatMessageSkletonProps = ComponentProps<"li">;

export default function ChatMessageSkleton({ children }: ChatMessageSkletonProps): JSX.Element {
  return (
    <li className="flex gap-4 py-8">
      <div className="shrink-0 self-end">
        <div className="flex size-8 items-center justify-center rounded-full bg-[var(--secondary)]">
          <Logo className="size-4" />
        </div>
      </div>

      <div className={cn("max-w-[80%] rounded-2xl border-r px-4 py-3", "rounded-bl-none bg-[var(--secondary)]")}>
        <p className="text-sm leading-relaxed">{children}</p>
      </div>
    </li>
  );
}
