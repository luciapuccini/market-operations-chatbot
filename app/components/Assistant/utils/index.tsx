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

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const finalMessage = responseEventStream.parse(chunk);

      if (finalMessage.type === "token") {
        setTimeout(() => {
          dispatch({ type: "message", payload: finalMessage });
        }, 0);
      }

      if (finalMessage.type === "done") {
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
};
