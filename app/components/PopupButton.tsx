import styles from "./styles.module.css"
import { AskguruConfiguration, Configuration } from "@/app/_interfaces"
import AskguruApi from "@/app/_utils/api"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function PopupButton({
  configuration,
  askguruAPI,
}: {
  configuration: Configuration
  askguruAPI: AskguruApi
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(true)

  useEffect(() => {
    askguruAPI.logEvent({ eventType: "POPUP_SEEN" })
    if (!localStorage.getItem("askguru-has-interacted")) {
      setHasInteracted(false)
    }
  }, [])

  function handleClick() {
    setIsCollapsed(!isCollapsed)
    setHasInteracted(true)
    localStorage.setItem("askguru-has-interacted", "true")
    askguruAPI.logEvent({ eventType: "POPUP_CALLED" })
  }

  console.log(configuration)
  console.log(askguruAPI.sourcePattern)

  return (
    <button
      className={styles.button}
      style={{ backgroundColor: "#" + configuration.color }}
      onClick={() => handleClick()}
    >
      <Image alt="" src={isCollapsed ? configuration.popupIcon : "/chevron.svg"} width={64} height={64} />
      {configuration.addUnreadDot && !hasInteracted && <div className={styles.unreadDot} />}
      {configuration.popupMessage && !hasInteracted && (
        <div className={styles.popupWidget} dangerouslySetInnerHTML={{ __html: configuration.popupMessage }} />
      )}
    </button>
  )
}
