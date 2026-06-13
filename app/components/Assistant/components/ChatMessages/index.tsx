import { AssistantAnswerMessage, AssistantQuestionMessage } from "@/app/hooks/useEventMessages";
import { cn } from "@/app/components/ui/utilities/cn";
import { ComponentProps, useEffect, useRef } from "react";
import { JSX } from "react/jsx-runtime";

type ChatMessagesProps = ComponentProps<"section"> & {
  messages: Array<AssistantAnswerMessage | AssistantQuestionMessage>;
};

const ChatMessages = ({ children, messages }: ChatMessagesProps): JSX.Element => {
  const target = useRef(null);

  useEffect(() => {
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          target.current.scroll({
            top: target.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(target.current, config);
  }, [target]);

  return (
    <section className="overflow w-full overflow-y-auto scroll-smooth" ref={target}>
      <ul className="flex w-full flex-col justify-end">
        {messages.length > 0 &&
          messages.map(([msgId, meta], index) => {
            const questionClass = "text-amber-600 ml-2";
            const answerClass = "text-slate-600 ml-2";
            return (
              <li key={`${msgId}-${index}`} className={cn(`${msgId === "answer" ? "" : "text-end"}`, "mb-4")}>
                <span className={` ${msgId === "answer" ? answerClass : questionClass}`}>{meta.message}</span>
              </li>
            );
          })}
      </ul>
    </section>
  );
};

export default ChatMessages;
