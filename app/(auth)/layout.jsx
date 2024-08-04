/** @format */

import Image from "next/image";
import styles from "./AuthLayout.module.css";
export default function AuthLayout({ children }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.left}>
            <div className={styles.contImg}>
              <Image
                alt=""
                src={"/logo.svg"}
                priority={true}
                width={550}
                height={150}
                className={styles.img}
              />
            </div>
            <div className={styles.line}>
              <span />
              <span />
            </div>
            <div className={styles.slogan}>
              Soyez ambitieux avec vos compétences!
            </div>
          </div>
          <div className={styles.right}>{children}</div>
        </div>
      </div>
    </>
  );
}
