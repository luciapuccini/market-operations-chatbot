"use client";

import { initialState, reducerFn } from "@/app/hooks/useEventMessages";
import AbortControllerService from "@/app/services/eventStream";
import { EventStreamMessage } from "@/app/types/types";
import { JSX, SubmitEvent, useReducer, useState } from "react";

const SIMULATED_ENDPOINT = "/api/chat";

export function Assistant(): JSX.Element {
  //TODO: Use useActionState hook for the form submission action
  const [userInput, setUserInput] = useState("");

  const [state, dispatch] = useReducer(reducerFn, initialState);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
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
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.error("Fetch aborted by user action (browser stop button, closing tab, etc.)");
      }
    }
  }

  return (
    <section className="flex flex-col">
      <section className="max-h-[50vh] w-full overflow-y-auto scroll-smooth border border-amber-500">
        <ul className="flex flex-col justify-end">
          {state.messages.length > 0 &&
            state.messages.map(([msgId, meta], index) => {
              const questionClass = "text-amber-600";
              const answerClass = "text-rose-400";
              return (
                <li key={`${msgId}-${index}`} className="m-4">
                  <span className={` ${msgId === "answer" ? answerClass : questionClass}`}>{meta.message}</span>
                </li>
              );
            })}
        </ul>
      </section>

      <div className="w-full">
        <p className="text-blue-400">{state.currentMessage}</p>
        <form onSubmit={handleSubmit} className="">
          <label htmlFor="query" className="text-3xl text-slate-700">
            User:
          </label>
          <input
            id="query"
            name="query"
            type="text"
            required
            disabled={false}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-gray-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button type="submit" className="border border-gray-300 text-3xl text-slate-700">
            ask question
          </button>
          <button
            type="button"
            className="border border-gray-300 text-3xl text-slate-700"
            onClick={() => {
              console.log("ABORT");
              AbortControllerService().abort("user cancelled");
            }}
          >
            cancel
          </button>
        </form>
      </div>
    </section>
  );
}
