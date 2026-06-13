"use client";
import { JSX, ComponentPropsWithoutRef, memo, useRef } from "react";
import AbortControllerService from "@/services/eventStream";
import Button from "@/app/components/ui/Button";

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
    <form onSubmit={onSubmit} className="mx-10 w-full" ref={formref}>
      <label htmlFor="query" className="sr-only">
        User:
      </label>
      <div className="flex w-full justify-center gap-1.5">
        <textarea
          onKeyDown={handleKeyDown}
          rows={2}
          className="rounded-lg border border-slate-200 bg-transparent p-1.5 px-1.5 py-0.5 text-slate-900 shadow-sm transition-all duration-200 outline-none placeholder:text-slate-400 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-200"
          disabled={disabled}
          id="query"
          key="user-input-text-area"
          name="userInput"
          placeholder="Ask me anything..."
          required
        />
        <Button type="submit" disabled={disabled}>
          ask question
        </Button>
        <Button
          type="button"
          className="bg-red-400 hover:bg-red-500"
          onClick={() => {
            AbortControllerService().abort("user cancelled");
          }}
        >
          cancel
        </Button>
      </div>
    </form>
  );
};

export default memo(ChatInput);
