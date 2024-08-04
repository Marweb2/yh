import React, { useRef, useState, useContext, useEffect } from "react";
import styles from "@/styles/publication/publication.module.css";
import { CSSTransition } from "react-transition-group";
import { UidContext } from "@/context/UidContext";
import { hidePub, unfollowUser } from "@/lib/controllers/projet.controller";
import { FaEraser } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

export default function PublicationDropDown({
  isActive,
  pubId,
  setHidden,
  user,
  setIsActive,
}) {
  const ref = useRef();
  const { userId } = useContext(UidContext);

  const action = async () => {
    const data = await hidePub(userId, pubId);
    if (data.hidden) {
      setHidden(true);
    }
  };

  const unfollow = async () => {
    const data = await unfollowUser(userId, user._id);
    if (data.unfollowed) {
      setHidden(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive]);

  return (
    <CSSTransition
      in={isActive}
      timeout={350}
      classNames={"pcf"}
      unmountOnExit
      nodeRef={ref}
    >
      <section ref={ref} className={styles.dropContainer}>
        <i className={styles.tri} />
        <div className={styles.item}>
          <div className={styles.icon}>
            <FaEraser />
          </div>
          <div onClick={action} className={styles.text}>
            <h6>Masquer temporairement cette publication</h6>
            <p>Je ne souhaite pas voir cette publication</p>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.icon}>
            <MdDeleteForever />
          </div>
          <div onClick={unfollow} className={styles.text}>
            <h6>Ne plus suivre</h6>
            <p>
              Je ne souhaite plus voir les publications de {user?.username}{" "}
              {user?.name}
            </p>
          </div>
        </div>
      </section>
    </CSSTransition>
  );
}
