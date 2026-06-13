import { ComponentProps, JSX, memo } from "react";
import { cn } from "../utilities/cn";

const Button = ({ children, className, ...props }: ComponentProps<"button">): JSX.Element => {
  const classes = cn("rounded bg-amber-400 px-4 py-2 font-bold text-white hover:bg-amber-500", className);

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default memo(Button);
