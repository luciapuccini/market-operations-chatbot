import type { EventStreamMessage } from "../controllers/api/shemas";

export type {
  EventStreamCitations,
  EventStreamConfidence,
  EventStreamKinds,
  EventStreamMessage,
  EventStreamTypes,
  MarketsId,
  ProductsId,
  RegionsId,
} from "../controllers/api/shemas";

export type ResponseEventStream = `data: ${string}`;
export type AssistantMessage = EventStreamMessage;
// data: {"type":"token","value":"this "}
// data: {"type":"done","kind":"low_confidence","citations":[],"confidence":"low"}
// data: {"type":"error","message":"Simulated upstream."}
