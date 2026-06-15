"use client";
import { JSX, ComponentPropsWithoutRef, memo, useRef } from "react";

import Button from "@/app/components/ui/Button";
import { Textarea } from "@/app/components/ui/TextArea";

type ChatInputProps = ComponentPropsWithoutRef<"form"> & { isStreaming: boolean; onCancel: () => void };

const ChatInput = ({ onSubmit, isStreaming, onCancel }: ChatInputProps): JSX.Element => {
  const formref = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formref.current?.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      ref={formref}
      className="fixed top-[75%] left-1/4 w-1/2 border border-[var(--border)] bg-[var(--secondary)] p-1"
    >
      <div className="bg-[var(--card)]">
        <Textarea
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isStreaming}
          id="query"
          key="user-input-text-area"
          name="userInput"
          placeholder="Ask me anything..."
          required
          className="min-h-[120px] resize-none border-0 bg-transparent px-4 py-3 text-base placeholder:text-[color-mix(in_oklch,var(--muted-foreground)_60%,transparent)] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="flex items-center justify-between border-t border-[color-mix(in_oklch,var(--border)_50%,transparent)] px-4 py-3">
          <Button type="submit" disabled={isStreaming}>
            ask question
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onCancel();
            }}
          >
            cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default memo(ChatInput);
