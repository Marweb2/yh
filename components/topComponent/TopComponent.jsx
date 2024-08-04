import React from "react";
import { HiPencilAlt } from "react-icons/hi";
import styles from "@/styles/infohub/TopComponent.module.css";

export default function TopComponent() {
  return (
    <div className={styles.tmp}>
      <div className="mes-projets--title">
        <span>
          <HiPencilAlt size={"1.4rem"} />
        </span>
        <label style={{ color: "#036eff" }}>FILTRE FIL D&apos;ACTUALITE</label>
      </div>
      <div
        style={{
          width: "100%",
          height: "2px",
          background: "var(--blue)",
          position: "absolute",
          bottom: 0,
        }}
      ></div>
    </div>
  );
}
