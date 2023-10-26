import Compose from "./Compose"
import Footer from "./Footer"
import Header from "./Header"
import Message from "./Message"
import styles from "./styles.module.css"
import { Configuration, MessageType } from "@/app/_interfaces"
import AskguruApi from "@/app/_lib/api"
import localizations from "@/app/_lib/localization"
import { FormEvent, useEffect, useRef } from "react"

export default function Chat({
  configuration,
  askguruAPI,
  setIsCollapsed,
  isMobile,
  isExpanded,
  setIsExpanded,
  messages,
  setMessages,
  composeValue,
  setComposeValue,
  isMessageLoading,
  setIsMessageLoading,
  handleClearConversation,
}: {
  configuration: Configuration
  askguruAPI: AskguruApi
  setIsCollapsed: (value: boolean) => void
  isMobile: boolean
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
  messages: MessageType[]
  setMessages: (value: MessageType[]) => void
  composeValue: string
  setComposeValue: (value: string) => void
  isMessageLoading: boolean
  setIsMessageLoading: (value: boolean) => void
  handleClearConversation: () => void
}) {
  const regexPattern = new RegExp(askguruAPI.sourcePattern)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  function handleCollapseButtonClick() {
    setIsCollapsed(true)
  }

  function handleResizeClick() {
    setIsExpanded(!isExpanded)
  }

  function checkForHumanHelp(messageText: string) {
    if (messageText.includes("live") && messageText.includes("agent")) {
      return true
    }
    return false
  }

  function handleSubmitUserMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (checkForHumanHelp(composeValue)) {
      askguruAPI.logEvent({
        eventType: "POPUP_NO_ANSWER_CLIENT",
        eventContext: { chat: messages },
      })
    }

    const newMessagesUser: MessageType[] = [...messages, { role: "user", content: composeValue }]
    const answerStream = askguruAPI.getAnswer({ chat: newMessagesUser })
    const newMessagesAssistant: MessageType[] = [...newMessagesUser, { role: "assistant", content: "" }]

    setComposeValue("")
    setMessages(newMessagesAssistant)
    setIsMessageLoading(true)

    let completeAnswer = ""
    let retrievedSources: any[] = []

    answerStream.addEventListener("open", (_event) => {
      try {
        // non used opening
      } catch (e) {
        console.log("Error on 'open' event of 'getAnswer':", e)
      }
    })
    answerStream.addEventListener("message", (event) => {
      try {
        const messageData = JSON.parse(event.data)
        if (messageData.answer) {
          const { request_id, sources, answer } = messageData
          if (sources.length === 0) {
            askguruAPI.logEvent({
              eventType: "POPUP_NO_ANSWER_SERVER",
              eventContext: { chat: newMessagesUser },
            })
          }

          completeAnswer += answer

          const match = completeAnswer.match(regexPattern)
          if (match) {
            const docIdx = match[1]
            const source = sources[docIdx]

            const link = source.id
            source.link = link

            var idx =
              retrievedSources.findIndex(
                (existingSource) => existingSource.id === source.id && existingSource.collection === source.collection,
              ) + 1
            if (idx === 0) {
              retrievedSources.push(source)
              idx = retrievedSources.length
            }

            completeAnswer = completeAnswer.replace(regexPattern, `[[${idx}]](${link})`)
          }

          let newMessages: MessageType[] = [...newMessagesAssistant]
          newMessages[newMessagesAssistant.length - 1].content = completeAnswer
          newMessages[newMessagesAssistant.length - 1].requestId = request_id
          setMessages(newMessages)
        }
      } catch (e) {
        console.log(e)
      }
    })
    answerStream.addEventListener("error", (_event) => {
      let newMessages: MessageType[] = [...newMessagesAssistant]
      if (!completeAnswer) {
        newMessages[newMessagesAssistant.length - 1].content = localizations[configuration.lang].errorMessage
        setMessages(newMessages)
      } else {
        newMessages[newMessagesAssistant.length - 1].content = completeAnswer
      }
      setIsMessageLoading(false)
      answerStream.close()
      localStorage.setItem("askguru-chat-history", JSON.stringify(newMessages))
      setTimeout(() => {
        scrollToBottom()
      }, 25)
    })
  }

  return (
    <div
      className={`${styles.chat} ${
        isMobile
          ? styles.chatMobile
          : `${styles.chatDesktop} ${isExpanded ? styles.chatDesktopExpanded : styles.chatDesktopNormal}`
      }`}
      style={{
        bottom: isMobile ? 0 : configuration.bottomIndent + 72, // 64 (height of the button) + 8 (indent)
        right: isMobile ? 0 : configuration.rightIndent,
      }}
    >
      <Header
        configuration={configuration}
        onClearButtonClick={handleClearConversation}
        isMobile={isMobile}
        onCollapseButtonClick={handleCollapseButtonClick}
      />
      <div className={styles.content}>
        {messages.map((message, index) => {
          return (
            <Message
              key={index}
              message={message}
              selectedColor={"#" + configuration.color}
              isFirst={index === 0}
              isLast={messages.length - 1 === index}
              isLoading={isMessageLoading}
              askguruAPI={askguruAPI}
            />
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      <Compose
        configuration={configuration}
        composeValue={composeValue}
        setComposeValue={setComposeValue}
        isLoading={isMessageLoading}
        onSubmitUserMessage={handleSubmitUserMessage}
        onResizeClick={handleResizeClick}
        isMobile={isMobile}
      />
      {!configuration.whitelabel && <Footer />}
    </div>
  )
}
