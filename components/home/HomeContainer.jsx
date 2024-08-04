"use client";
import useConfetti from "@/lib/hooks/useConfetti";
import usePopup from "@/lib/hooks/usePopup";
import { CgClose } from "react-icons/cg";
import { CSSTransition } from "react-transition-group";
import styles from "../../styles/home/HomeContainer.module.css";
import Confetti from "../Confetti";
import { useRef } from "react";

export default function HomeContainer() {
  const ref = useRef();
  const confetti = useConfetti();
  const popup = usePopup();

  return (
    <div className={styles.container}>
      {confetti.isActive && <Confetti />}
      {
        <CSSTransition
          nodeRef={ref}
          in={popup.isActive}
          timeout={500}
          classNames={"fc"}
          unmountOnExit
        >
          <div ref={ref} className={styles.chi}>
            <div className={`cont`}>
              <div className={`${styles.contenu} scr`}>
                <i onClick={popup.onDisable} className={styles.close}>
                  <CgClose size={"1.5rem"} />
                </i>
                <h1 className={styles.title}>Félicitations !</h1>
                <div className={styles.mess}>
                  <span>Votre compte est activé.</span>
                </div>
                <div className={styles.hr} />
                <div className={styles.ins}>
                  <span>Vous pouvez désormais utilisez nos services.</span>
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      }
    </div>
  );
}
