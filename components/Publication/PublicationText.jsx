import React from "react";
import styles from "@/styles/publication/publication.module.css";

export default function PublicationText({ title, description }) {
  return (
    <div className={styles.publicationText}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
