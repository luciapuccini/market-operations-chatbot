import { Badge } from "@/app/components/ui/Badge";
import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter } from "@/app/components/ui/Card";
import { TrendingUp } from "lucide-react";
import { ComponentProps, JSX } from "react";

type DataCardProps = ComponentProps<"article"> & {
  data: Record<string, unknown>;
  variant: "market" | "product" | "region";
};

export default function DataCard({ data, variant }: DataCardProps): JSX.Element {
  // TODO: use data
  if (variant === "market") {
    return (
      <article>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4.5%</CardTitle>
            <CardAction>
              <Badge variant="outline">+4.5%</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Steady performance increase <TrendingUp />
            </div>
            <div className="text-muted-foreground">Meets growth projections</div>
          </CardFooter>
        </Card>
      </article>
    );
  }

  if (variant === "product" || variant === "region") {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.name as string}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return <></>;
}
