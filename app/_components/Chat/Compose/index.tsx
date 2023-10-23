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
}: {
  configuration: Configuration
  composeValue: string
  setComposeValue: (value: string) => void
  isLoading: boolean
  onResizeClick: () => void
  onSubmitUserMessage: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <div className="askguru-compose">
      <button
        aria-label={localizations[configuration.lang].resize}
        className="askguru-resize"
        id="askguru-resize"
        onClick={() => onResizeClick()}
      >
        <Image alt="" src="/images/chat/message/compose-resize.svg" width={18} height={18} />
        <div className="askguru-tooltip-top">{localizations[configuration.lang].resize}</div>
      </button>
      <form style={{ display: "flex", gap: "8px", width: "100%" }} onSubmit={(event) => onSubmitUserMessage(event)}>
        <input
          type="text"
          value={composeValue}
          onChange={(e) => setComposeValue(e.target.value)}
          placeholder={localizations[configuration.lang].inputPlaceholder}
        ></input>
        <button
          aria-label={localizations[configuration.lang].send}
          type="submit"
          disabled={isLoading}
          className="askguru-submit-btn"
        >
          <div className="askguru-tooltip-top">{localizations[configuration.lang].send}</div>
          <Image alt="" src="/images/chat/message/compose-send.svg" width={18} height={18} />
        </button>
      </form>
    </div>
  )
}
