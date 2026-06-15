import { ComponentProps } from "react";

type DetailedSectionProps = ComponentProps<"div"> & {
  data: unknown;
};

export default function DetailedSection({ data }: DetailedSectionProps) {
  // TODO: use data
  return <div>{}</div>;
}
