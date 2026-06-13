"use client";

import { useEventMessages } from "@/app/hooks/useEventMessages";
import AbortControllerService from "@/services/eventStream";
import { JSX, SubmitEvent, useRef } from "react";
import Button from "../ui/Button/Button";
import { cn } from "../ui/utilities/cn";

import { getAssistantEvent } from "@/app/controllers/api/api";

export function Assistant(): JSX.Element {
  //TODO: Use useActionState hook for the form submission action
  // const [userInput, setUserInput] = useState("");
  const userInputRef = useRef<HTMLTextAreaElement>(null);

  const [state, dispatch] = useEventMessages();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const userInput = userInputRef.current?.value ?? "";
    getAssistantEvent({ userInput, dispatch });
    // reset form
    event.target.reset();
  }

  return (
    <section className="relative flex h-[80vh] w-full flex-col items-center justify-end">
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

      <div className="fixed bottom-0 mb-5 flex w-full justify-center">
        <p className="">{state.currentMessage}</p>

        <form onSubmit={handleSubmit} className="w-1/2">
          <label htmlFor="query" className="sr-only">
            User:
          </label>
          <div className="flex w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
            <textarea
              key="user-input-text-area"
              ref={userInputRef}
              id="query"
              rows={1}
              placeholder="Ask me anything..."
              required
              disabled={false}
              className="flex-1 resize-none bg-transparent px-1.5 py-0.5 text-slate-900 outline-none placeholder:text-slate-400"
            />
            <Button type="submit">ask question</Button>
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
      </div>
    </section>
  );
}
