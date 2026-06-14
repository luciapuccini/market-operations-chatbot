import { Badge } from "@/app/components/ui/Badge";
import { Item, ItemContent, ItemTitle, ItemDescription } from "@/app/components/ui/Item";
import { cn } from "@/app/components/utilities/cn";

import { EventStreamCitation } from "@/app/controllers/api/schemas";
import { ComponentProps, JSX } from "react";

type SourcesProps = ComponentProps<"article"> & {
  confidence: "low" | "high" | "medium";
  citations: EventStreamCitation[];
};

const getCitationLink = (citation: EventStreamCitation) => {
  //FIXME:
  return `/?market=${citation.marketId}&period=${citation.period}&product=${citation.productId}&region=${citation.regionId}`;
};

export default function Sources({ children, citations, confidence }: SourcesProps): JSX.Element {
  return (
    <details className="flex w-full max-w-md flex-col gap-4">
      <summary className="list-none">
        <Badge variant="outline" className="hover:cursor-pointer">
          Sources
        </Badge>
      </summary>
      <section className="flex w-full max-w-md flex-col gap-4">
        {citations.map((cit, idx) => (
          <Item asChild variant="outline" key={`${idx}-${cit.period}`} className="hover:bg-gray-100" size="xs">
            <a
              // {/* TODO:  default values and better with zod */}
              href={getCitationLink(cit)}
            >
              <ItemContent>
                <ItemTitle>{cit.label}</ItemTitle>
                <ItemDescription
                  className={cn(
                    confidence === "high"
                      ? "text-blue-900"
                      : confidence === "medium"
                        ? "text-amber-900"
                        : "text-red-900",
                  )}
                >
                  Confidence level: {confidence}
                </ItemDescription>
              </ItemContent>
            </a>
          </Item>
        ))}
      </section>
    </details>
  );
}
