import styles from "./styles.module.css"
import { AskguruConfiguration, Configuration } from "@/app/_interfaces"
import AskguruApi from "@/app/_utils/api"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function PopupButton({
  configuration,
  askguruConfiguration,
  askguruAPI,
}: {
  configuration: Configuration
  askguruConfiguration: AskguruConfiguration
  askguruAPI: AskguruApi
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    askguruAPI.logEvent({ eventType: "POPUP_SEEN" })
    if (localStorage.getItem("askguru-has-interacted")) {
      setHasInteracted(true)
    }
  }, [])

  function handleClick() {
    setIsCollapsed(!isCollapsed)
    setHasInteracted(true)
    localStorage.setItem("askguru-has-interacted", "true")
  }

  if (!configuration.token) return <h1>PNH</h1>

  console.log(configuration)
  console.log(askguruConfiguration)

  return (
    <>
      {!configuration.token}
      <div className={styles.wrapper}></div>
      <Image alt="kek" src="/original-chevron.svg" width={150} height={150} />
      <Image alt="kek" src="/next.svg" width={150} height={150} />
      <Image alt="lol" src="/original-chat-icon.svg" width={150} height={150} />
    </>
  )
}
