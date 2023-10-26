import styles from "./styles.module.css"
import Image from "next/image"

export default function Footer() {
  return (
    <div className={styles.footer}>
      <a className={styles.footerContent} href="https://askguru.ai" target="_blank" rel="noopener noreferrer">
        Powered by
        <Image
          style={{ objectFit: "contain", marginLeft: "7px" }}
          alt="logo"
          src="/images/chat/footer/askguru-logo-full.svg"
          height={10}
          width={100}
          priority={true}
        />
      </a>
    </div>
  )
}
