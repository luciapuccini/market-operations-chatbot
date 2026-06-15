"use server";

import marketOperationsDataset from "@/data/data.json";
import { MarketsId, Period, ProductsId, RegionsId } from "../api/schemas";

export type DashboardSearchParams = RegionsId | ProductsId | MarketsId | Period;

type CustomData = {
  market: Record<string, unknown> | undefined;
  product: Record<string, unknown> | undefined;
  region: Record<string, unknown> | undefined;
  period: Record<string, unknown>[];
};

export async function getDashboardData(params: { [key: string]: DashboardSearchParams | undefined }) {
  const { marketId, productId, regionId, period } = params;

  let data = {} as CustomData;
  if (marketId) {
    const findMarket = marketOperationsDataset.markets.find((m) => m.id === marketId);
    data = {
      ...data,
      market: findMarket,
    };
  }
  if (productId) {
    const findProduct = marketOperationsDataset.products.find((p) => p.id === productId);
    data = {
      ...data,
      product: findProduct,
    };
  }

  if (regionId) {
    const findRegion = marketOperationsDataset.regions.find((r) => r.id === regionId);
    data = {
      ...data,
      region: findRegion,
    };
  }

  // NOTE: could get more detailed with the other params -- just to get something
  const findPeriod = marketOperationsDataset.series.filter((serie) => serie.period === period);
  data = {
    ...data,
    period: findPeriod,
  };

  return data;
}
