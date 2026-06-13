"use client";
import { SubmitEvent, JSX, useCallback } from "react";
import { useEventMessages } from "@/app/hooks/useEventMessages";
import ChatInput from "./components/ChatInput";
import { getAssistantEvent } from "@/app/controllers/api/api";
import ChatMessages from "./components/ChatMessages";

export function Assistant(): JSX.Element {
  const [state, dispatch] = useEventMessages();

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
    <section className="relative flex h-[80vh] w-full flex-col items-center justify-end">
      <ChatMessages messages={state.messages} />

      <div className="fixed bottom-0 mb-5 flex w-full justify-center">
        <p className="">{state.currentMessage}</p>

        <ChatInput onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
