import styles from "./styles.module.css"

export default function TripleDots() {
  return (
    <div className={styles.progress}>
      <div className={`${styles.progressDot}`}></div>
      <div className={`${styles.progressDot} ${styles.progressDotTwo}`}></div>
      <div className={`${styles.progressDot} ${styles.progressDotThree}`}></div>
    </div>
  )
}
