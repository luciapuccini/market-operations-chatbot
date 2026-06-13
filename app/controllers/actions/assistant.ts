"use server";

import { AssistantMessage } from "../../types/types";

export const getAssistantMessages = async (formData: FormData): Promise<unknown> => {
  try {
    const query = formData.get("query") as string;
    console.log("🚀 ~ query:", query);
    // TODO: add zod validation safeparse + mock send to api
    // const validationResult = SignInSchema.safeParse(data);

    // opening a connection to the server to begin receiving events from it
    const eventSource = new EventSource("http://localhost:3000/api/chat");

    // attaching a handler to receive message events
    eventSource.onmessage = (event: MessageEvent<AssistantMessage>) => {
      console.log("🚀 ~ event:", event);
      // WIP: return to client
      //   const fixtureData = JSON.parse(event.data);
    };
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
    };

    // terminating the connection on component unmount
    return () => eventSource.close();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Something bad happended",
      message: "Something bad happended",
    };
  }
};
