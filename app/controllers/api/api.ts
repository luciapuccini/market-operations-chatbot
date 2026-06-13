import { AssistantAction } from "@/app/hooks/useEventMessages";
import { EventStreamMessage } from "@/app/types/types";
import AbortControllerService from "@/services/eventStream";
import { ActionDispatch } from "react";

const SIMULATED_ENDPOINT = "/api/chat";

export const getAssistantEvent = async ({
  userInput,
  dispatch,
}: {
  userInput: string;
  dispatch: ActionDispatch<[action: AssistantAction]>;
}): Promise<void> => {
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
};
