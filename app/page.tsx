"use client"

import { AskguruConfiguration, Configuration } from "./_interfaces"
import AskguruApi from "./_utils/api"
import PopupButton from "./components/PopupButton"
import { defaultAskguruConfiguration, defaultConfiguration } from "./configuration"
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
