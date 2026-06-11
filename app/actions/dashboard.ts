"use server";

import marketOperationsDataset from "@/data/data.json";

export async function getDashboardData() {
  return marketOperationsDataset;
}
