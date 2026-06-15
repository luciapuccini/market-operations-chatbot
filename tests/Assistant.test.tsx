import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Page from "@/app/page";

import ChatMessages from "@/app/components/Assistant/components/ChatMessages";

vi.mock("@/app/api/chat/route", () => ({
  POST: vi.fn(),
}));

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

test("ChatMessages shows stream", () => {
  // given
  render(<ChatMessages messages={[]} currentMessage="streaming..." />);
  //when
  const message = screen.getByText("streaming...");
  //then
  expect(message).toBeDefined();
});

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
