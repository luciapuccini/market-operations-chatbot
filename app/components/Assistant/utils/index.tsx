import { ActionDispatch } from "react";
import { AssistantAction } from "@/app/hooks/useEventMessages";
import { responseEventStream } from "@/app/controllers/api/schemas";

const SIMULATED_ENDPOINT = "/api/chat";

let controller: AbortController;

export const abortCurrentRequest = () => {
  controller.abort();
};

export const getAssistantEvent = async ({
  userInput,
  dispatch,
}: {
  userInput: string;
  dispatch: ActionDispatch<[action: AssistantAction]>;
}): Promise<void> => {
  dispatch({ type: "question", payload: { message: userInput, type: "done" } });

  if (controller) {
    controller.abort();
  }
  controller = new AbortController();

  try {
    const response = await fetch(SIMULATED_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ question: userInput }),
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    if (!response.ok || !response.body) {
      throw new Error("bad stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        buffer += decoder.decode();
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const event = part.trim();
        if (!event) continue;

        const payload = event
          .split("\n")
          .map((line) => responseEventStream.safeParse(line.trim()))
          .find((result) => result.success)?.data;

        if (!payload) continue;

        if (payload.type === "token") {
          dispatch({ type: "message", payload });
        }

        if (payload.type === "done") {
          dispatch({ type: "answer", payload });
        }

        if (payload.type === "error") {
          dispatch({ type: "error-answer", payload });
        }
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("Fetch aborted by user action (browser stop button, closing tab, etc.)");
    }
  }
};
