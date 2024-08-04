import React from "react";
import styles from "@/styles/actionComponent/actionComponent.module.css";

export default function ActionComponent({
  setActiveBtnIndex,
  setIsActive,
  setComp,
}) {
  const handleSubmit = () => {
    setIsActive(true);
  };
  return (
    <div className={styles.bottom}>
      <button
        onClick={() => {
          setComp([]);
          setActiveBtnIndex((prev) => ({
            filter: "news_feed",
            index: 2,
          }));
        }}
        className={styles.cancel}
        type="reset"
      >
        Annuler
      </button>
      <button onClick={handleSubmit} className={styles.send} type="reset">
        Soumettre
      </button>
    </div>
  );
}
