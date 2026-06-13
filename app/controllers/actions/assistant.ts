"use server";

import { AssistantMessage } from "../../types/types";

export const getAssistantMessages = async (formData: FormData): Promise<unknown> => {
  try {
    const query = formData.get("query") as string;
    console.log("🚀 ~ query:", query);
  } catch (e) {
    console.error(e);
  }
};
