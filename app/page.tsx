"use client"

import Chat from "@/app/_components/Chat"
import PopupButton from "@/app/_components/PopupButton"
import { AskguruConfiguration, Configuration, MessageType } from "@/app/_interfaces"
import AskguruApi from "@/app/_lib/api"
import { defaultAskguruConfiguration, defaultConfiguration } from "@/app/configuration"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const mobileWindowWidthThreshold = 450

function parseSearchParams(params: { [k: string]: string }): Partial<Configuration> {
  const parsed: Partial<Configuration> = { ...params }
  if (params.whitelabel !== undefined) parsed.whitelabel = params.whitelabel.toLowerCase() === "true"
  if (params.addUnreadDot !== undefined) parsed.addUnreadDot = params.addUnreadDot.toLowerCase() === "true"
  if (params.bottomIndent !== undefined) parsed.bottomIndent = parseInt(params.bottomIndent)
  if (params.rightIndent !== undefined) parsed.rightIndent = parseInt(params.rightIndent)
  return parsed
}

export default function Home() {
  // State of Chat component live here to save it
  // during collapses
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [composeValue, setComposeValue] = useState("")
  const [isMessageLoading, setIsMessageLoading] = useState(false)

  const configuration: Configuration = {
    ...defaultConfiguration,
    ...parseSearchParams(Object.fromEntries(useSearchParams())),
  }

  const askguruConfiguration: AskguruConfiguration = {
    ...defaultAskguruConfiguration,
    token: configuration.token,
  }

  const askguruAPI = new AskguruApi({ askguruConfiguration })

  const messagesInitialState: MessageType[] = [{ role: "assistant", content: configuration.welcomeMessage }]

  function handleResize() {
    setIsMobile(window.innerWidth < mobileWindowWidthThreshold)
  }

  function handleClearConversation() {
    setMessages(messagesInitialState)
    localStorage.setItem("askguru-chat-history", JSON.stringify(messagesInitialState))
  }

  useEffect(() => {
    console.log("AskGuru chat pop-up configuration:", configuration)

    const messagesHistory = localStorage.getItem("askguru-chat-history")
    if (messagesHistory) {
      setMessages(JSON.parse(messagesHistory))
    } else {
      setMessages(messagesInitialState)
    }

    if (!localStorage.getItem("askguru-has-interacted")) {
      setHasInteracted(false)
    }

    handleResize()
    window.addEventListener("resize", () => handleResize())
    return () => {
      window.removeEventListener("resize", () => handleResize())
    }
  }, [])

  return (
    <>
      {configuration.token && (isCollapsed || !isMobile) && (
        <PopupButton
          configuration={configuration}
          askguruAPI={askguruAPI}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          hasInteracted={hasInteracted}
          setHasInteracted={setHasInteracted}
        />
      )}
      {configuration.token && !isCollapsed && (
        <Chat
          configuration={configuration}
          askguruAPI={askguruAPI}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          messages={messages}
          setMessages={setMessages}
          composeValue={composeValue}
          setComposeValue={setComposeValue}
          isMessageLoading={isMessageLoading}
          setIsMessageLoading={setIsMessageLoading}
          handleClearConversation={handleClearConversation}
        />
      )}
    </>
  )
}
