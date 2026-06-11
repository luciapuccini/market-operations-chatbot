"use client";

import { JSX, SubmitEvent, useState } from "react";

const SIMULATED_ENDPOINT = "/api/chat";

// TODO: separate as Singleton
let controller: AbortController;
const AbortControllerService = () => {
  if (controller) {
    return controller;
  }
  controller = new AbortController();
  return controller;
};

export function Assistant(): JSX.Element {
  //TODO: Use useActionState hook for the form submission action
  const [userInput, setUserInput] = useState("");

  const [text, setText] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch(SIMULATED_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ question: userInput }),
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
        // FIXME: type better
        const finalMessage: Record<string, string> = JSON.parse(cleanData);
        setText((prevState) => prevState + finalMessage.value);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  }

  return (
    <aside>
      <form
        onSubmit={handleSubmit}
        className="h-[200px] w-[300px] rounded-3xl bg-gray-50 px-6 py-4 shadow-sm"
      >
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
        <button
          type="submit"
          className="border-gray-300text-3xl border text-slate-700"
        >
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
      <p className="w-100">{text}</p>
    </aside>
  );
}
