import { useReducer } from "react";
import { EventStreamMessage } from "../types/types";

type AssistantQuestionMessage = readonly ["question", Partial<EventStreamMessage>];
type AssistantAnswerMessage = readonly ["answer", Partial<EventStreamMessage>];

type AssistantState = {
  currentMessage: string;
  messages: Array<AssistantAnswerMessage | AssistantQuestionMessage>;
};

export type AssistantAction = {
  type: "question" | "answer" | "message" | "error-answer";
  payload: EventStreamMessage;
};

const initialState = {
  messages: [],
  currentMessage: "",
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
    };
  }

  if (action.type === "error-answer") {
    const payloadError = action.payload.message || "";
    const newErrorMessage = ["answer", { message: payloadError }] as const;

    return {
      ...state,
      messages: [...state.messages, newErrorMessage],
    };
  }

  if (action.type === "message") {
    return {
      ...state,
      currentMessage: state.currentMessage + action.payload.value,
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
