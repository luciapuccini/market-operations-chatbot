"use client";
import { JSX, ComponentPropsWithoutRef, memo, useRef } from "react";
import AbortControllerService from "@/services/eventStream";
import Button from "@/app/components/ui/Button";
import { Textarea } from "@/app/components/ui/TextArea";

type ChatInputProps = ComponentPropsWithoutRef<"form"> & { disabled: boolean };

const ChatInput = ({ children, onSubmit, disabled }: ChatInputProps): JSX.Element => {
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
      className="border-border bg-secondary fixed top-[75%] left-1/4 w-1/2 border p-1"
    >
      <div className="bg-card">
        <Textarea
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          id="query"
          key="user-input-text-area"
          name="userInput"
          placeholder="Ask me anything..."
          required
          className="placeholder:text-muted-foreground/60 min-h-[120px] resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="border-border/50 flex items-center justify-between border-t px-4 py-3">
          <Button type="submit" disabled={disabled}>
            ask question
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              AbortControllerService().abort("user cancelled");
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
