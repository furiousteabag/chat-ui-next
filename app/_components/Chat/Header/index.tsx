import styles from "./styles.module.css"
import { Configuration } from "@/app/_interfaces"
import localizations from "@/app/_lib/localization"
import Image from "next/image"

export default function Header({
  configuration,
  onClearButtonClick,
  isMobile,
  onCollapseButtonClick,
}: {
  configuration: Configuration
  onClearButtonClick: () => void
  isMobile: boolean
  onCollapseButtonClick: () => void
}) {
  return (
    <div className={styles.header}>
      <div className={styles.heading}>
        {!configuration.whitelabel && (
          <Image
            alt=""
            src="/images/chat/header/askguru-logo.svg"
            height={36}
            width={36}
            style={{ objectFit: "contain" }}
            priority={true}
          />
        )}
        {configuration.windowHeading}
      </div>
      <div className={styles.buttons}>
        <button
          className={`small-btn`}
          onClick={() => onClearButtonClick()}
          aria-label={localizations[configuration.lang].clear}
        >
          <Image alt="" src="/images/chat/header/refresh-icon.svg" height={18} width={18} priority={true} />
          {!isMobile && <div className="tooltip">{localizations[configuration.lang].clear}</div>}
        </button>
        {isMobile && (
          <button
            className={`small-btn`}
            onClick={() => onCollapseButtonClick()}
            aria-label={localizations[configuration.lang].collapse}
          >
            <Image alt="" src="/images/chat/header/close-icon.svg" height={18} width={18} priority={true} />
            {/* <div className="tooltip">{localizations[configuration.lang].collapse}</div> */}
          </button>
        )}
      </div>
    </div>
  )
}
