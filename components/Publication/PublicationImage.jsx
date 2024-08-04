import React from "react";
import styles from "@/styles/publication/publication.module.css";
import Image from "next/image";

export default function PublicationImage({ src }) {
  return (
    <div className={styles.PublicationImage}>
      <Image src={src} alt="publication image" fill />
    </div>
  );
}
