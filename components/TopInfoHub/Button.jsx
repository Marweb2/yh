import React from "react";
import styles from "@/styles/topInfoHub/topInfoHub.module.css";

export const filters = ["", "my_articles", "news_feed"];

export default function Button({
  name,
  activeBtnIndex,
  setActiveBtnIndex,
  index,
  icon,
  setPublication,
}) {
  return (
    <button
      onClick={() => {
        setActiveBtnIndex((prev) => ({
          filter: filters[index],
          index,
        }));
        setPublication([]);
      }}
      className={activeBtnIndex.index === index ? styles.active : styles.btn}
    >
      {icon}
      {name}
    </button>
  );
}
