"use client";

import AbortControllerService from "@/app/services/eventStream";
import { AssistantMessage, EventStreamTypes, ResponseEventStream } from "@/app/types/types";
import { JSX, SubmitEvent, useReducer, useState } from "react";

const SIMULATED_ENDPOINT = "/api/chat";

const initialState = {
  questions: [],
  answers: [],
  currentMessage: "",
};

type AssistantState = typeof initialState;

// WIP: possible improvement
// const sample = ["question", { question: "my user question" }] as const;
// const sample2 = ["answer", { type: "token", value: "kdjfajkfh" }] as const;
// type sampleType = typeof sample | typeof sample2

type AssistantActions = {
  type: "question" | "answer" | "message";
  payload: {
    type: string;
    message?: string;
    value?: string;
  };
  // | { question: string }
  // | {
  //     message: string;
  //   };
};

const reducerFn = (state: AssistantState, action: AssistantActions): AssistantState => {
  if (action.type === "answer") {
    if (action.payload.type === "error") {
      return {
        ...state,
        answers: [
          {
            type: action.payload.type,
            text: action.payload.message,
          },
          ...state.answers,
        ],
      };
    }

    if (action.payload.type === "done") {
      console.log("DONE");

      return {
        ...state,
        answers: [
          {
            type: "",
            text: state.currentMessage,
          },
          ...state.answers,
        ],
        currentMessage: "",
      };
    }

    // ANSWER
  }

  if (action.type === "message") {
    return {
      ...state,
      currentMessage: state.currentMessage + action.payload.message,
    };
  }

  // if (action.type === "question") {
  //   return {
  //     ...action.payload,
  //     // TODO: define question structure
  //     questions: state.questions.push(action.payload),
  //   };
  // }
};

export function Assistant(): JSX.Element {
  //TODO: Use useActionState hook for the form submission action
  const [userInput, setUserInput] = useState("");

  const [state, dispatch] = useReducer(reducerFn, initialState);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

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

        const finalMessage: AssistantMessage = JSON.parse(cleanData);
        if (finalMessage.type === "token") {
          dispatch({ type: "message", payload: { message: finalMessage.value } });
        }

        if (finalMessage.type === "done") {
          dispatch({ type: "answer", payload: { type: "done", message: "" } });
        }

        if (finalMessage.type === "error") {
          dispatch({ type: "answer", payload: finalMessage });
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.error("Fetch aborted by user action (browser stop button, closing tab, etc.)");
      }
    }
  }

  return (
    <aside>
      <form onSubmit={handleSubmit} className="h-[200px] w-[300px] rounded-3xl bg-gray-50 px-6 py-4 shadow-sm">
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
        <button type="submit" className="border-gray-300text-3xl border text-slate-700">
          ask question
        </button>
        <button
          type="button"
          className="border-gray-300text-3xl border text-slate-700"
          onClick={() => {
            console.log("ABORT");
            AbortControllerService().abort("user cancelled");
          }}
        >
          cancel
        </button>
      </form>
      <section className="w-100 overflow-auto">
        {state.answers.length > 0 &&
          state.answers.map((a, index) => (
            <span key={index} className="p-10">
              {a.text}
            </span>
          ))}
        {/* WIP:ERROR - clarify in reducer */}
        {/* {state.kind === "error" && <span className="text-red-800">{state.message}</span>}
        {state.kind === "normal" && } */}
        <p className="text-blue-400">{state.currentMessage}</p>
      </section>
    </aside>
  );
}
