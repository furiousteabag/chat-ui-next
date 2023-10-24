import Compose from "./Compose"
import Footer from "./Footer"
import Header from "./Header"
import Message from "./Message"
import { Configuration, MessageType } from "@/app/_interfaces"
import AskguruApi from "@/app/_lib/api"
import { FormEvent, useEffect, useRef, useState } from "react"

export default function Chat({
  configuration,
  askguruAPI,
  setIsCollapsed,
  isMobile,
}: {
  configuration: Configuration
  askguruAPI: AskguruApi
  setIsCollapsed: (value: boolean) => void
  isMobile: boolean
}) {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [composeValue, setComposeValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesInitialState: MessageType[] = [{ role: "assistant", content: configuration.welcomeMessage }]
  const regexPattern = new RegExp(askguruAPI.sourcePattern)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const messagesHistory = localStorage.getItem("askguru-chat-history")
    if (messagesHistory) {
      setMessages(JSON.parse(messagesHistory))
    } else {
      setMessages(messagesInitialState)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  function handleClearConversation() {
    localStorage.setItem("askguru-chat-history", JSON.stringify(messagesInitialState))
    setMessages(messagesInitialState)
  }

  function handleCollapseButtonClick() {
    setIsCollapsed(true)
  }

  function handleResizeClick() {
    const wrapper = document.getElementById("ask-guru-wrapper")
    if (wrapper) {
      if (wrapper.style.height !== "650px") {
        wrapper.style.maxHeight = "calc(100vh - 104px)"
        wrapper.style.maxWidth = "calc(100vw - 32px)"

        wrapper.style.minWidth = "auto"
        wrapper.style.minHeight = "auto"

        wrapper.style.width = "450px"
        wrapper.style.height = "650px"
      } else {
        wrapper.style.maxWidth = "calc(100vw - 32px)"
        wrapper.style.minWidth = "calc(100vw - 32px)"
        wrapper.style.maxHeight = "calc(100vh - 104px)"
        wrapper.style.minHeight = "calc(100vh - 104px)"

        wrapper.style.width = "100%"
        wrapper.style.height = "100%"
      }
    }
  }

  function checkForHumanHelp(messageText: string) {
    if (messageText.includes("live") && messageText.includes("agent")) {
      return true
    }
    return false
  }

  async function handleSubmitUserMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading || composeValue === undefined || composeValue === null || composeValue.length === 0) {
      return
    }

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
    setIsLoading(true)

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
              eventContext: { chat: messages },
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

          let newMessages: MessageType[] = [...messages]
          newMessages[messages.length - 1].content = completeAnswer
          newMessages[messages.length - 1].requestId = request_id
          setMessages([...newMessages])
        }
      } catch (e) {
        console.log(e)
      }
    })
    answerStream.addEventListener("error", (_event) => {
      setIsLoading(false)
      answerStream.close()
      localStorage.setItem("askguru-chat-history", JSON.stringify(messages))
      setTimeout(() => {
        scrollToBottom()
      }, 25)
    })
  }

  return (
    <div className="askguru-container">
      <Header
        configuration={configuration}
        onClearButtonClick={handleClearConversation}
        isMobile={isMobile}
        onCollapseButtonClick={handleCollapseButtonClick}
      />
      <div className="askguru-content">
        {messages.map((message, index) => {
          return (
            <Message
              key={index}
              message={message}
              selectedColor={"#" + configuration.color}
              isFirst={index === 0}
              isLast={messages.length - 1 === index}
              isLoading={isLoading}
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
        isLoading={isLoading}
        onSubmitUserMessage={handleSubmitUserMessage}
        onResizeClick={handleResizeClick}
        isMobile={isMobile}
      />
      {!configuration.whitelabel && <Footer />}
    </div>
  )
}
