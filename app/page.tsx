"use client"

import Chat from "@/app/_components/Chat"
import PopupButton from "@/app/_components/PopupButton"
import { AskguruConfiguration, Configuration } from "@/app/_interfaces"
import AskguruApi from "@/app/_lib/api"
import { defaultAskguruConfiguration, defaultConfiguration } from "@/app/configuration"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const mobileWindowWidthThreshold = 450

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const configuration: Configuration = {
    ...defaultConfiguration,
    ...Object.fromEntries(useSearchParams()),
  }

  const askguruConfiguration: AskguruConfiguration = {
    ...defaultAskguruConfiguration,
    token: configuration.token,
  }

  const askguruAPI = new AskguruApi({ askguruConfiguration })

  function handleResize() {
    setIsMobile(window.innerWidth < mobileWindowWidthThreshold)
  }

  useEffect(() => {
    console.log("AskGuru chat pop-up configuration:", configuration)

    handleResize()
    window.addEventListener("resize", () => handleResize())
    return () => {
      window.removeEventListener("resize", () => handleResize())
    }
  }, [])

  return (
    <>
      {configuration.token && (!isMobile || isCollapsed) && (
        <PopupButton
          configuration={configuration}
          askguruAPI={askguruAPI}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}
      {configuration.token && !isCollapsed && (
        <Chat
          configuration={configuration}
          askguruAPI={askguruAPI}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
        />
      )}
    </>
  )
}
