"use client";
import { useState } from "react";
import styles from "../../styles/auth/Btn.module.css";
import ClientOnly from "../ClientOnly";
export default function Btn({
  setUserType,
  userType,
  isHovered,
  setIsHovered,
}) {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: 50 });

  const handleMouseMove = (e, obj) => {
    const pos = document.getElementById(obj).getBoundingClientRect();
    const width = pos.width;
    const heigth = pos.height;
    const x = pos.x;
    const y = pos.y;
    if (
      e.clientX <= x + width &&
      e.clientX >= x - width &&
      e.clientY <= y + heigth &&
      e.clientY >= y - heigth
    ) {
      setMousePosition({
        x: (e.clientX - x - width * 1.3) / 2,
        y: (e.clientY - y + heigth) * 2.25,
      });
    }
  };

  return (
    <ClientOnly>
      <div className={styles.container}>
        <div className={styles.btn}>
          <div
            id="assistant"
            className={
              userType.value === "assistant" ? `${styles.active}` : null
            }
            onClick={(e) => {
              e.preventDefault();
              setUserType({
                value: "assistant",
                submit: false,
              });
            }}
            onMouseEnter={() => {
              setIsHovered({ obj: "assistant", value: true });
            }}
            onMouseMove={(e) => {
              if (isHovered.value && isHovered.obj === "assistant") {
                handleMouseMove(e, "assistant");
              }
            }}
            onMouseLeave={(e) => {
              e.preventDefault();
              setIsHovered({ obj: "", value: false });
            }}
          >
            <input placeholder={"Assistant"} readOnly className={styles.btc} />
            {isHovered.obj === "assistant" && isHovered.value && (
              <div
                className={styles.assistantDef}
                style={{
                  position: "absolute",
                  left: isHovered.value
                    ? `${mousePosition.x}%`
                    : `${mousePosition.x}px`,
                  top: isHovered.value
                    ? `${mousePosition.y}%`
                    : `${mousePosition.y}px`,
                }}
              >
                Assistants virtuels, travailleurs autonomes/Freelancer ou
                étudiants souhaitant rentabiliser leur temps libre et travailler
                sur différents projets selon ses compétences
              </div>
            )}
          </div>
          <div
            id="client"
            className={userType.value === "client" ? `${styles.active}` : null}
            onClick={(e) => {
              e.preventDefault();
              setUserType({
                value: "client",
                submit: false,
              });
            }}
            onMouseEnter={() => {
              setIsHovered({ obj: "client", value: true });
            }}
            onMouseMove={(e) => {
              if (isHovered.obj === "client" && isHovered.value) {
                handleMouseMove(e, "client");
              }
            }}
            onMouseLeave={(e) => {
              e.preventDefault();
              setIsHovered({ obj: "", value: false });
            }}
          >
            <input placeholder={"Client"} readOnly className={styles.btc} />

            {isHovered.obj === "client" && isHovered.value && (
              <div
                className={styles.clientDef}
                style={{
                  position: "absolute",
                  left: isHovered.value
                    ? `${mousePosition.x}%`
                    : `${mousePosition.x}px`,
                  top: isHovered.value
                    ? `${mousePosition.y}%`
                    : `${mousePosition.y}px`,
                }}
              >
                Entrepreneurs ambitieux et débordés avec des projets plein la
                tête, qui souhaitent déléguer des tâches.
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
