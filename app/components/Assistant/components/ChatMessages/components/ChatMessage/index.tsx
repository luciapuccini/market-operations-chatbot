import { Logo } from "@/app/components/ui/Logo";
import { AssistantMessage } from "@/app/hooks/useEventMessages";
import { cn } from "@/app/components/utilities/cn";

interface ChatMessageProps {
  message: AssistantMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [messageType, content] = message;
  const isUser = messageType === "question";

  return (
    <li className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="shrink-0">
          <div className="bg-secondary flex size-8 items-center justify-center rounded-full">
            <Logo className="size-6" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl border-r px-4 py-3",
          isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary rounded-bl-none",
        )}
      >
        <p className="text-sm leading-relaxed">{content.message}</p>
      </div>

      {isUser && (
        <div className="shrink-0">
          <div className="bg-secondary flex size-8 items-center justify-center rounded-full">
            <p>U</p>
          </div>
        </div>
      )}
    </li>
  );
}
