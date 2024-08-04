"use client";

import React, { useRef, useState } from "react";
import styles from "@/styles/infoSection/infoSection.module.css";
import { CSSTransition } from "react-transition-group";
import { FaInfo } from "react-icons/fa6";

export default function InfoSection({ index }) {
  const ref = useRef();
  const [showDrop, setShowDrop] = useState(false);
  return (
    <section
      onClick={() => setShowDrop((a) => !a)}
      className={styles.container}
    >
      <FaInfo />
      <CSSTransition
        in={showDrop}
        timeout={350}
        classNames={"pcf"}
        unmountOnExit
        nodeRef={ref}
      >
        <div
          ref={ref}
          style={
            {
              // position: "relative",
            }
          }
        >
          <div className={styles.message}>
            {index === 2
              ? "Bienvenue dans le Fil d'Actualité ! Ici, vous pouvez voir les dernières nouvelles, découvrir des recherches intéressantes et publier vos propres actualités. Restez informé et partagez ce qui vous passionne."
              : "Bienvenue dans Mes Articles ! Cette section est dédiée à vos publications personnelles. Vous pouvez y retrouver tous les articles que vous avez écrits et qui concernent vos intérêts ou expériences spécifiques. Exprimez-vous librement et partagez vos idées avec le monde."}
          </div>
          <i className={styles.i} />
        </div>
      </CSSTransition>
    </section>
  );
}
