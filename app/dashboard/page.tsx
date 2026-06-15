import { JSX, Suspense } from "react";
import { DashboardSearchParams, getDashboardData } from "../controllers/actions/dashboard";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../components/ui/Breadcrumb";
import { safeJsonLd } from "../components/utilities";

import DataCard from "./components/DataCard";
import DetailedSection from "./components/DetailedSection";

// NOTE: does not really apply for a backoffice product, just a demo
const breadcrumJsonLd = (): Record<string, unknown> => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    // TODO: make dynamic
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": "https://example.com/dresses",
          name: "Product",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": "https://example.com/dresses/real",
          name: "Market",
        },
      },
    ],
  };
};

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: DashboardSearchParams | undefined }>;
}) {
  const sp = await searchParams;
  const data = await getDashboardData(sp);

  return (
    <main className="h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Market Platform</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Product</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Market</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumJsonLd()) }} />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {data.market && <DataCard variant="market" data={data.market} />}
          {data.product && <DataCard variant="product" data={data.product} />}
          {data.region && <DataCard variant="region" data={data.region} />}
        </div>
        <div className="bg-muted/50 min-h-screen flex-1 rounded-xl">
          <DetailedSection data={data.period} />
        </div>
      </div>
    </main>
  );
}
