import { Badge } from "@/app/components/ui/Badge";
import { Item, ItemContent, ItemTitle, ItemDescription } from "@/app/components/ui/Item";
import { cn } from "@/app/components/utilities";

import { EventStreamCitation } from "@/app/controllers/api/schemas";
import Link from "next/link";
import { ComponentProps, JSX } from "react";

type SourcesProps = ComponentProps<"article"> & {
  confidence: "low" | "high" | "medium";
  citations: EventStreamCitation[];
};

const getCitationLink = (citation: Omit<EventStreamCitation, "label">): string => {
  const newParams = new URLSearchParams([...Object.entries(citation).filter(Boolean)]);
  return "dashboard/?" + newParams.toString();
};

export default function Sources({ citations, confidence }: SourcesProps): JSX.Element {
  return (
    <details className="flex w-full max-w-sm flex-col gap-4">
      <summary className="ml-10 list-none">
        <Badge variant="outline" className="hover:cursor-pointer">
          Sources
        </Badge>
      </summary>
      <section className="flex w-full max-w-md flex-col gap-4">
        {citations.map(({ label, ...rest }, idx) => (
          <Item asChild variant="outline" key={`${idx}-${label}`} className="hover:bg-gray-100" size="xs">
            <Link href={getCitationLink(rest)}>
              <ItemContent>
                <ItemTitle>{label}</ItemTitle>
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
            </Link>
          </Item>
        ))}
      </section>
    </details>
  );
}
