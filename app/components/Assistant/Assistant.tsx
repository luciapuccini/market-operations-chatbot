"use client";
import { SubmitEvent, JSX, useRef } from "react";
import { useEventMessages } from "@/app/hooks/useEventMessages";
import { cn } from "../ui/utilities/cn";
import ChatInput from "./components/ChatInput.tsx";
import { getAssistantEvent } from "@/app/controllers/api/api";

export function Assistant(): JSX.Element {
  const [state, dispatch] = useEventMessages();
  const userInputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const userInput = userInputRef.current?.value ?? "";
    getAssistantEvent({ userInput, dispatch });
    event.target.reset();
  }
  return (
    <section className="relative flex h-[80vh] w-full flex-col items-center justify-end">
      {/* --- RSC */}
      <section className="w-full overflow-y-auto scroll-smooth">
        <ul className="flex w-full flex-col justify-end">
          {state.messages.length > 0 &&
            state.messages.map(([msgId, meta], index) => {
              const questionClass = "text-amber-600 ml-2";
              const answerClass = "text-slate-600 ml-2";
              return (
                <li key={`${msgId}-${index}`} className={cn(`${msgId === "answer" ? "" : "text-end"}`, "mb-4")}>
                  <span className={` ${msgId === "answer" ? answerClass : questionClass}`}>{meta.message}</span>
                </li>
              );
            })}
        </ul>
      </section>
      {/* --- RSC */}

      <div className="fixed bottom-0 mb-5 flex w-full justify-center">
        <p className="">{state.currentMessage}</p>

        <ChatInput onSubmit={handleSubmit} userInputRef={userInputRef} />
      </div>
    </section>
  );
}
