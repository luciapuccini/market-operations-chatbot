import z from "zod";

export const regionId = z.literal(["na", "eu", "apac", "latam"]);
export const productId = z.literal(["veltrix", "nuvora", "orbispan", "calyx", "zephyra"]);
export const marketId = z.literal(["us", "ca", "de", "gb", "fr", "it", "es", "jp", "cn", "in", "au", "br", "mx"]);

export type RegionsId = z.infer<typeof regionId>;
export type ProductsId = z.infer<typeof productId>;
export type MarketsId = z.infer<typeof marketId>;
const period = z.templateLiteral([z.string(), "-", z.string()]);
export type Period = z.infer<typeof period>;

export const eventStreamCitation = z.object({
  period,
  label: z.string(),
  regionId: regionId.optional(),
  marketId: marketId.optional(),
  productId: productId.optional(),
});
export type EventStreamCitation = z.infer<typeof eventStreamCitation>;

export const eventStreamMessage = z.object({
  type: z.literal(["token", "done", "error"]),
  value: z.string().optional(),
  kind: z.literal(["normal", "low_confidence", "abstain", "error"]).optional(),
  citations: z.array(eventStreamCitation).optional(),
  confidence: z.literal(["low", "high", "medium"]).optional(),
  message: z.string().optional(),
});
export type EventStreamMessage = z.infer<typeof eventStreamMessage>;

export type EventStreamTypes = EventStreamMessage["type"];
export type EventStreamKinds = NonNullable<EventStreamMessage["kind"]>;
export type EventStreamConfidence = EventStreamMessage["confidence"];

// TODO: could get more detailed -- nice to have
// data: {"type":"token","value":"this "}
// data: {"type":"done","kind":"low_confidence","citations":[],"confidence":"low"}
// data: {"type":"error","message":"Simulated upstream."}
export const responseEventStream = z.templateLiteral(["data: ", z.string()]).transform((resp) => {
  try {
    const chunk = resp.split("data: ")[1].trimEnd();
    const chunkToObject = JSON.parse(chunk);
    return eventStreamMessage.parse(chunkToObject);
  } catch (error) {
    console.error("Streaming response validation fail:", error);
    throw error;
  }
});
export type ResponseEventStream = z.infer<typeof responseEventStream>;
