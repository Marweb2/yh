import styles from "../styles/TopLoadingBar.module.css";

export default function TopLoadingBar({ width, visible }) {
  return (
    <div className={visible ? `${styles.tpl}` : `${styles.tpl} ${styles.inv}`}>
      <div
        className={styles.loadingBar}
        style={{ width: `${width || 0}%` }}
      ></div>
    </div>
  );
}
