import { useReducer } from "react";
import { EventStreamMessage } from "../types/types";

// NOTE: skip value for the state to avoid confusion
export type AssistantQuestionMessage = readonly ["question", Partial<Omit<EventStreamMessage, "value">>];
export type AssistantAnswerMessage = readonly ["answer", Partial<EventStreamMessage>];
export type AssistantMessage = AssistantAnswerMessage | AssistantQuestionMessage;

type AssistantState = {
  currentMessage: string;
  isStreaming: boolean;
  messages: Array<AssistantAnswerMessage | AssistantQuestionMessage>;
};

export type AssistantAction = {
  type: "question" | "answer" | "message" | "error-answer" | "abort";
  payload: EventStreamMessage;
};

const initialState = {
  messages: [],
  currentMessage: "",
  isStreaming: false,
};

const reducerFn = (state: AssistantState, action: AssistantAction): AssistantState => {
  if (action.type === "answer") {
    const newAnswer = [
      "answer",
      {
        ...action.payload,
        message: state.currentMessage,
      },
    ] as const;
    return {
      ...state,
      messages: [...state.messages, newAnswer],
      currentMessage: "",
      isStreaming: false,
    };
  }

  if (action.type === "error-answer") {
    const payloadError = action.payload.message || "";

    const newErrorMessage = ["answer", { message: payloadError, type: "error" }] as const;

    return {
      ...state,
      messages: [...state.messages, newErrorMessage],
    };
  }
  if (action.type === "abort") {
    const newErrorMessage = ["answer", { message: "User Aborted Request...", type: "error" }] as const;
    return {
      ...state,
      currentMessage: "",
      isStreaming: false,
      messages: [...state.messages, newErrorMessage],
    };
  }

  if (action.type === "message") {
    return {
      ...state,
      currentMessage: state.currentMessage + action.payload.value,
      isStreaming: true,
    };
  }

  if (action.type === "question") {
    const userMessage = action.payload.message || "";
    const newQuestion = ["question", { message: userMessage }] as const;
    return {
      ...state,
      messages: [...state.messages, newQuestion],
    };
  }

  return state;
};

export const useEventMessages = () => {
  const [state, dispatch] = useReducer(reducerFn, initialState);

  return [state, dispatch] as const;
};
