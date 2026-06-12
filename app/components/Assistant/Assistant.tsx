"use client";

import { useEventMessages } from "@/app/hooks/useEventMessages";
import AbortControllerService from "@/app/services/eventStream";
import { EventStreamMessage } from "@/app/types/types";
import { JSX, SubmitEvent, useRef } from "react";
import Button from "../ui/Button/Button";
import { cn } from "../ui/utilities/cn";

const SIMULATED_ENDPOINT = "/api/chat";

export function Assistant(): JSX.Element {
  //TODO: Use useActionState hook for the form submission action
  // const [userInput, setUserInput] = useState("");
  const userInputRef = useRef(null);

  const [state, dispatch] = useEventMessages();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const userInput = userInputRef.current?.value;
    dispatch({ type: "question", payload: { message: userInput } });
    try {
      const response = await fetch(SIMULATED_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ question: userInput }),
        headers: { "Content-Type": "application/json" },
        signal: AbortControllerService().signal,
      });
      if (!response.ok || !response.body) {
        throw new Error("bad stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const cleanData = chunk.split("data: ")[1].trimEnd();

        const finalMessage: EventStreamMessage = JSON.parse(cleanData);

        if (finalMessage.type === "token") {
          dispatch({ type: "message", payload: { message: finalMessage.value! } });
        }

        if (finalMessage.type === "done") {
          // WIP: no need payload
          dispatch({ type: "answer", payload: finalMessage });
        }

        if (finalMessage.type === "error") {
          dispatch({ type: "error-answer", payload: finalMessage });
        }
      }
      // reset form
      event.target.reset();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.error("Fetch aborted by user action (browser stop button, closing tab, etc.)");
      }
    }
  }

  return (
    <section className="flex w-full flex-col items-center justify-end">
      <section className="max-h-[50%] w-full overflow-y-auto scroll-smooth">
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

      <div className="w-full">
        <p className="">{state.currentMessage}</p>

        <form onSubmit={handleSubmit} className="w-full">
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
