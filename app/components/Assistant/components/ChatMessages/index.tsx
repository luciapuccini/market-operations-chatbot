import { AssistantAnswerMessage, AssistantQuestionMessage } from "@/app/hooks/useEventMessages";
import { ComponentProps, useEffect, useRef } from "react";
import { JSX } from "react/jsx-runtime";
import { ChatMessage } from "./components/ChatMessage";

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
    <section className="overflow mb-4 w-full overflow-y-auto scroll-smooth" ref={target}>
      <ul className="flex w-full flex-col justify-end">
        {messages.length > 0 && messages.map((m, index) => <ChatMessage key={`${m[0]}-${index}`} message={m} />)}
      </ul>
    </section>
  );
};

export default ChatMessages;
