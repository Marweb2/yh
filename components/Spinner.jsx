"use client";
import styles from "../styles/Spinner.module.css";
export default function Spinner({ sans }) {
  return (
    <div className={sans ? `${styles.l} ${styles.sans}` : `${styles.l}`}>
      <div className={styles.i}>
        <div />
      </div>
    </div>
  );
}
