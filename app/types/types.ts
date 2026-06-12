type RegionsId = "na" | "eu" | "apac" | "latam";
type ProductsId = "veltrix" | "nuvora" | "orbispan" | "calyx" | "zephyra";
type MarketsId =
  | "us"
  | "ca"
  | "de"
  | "gb"
  | "fr"
  | "it"
  | "es"
  | "jp"
  | "ch"
  | "in"
  | "au"
  | "br"
  | "mx";

export type EventStreamCitations = {
  period: `${string}-${string}`;
  label: string;
  regionId?: RegionsId;
  marketId?: MarketsId;
  productId?: ProductsId;
};

export type EventStreamTypes = "token" | "done" | "error";
export type ResponseEventStream = `data: ${string}`;
// data: {"type":"token","value":"this "}
// data: {"type":"done","kind":"low_confidence","citations":[],"confidence":"low"}
// data: {"type":"error","message":"Simulated upstream."}

export type AssistantMessage = {
  type: EventStreamTypes;
  value?: string;
  kind?: "normal" | "low_confidence" | "abstain" | "error";
  citations: EventStreamCitations | [];
  confidence: "low" | "high" | "medium";
  message?: string;
};
