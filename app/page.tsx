"use client"

import PopupButton from "@/app/_components/PopupButton"
import { AskguruConfiguration, Configuration } from "@/app/_interfaces"
import AskguruApi from "@/app/_lib/api"
import { defaultAskguruConfiguration, defaultConfiguration } from "@/app/configuration"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const searchParams: { [id: string]: any } = {}
  useSearchParams().forEach((value, key) => {
    searchParams[key] = value
  })
  const configuration: Configuration = {
    ...defaultConfiguration,
    ...searchParams,
  }

  const askguruConfiguration: AskguruConfiguration = {
    ...defaultAskguruConfiguration,
    token: configuration.token,
  }

  // localStorage.setItem("askguru-configuration", JSON.stringify(configuration))
  // localStorage.setItem( "askguru-api-configuration", JSON.stringify(askguruConfiguration))

  const askguruAPI = new AskguruApi({ askguruConfiguration })

  return (
    <div className="askguruApp">
      {configuration.token && (
        <PopupButton
          configuration={configuration}
          askguruAPI={askguruAPI}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}
    </div>
  )
}
