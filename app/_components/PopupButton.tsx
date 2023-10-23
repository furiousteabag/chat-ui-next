import styles from "./styles-popup-button.module.css"
import { Configuration } from "@/app/_interfaces"
import AskguruApi from "@/app/_lib/api"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function PopupButton({
  configuration,
  askguruAPI,
  isCollapsed,
  setIsCollapsed,
}: {
  configuration: Configuration
  askguruAPI: AskguruApi
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}) {
  const [hasInteracted, setHasInteracted] = useState(true)

  useEffect(() => {
    askguruAPI.logEvent({ eventType: "POPUP_SEEN" })
    if (!localStorage.getItem("askguru-has-interacted")) {
      setHasInteracted(false)
    }
  }, [])

  function handleClick(): void {
    setIsCollapsed(!isCollapsed)
    setHasInteracted(true)
    localStorage.setItem("askguru-has-interacted", "true")
    askguruAPI.logEvent({ eventType: "POPUP_CALLED" })
  }

  return (
    <button
      className={styles.button}
      style={{ backgroundColor: "#" + configuration.color }}
      onClick={() => handleClick()}
    >
      <Image
        alt=""
        src={isCollapsed ? configuration.popupIcon : "/chevron.svg"}
        width={64}
        height={64}
        priority={true}
      />
      {configuration.addUnreadDot && !hasInteracted && <div className={styles.unreadDot} />}
      {configuration.popupMessage && !hasInteracted && (
        <div className={styles.popupWidget} dangerouslySetInnerHTML={{ __html: configuration.popupMessage }} />
      )}
    </button>
  )
}
