"use client";
import { SubmitEvent, JSX, useCallback } from "react";
import { useEventMessages } from "@/app/hooks/useEventMessages";
import ChatInput from "./components/ChatInput";
import { getAssistantEvent } from "@/app/controllers/api/api";
import ChatMessages from "./components/ChatMessages";
import Logo from "../ui/Logo";

export function Assistant(): JSX.Element {
  // FIXME:
  // Assistant has the responsability of App state management
  // could improve performance with zustand -- subscribe lower comps to only the state slice they care about
  const [state, dispatch] = useEventMessages();

  const isStreaming = state.isStreaming;
  const isConversationStarted = state.messages.length > 0;

  const handleSubmit = useCallback(
    async function (event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const userInput = String(formData.get("userInput")) || "";
      getAssistantEvent({ userInput, dispatch });
      event.target.reset();
    },

    [dispatch],
  );
  return (
    <>
      {!isConversationStarted && (
        <div className="-mt-12 mt-20 w-full max-w-[640px] space-y-9">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)] bg-[size:10px_10px]" />
          <div className="flex justify-center">
            <div className="flex size-8 items-center justify-center rounded-full">
              <Logo className="size-20" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Market Operations Assistant</h1>
            <p className="text-2xl text-[var(--foreground)]">Tell me everything you need</p>
          </div>
        </div>
      )}
      <ChatMessages messages={state.messages} currentMessage={state.currentMessage} />

      <ChatInput onSubmit={handleSubmit} isStreaming={isStreaming} />
    </>
  );
}
