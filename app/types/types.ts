export type Fixture = {
  id: string;
  keywords?: string[];
  kind: "normal" | "low_confidence" | "abstain" | "error";
  answer: { text: string; citations: unknown[]; confidence: string };
  error?: string;
};

// data: {"type":"token","value":"this "}
// data: {"type":"done","kind":"low_confidence","citations":[],"confidence":"low"}
export type AssistantMessage = {
  type: "token" | "done";
  value?: string;
  kind?: "normal" | "low_confidence" | "abstain" | "error";
  citations: unknown[];
  confidence: "low" | "high" | "medium";
};
