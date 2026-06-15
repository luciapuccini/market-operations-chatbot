import Logo from "@/app/components/ui/Logo";
import { AssistantMessage } from "@/app/hooks/useEventMessages";
import { cn } from "@/app/components/utilities";
import { memo } from "react";
import Sources from "../Sources";

interface ChatMessageProps {
  message: AssistantMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
  const [messageType, content] = message;
  const isUser = messageType === "question";

  const { citations, confidence, type } = content;
  const hasSources = citations && citations?.length > 0 && confidence;
  const isError = type === "error";
  return (
    <li>
      <section className={cn("flex gap-4 py-8", isUser ? "justify-end" : "justify-start")}>
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
            isUser ? "rounded-br-none bg-(--primary) text-(--primary-foreground)" : "rounded-bl-none bg-(--secondary)",
            isError && "rounded-br-none bg-red-100 text-red-800",
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
      </section>

      {hasSources && <Sources citations={citations} confidence={confidence} />}
    </li>
  );
}

export default memo(ChatMessage);
