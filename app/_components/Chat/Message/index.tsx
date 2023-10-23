import ReactionButton from "./ReactionButton"
import TripleDots from "./TripleDots"
import styles from "./styles.module.css"
import { MessageType, ReactionType } from "@/app/_interfaces"
import AskguruApi from "@/app/_lib/api"
import { marked } from "marked"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Message({
  message,
  selectedColor,
  isFirst,
  isLast,
  isLoading,
  askguruAPI,
}: {
  message: MessageType
  selectedColor: string
  isLoading: boolean
  isFirst: boolean
  isLast: boolean
  askguruAPI: AskguruApi
}) {
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null)

  function handleReaction(reaction: ReactionType): void {
    setCurrentReaction(reaction)
    if (message.requestId) {
      askguruAPI.setReaction({
        requestId: message.requestId,
        likeStatus: reaction === "LIKE" ? "good_answer" : "wrong_answer",
      })
    }
  }

  useEffect(() => {
    const tokenizer = new marked.Tokenizer()
    const renderer = new marked.Renderer()
    // tokenizer.lheading = function () {
    //   return false
    // }
    tokenizer.lheading = (_src) => undefined
    renderer.link = (href, _title, text) => `<a target="_blank" href="${href}">${text}</a>`

    marked.setOptions({
      tokenizer: tokenizer,
      renderer: renderer,
      // headerIds: false,
      // mangle: false,
    })
  }, [])

  return (
    <div className={message.role === "assistant" ? "askguru-message-container" : "askguru-message-container from-user"}>
      <div
        className={styles.message}
        style={message.role !== "assistant" ? { backgroundColor: selectedColor, cursor: "default" } : {}}
      >
        <div dangerouslySetInnerHTML={{ __html: marked(message.content) }} />
        {message.role === "assistant" && isLoading && isLast && <TripleDots />}
        {message.role === "assistant" && isLast && !isLoading && !isFirst && (
          <>
            {currentReaction === null ? (
              <div className={styles.messageRating}>
                <ReactionButton reaction="LIKE" hoverColor={selectedColor} onButtonClick={handleReaction} />
                <ReactionButton reaction="DISLIKE" hoverColor={selectedColor} onButtonClick={handleReaction} />
              </div>
            ) : (
              <div className="askguru-feedback-thanks">
                <Image alt="" src="/images/chat/message/feedback-submit-tick.svg" width={28} height={28} />
                Thanks for submitting your feedback!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
