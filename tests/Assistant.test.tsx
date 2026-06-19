import { expect, test, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import Page from "@/app/page";
import ChatMessages from "@/app/components/Assistant/components/ChatMessages";
import { abortCurrentRequest, getAssistantEvent } from "@/app/components/Assistant/utils";
import type { AssistantAction } from "@/app/hooks/useEventMessages";

vi.mock("@/app/api/chat/route", () => ({
  POST: vi.fn(),
}));

vi.mock("@/app/components/Assistant/utils", () => ({
  getAssistantEvent: vi.fn(),
  abortCurrentRequest: vi.fn(),
}));

function mockGetAssistantEvent(...actions: AssistantAction[]) {
  vi.mocked(getAssistantEvent).mockImplementation(async ({ dispatch }) => {
    actions.forEach(dispatch);
  });
}

afterEach(() => {
  vi.mocked(getAssistantEvent).mockReset();
  vi.mocked(abortCurrentRequest).mockReset();
});

global.MutationObserver = class {
  constructor() {}
  disconnect() {}
  observe = vi.fn();
  takeRecords = vi.fn();
};

test("Page renders", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1, name: "Market Operations Assistant" })).toBeDefined();
});

// Testing App state response to "external" API
test("On API token stream message, the assistant handles accumulating streams of text", async () => {
  // given
  mockGetAssistantEvent({ type: "message", payload: { type: "token", value: "apac region shows ..." } });
  render(<Page />);

  // when
  const textarea = screen.getByTestId("userInput");
  fireEvent.change(textarea, { target: { value: "how is apac doing?" } });
  fireEvent.submit(textarea.closest("form")!);

  // then —> ChatMessageSkeleton implies streaming
  expect(await screen.findByTestId("chat-message-skeleton")).toBeDefined();
  expect(screen.queryByTestId("chat-message")).toBeNull();
});

test("On API done event, the assistant commits the streamed text as an answer", async () => {
  // given
  mockGetAssistantEvent(
    { type: "message", payload: { type: "token", value: "final answer" } },
    { type: "answer", payload: { type: "done", kind: "normal", citations: [], confidence: "high" } },
  );
  render(<Page />);

  // when
  const textarea = screen.getByTestId("userInput");
  fireEvent.change(textarea, { target: { value: "is germany at risk?" } });
  fireEvent.submit(textarea.closest("form")!);

  // then
  expect(await screen.findByText("final answer")).toBeDefined();
});

test("On API error event, the assistant renders the error message", async () => {
  // given
  mockGetAssistantEvent({ type: "error-answer", payload: { type: "error", message: "Something went wrong" } });
  render(<Page />);

  // when
  const textarea = screen.getByTestId("userInput");
  fireEvent.change(textarea, { target: { value: "force an error" } });
  fireEvent.submit(textarea.closest("form")!);

  // then
  const errorMessage = await screen.findByText("Something went wrong");
  expect(errorMessage.closest("div")?.className).toContain("destructive");
  // error does NOT trigger abort
  expect(abortCurrentRequest).not.toHaveBeenCalled();
});

test("On User cancel request, the assitant shows abort message", async () => {
  // given
  render(<Page />);
  // when
  const textarea = screen.getByTestId("userInput");
  fireEvent.change(textarea, { target: { value: "normal user input" } });
  fireEvent.submit(textarea.closest("form")!);

  const cancelBtn = screen.getByRole("button", { name: "cancel" });
  fireEvent.click(cancelBtn);
  //then
  const abortMessage = await screen.findByText("User Aborted Request...");
  expect(abortMessage.closest("div")?.className).toContain("destructive");
  expect(abortCurrentRequest).toHaveBeenCalled();
});

// Testing different UI given different data variations
test("ChatMessages shows list of messages", () => {
  // given
  render(
    <ChatMessages
      messages={[
        ["question", { message: "user question" }],
        [
          "answer",
          {
            type: "done",
            kind: "normal",
            citations: [],
            confidence: "high",
            message:
              "Three stand out as Germany is the clearest concern: it's below forecast and down year on year, sharp dip in March. Italy is tracking under its forecast on softening demand, growth has stalled near flat. The rest of the portfolio is on or ",
          },
        ],
      ]}
      currentMessage=""
    />,
  );
  //when
  const renderChatMessage = screen.queryAllByTestId("chat-message");
  //then
  expect(renderChatMessage).toBeDefined();
  expect(screen.queryAllByText("Sources")).toHaveLength(0);
});

test("ChatMessages shows Sources if citations are present", () => {
  // given
  render(
    <ChatMessages
      messages={[
        ["question", { message: "user question" }],
        [
          "answer",
          {
            type: "done",
            kind: "normal",
            citations: [
              {
                period: "2026-05",
                label: "Germany, latest period",
                marketId: "de",
              },
              {
                period: "2026-03",
                label: "Germany, March dip",
                marketId: "de",
              },
              {
                period: "2026-05",
                label: "Italy, latest period",
                marketId: "it",
              },
              {
                period: "2026-05",
                label: "Brazil, latest period",
                marketId: "br",
              },
            ],
            confidence: "high",
            message:
              "Three stand out as Germany is the clearest concern: it's below forecast and down year on year, sharp dip in March. Italy is tracking under its forecast on softening demand, growth has stalled near flat. The rest of the portfolio is on or ",
          },
        ],
      ]}
      currentMessage=""
    />,
  );
  //when
  const renderChatMessage = screen.queryAllByTestId("chat-message");
  //then
  expect(renderChatMessage).toBeDefined();
  expect(screen.queryAllByText("Sources")).toHaveLength(1);
});
