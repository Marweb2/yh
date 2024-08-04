import React from "react";
import styles from "@/styles/publication/publication.module.css";
import { FaFile } from "react-icons/fa";

export default function PublicationFileName({ attachmentName }) {
  //
  return (
    <div className={styles.publicationFileName}>
      <FaFile size="1rem" /> {attachmentName}
    </div>
  );
}
