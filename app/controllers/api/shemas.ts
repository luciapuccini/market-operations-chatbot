import z from "zod";

export const regionId = z.literal(["na", "eu", "apac", "latam"]);
export const productId = z.literal(["veltrix", "nuvora", "orbispan", "calyx", "zephyra"]);
export const marketId = z.literal(["us", "ca", "de", "gb", "fr", "it", "es", "jp", "ch", "in", "au", "br", "mx"]);

export type RegionsId = z.infer<typeof regionId>;
export type ProductsId = z.infer<typeof productId>;
export type MarketsId = z.infer<typeof marketId>;

export const eventStreamCitations = z.object({
  period: z.templateLiteral([z.string(), "-", z.string()]),
  label: z.string(),
  regionId: regionId.optional(),
  marketId: marketId.optional(),
  productId: productId.optional(),
});
export type EventStreamCitations = z.infer<typeof eventStreamCitations>;

export const eventStreamMessage = z.object({
  type: z.literal(["token", "done", "error"]),
  value: z.string().optional(),
  kind: z.literal(["normal", "low_confidence", "abstain", "error"]).optional(),
  citations: z.array(eventStreamCitations),
  confidence: z.literal(["low", "high", "medium"]),
  message: z.string().optional(),
});
export type EventStreamMessage = z.infer<typeof eventStreamMessage>;

export type EventStreamTypes = EventStreamMessage["type"];
export type EventStreamKinds = NonNullable<EventStreamMessage["kind"]>;
export type EventStreamConfidence = EventStreamMessage["confidence"];
