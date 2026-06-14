import Logo from "@/app/components/ui/Logo";
import { AssistantMessage } from "@/app/hooks/useEventMessages";
import { cn } from "@/app/components/utilities/cn";
import { memo } from "react";

interface ChatMessageProps {
  message: AssistantMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
  const [messageType, content] = message;
  const isUser = messageType === "question";

  return (
    <li className={cn("flex gap-4 py-8", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="shrink-0 self-end">
          <div className="flex size-8 items-center justify-center rounded-full bg-[var(--secondary)]">
            <Logo className="size-4" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl border-r px-4 py-3",
          isUser
            ? "rounded-br-none bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "rounded-bl-none bg-[var(--secondary)]",
        )}
      >
        <p className="text-sm leading-relaxed">{content.message}</p>
      </div>

      {isUser && (
        <div className="shrink-0 self-end">
          <div className="flex size-8 items-center justify-center rounded-full bg-[var(--secondary)]">
            <p>U</p>
          </div>
        </div>
      )}
    </li>
  );
}

export default memo(ChatMessage);
