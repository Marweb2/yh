"use client";

import React from "react";
import styles from "@/styles/publicationCreatorComponent/publicationCreator.module.css";
import { useSelector } from "react-redux";
import Image from "next/image";

export default function PublicationCreatorComponent({ setIsActive }) {
  const { user } = useSelector((state) => state.user);

  return (
    <section className={styles.container}>
      <div className={styles.profil}>
        <Image
          src={user.image[0] ? user.image[0] : "/default_avatar.jpg"}
          fill
          style={{ borderRadius: "50%" }}
        />
      </div>
      <div onClick={() => setIsActive(true)} className={styles.fakeInput}>
        Que souhaitez-vous exprimer?
      </div>
    </section>
  );
}
