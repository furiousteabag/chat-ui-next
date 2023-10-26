import styles from "./styles.module.css"
import { Configuration } from "@/app/_interfaces"
import localizations from "@/app/_lib/localization"
import Image from "next/image"
import { FormEvent } from "react"

export default function Compose({
  configuration,
  composeValue,
  setComposeValue,
  isLoading,
  onResizeClick,
  onSubmitUserMessage,
  isMobile,
}: {
  configuration: Configuration
  composeValue: string
  setComposeValue: (value: string) => void
  isLoading: boolean
  onResizeClick: () => void
  onSubmitUserMessage: (event: FormEvent<HTMLFormElement>) => void
  isMobile: boolean
}) {
  return (
    <div className={styles.compose}>
      {!isMobile && (
        <button
          aria-label={localizations[configuration.lang].resize}
          className="small-btn"
          onClick={() => onResizeClick()}
        >
          <Image alt="" src="/images/chat/message/compose-resize.svg" width={24} height={24} priority={true} />
          {!isMobile && (
            <div className="tooltip" style={{ bottom: 25 }}>
              {localizations[configuration.lang].resize}
            </div>
          )}
        </button>
      )}
      <form style={{ display: "flex", gap: "8px", width: "100%" }} onSubmit={(event) => onSubmitUserMessage(event)}>
        <input
          type="text"
          name="Query Field"
          autoComplete="off"
          value={composeValue}
          onChange={(e) => setComposeValue(e.target.value)}
          placeholder={localizations[configuration.lang].inputPlaceholder}
          className={styles.input}
        />
        <button
          aria-label={localizations[configuration.lang].send}
          type="submit"
          disabled={isLoading || !composeValue}
          className="small-btn"
        >
          <Image alt="" src="/images/chat/message/compose-send.svg" width={28} height={28} priority={true} />
          {!isMobile && (
            <div className="tooltip" style={{ bottom: 40 }}>
              {localizations[configuration.lang].send}
            </div>
          )}
        </button>
      </form>
    </div>
  )
}
