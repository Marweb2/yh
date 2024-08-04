import React, { useState } from "react";
import styles from "@/styles/publication/publication.module.css";
import { CgClose } from "react-icons/cg";
import PublicationDropDown from "./PublicationDropDown";
import Image from "next/image";

export default function PublicationTop({
  user,
  dateTime,
  pubId,
  setHidden,
  index,
  setIsActive2,
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <section className={styles.publicationTop}>
      <div className={styles.publicationTopLeft}>
        <div className={styles.photo}>
          <Image
            style={{ borderRadius: "50%" }}
            alt="user photo"
            src={user?.image[0] ? user?.image[0] : "/default_avatar.jpg"}
            fill
          />
        </div>
        <div>
          <h4>
            {user?.username} {user?.name}
          </h4>
          <p>{user?.statutProfessionnelle}</p>
        </div>
      </div>
      <div className={styles.publicationTopRight}>
        <p className={styles.hours}>{dateTime}</p>
        <button className={styles.btn}>
          <CgClose
            onClick={() => {
              if (index === 2) {
                setIsActive((a) => !a);
              } else {
                setIsActive2(true);
              }
            }}
          />
          <PublicationDropDown
            setHidden={setHidden}
            pubId={pubId}
            isActive={isActive}
            setIsActive={setIsActive}
            user={user}
          />
        </button>
      </div>
    </section>
  );
}
