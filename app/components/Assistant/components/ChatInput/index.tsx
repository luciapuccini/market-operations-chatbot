import { JSX, ComponentPropsWithoutRef, memo } from "react";
import AbortControllerService from "@/services/eventStream";
import Button from "@/app/components/ui/Button";

type ChatInputProps = ComponentPropsWithoutRef<"form">;

const ChatInput = ({ children, onSubmit }: ChatInputProps): JSX.Element => {
  return (
    <form onSubmit={onSubmit} className="w-1/2">
      <label htmlFor="query" className="sr-only">
        User:
      </label>
      <div className="flex w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
        <textarea
          key="user-input-text-area"
          name="userInput"
          id="query"
          rows={1}
          placeholder="Ask me anything..."
          required
          disabled={false}
          className="flex-1 resize-none bg-transparent px-1.5 py-0.5 text-slate-900 outline-none placeholder:text-slate-400"
        />
        <Button type="submit">ask question</Button>
        <Button
          type="button"
          className="bg-red-400 hover:bg-red-500"
          onClick={() => {
            AbortControllerService().abort("user cancelled");
          }}
        >
          cancel
        </Button>
      </div>
    </form>
  );
};

export default memo(ChatInput);
