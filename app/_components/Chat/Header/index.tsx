import styles from "./styles.module.css"
import { Configuration } from "@/app/_interfaces"
import localizations from "@/app/_lib/localization"
import Image from "next/image"

export default function Header({
  configuration,
  onClearButtonClick,
}: {
  configuration: Configuration
  onClearButtonClick: () => void
}) {
  return (
    <div className="askguru-header">
      <div className="askguru-ai-heading">
        {!configuration.whitelabel && (
          <Image alt="" src="/images/chat/header/askguru-logo.svg" height={18} width={18} />
        )}
        {configuration.windowHeading}
      </div>
      <div className="askguru-header-buttons">
        <button
          className="askguru-small-btn askguru-ai-clear"
          aria-label={localizations[configuration.lang].clear}
          onClick={() => onClearButtonClick()}
        >
          <Image alt="" src="/images/chat/header/refresh-icon.svg" height={18} width={18} />
          <div className={styles.tooltip}>{localizations[configuration.lang].clear}</div>
        </button>
        {/* <button className="askguru-small-btn askguru-ai-close" id="askguru-collapse" onClick={() => handleClose()}> */}
        {/*   <Image alt="" src="/images/chat/header/close-icon.svg" /> */}
        {/*   <div className="askguru-tooltip">Collapse</div> */}
        {/* </button> */}
      </div>
    </div>
  )
}
