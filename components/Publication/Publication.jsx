import React, { useRef, useState, useContext } from "react";
import styles from "@/styles/publication/publication.module.css";
import PublicationTop from "./PublicationTop";
import PublicationText from "./PublicationText";
import PublicationImage from "./PublicationImage";
// import PublicationFileName from "./publicationFileName";
import { CSSTransition } from "react-transition-group";
import style from "@/styles/projet/Projet.module.css";
import { CgClose } from "react-icons/cg";
import { FaFile } from "react-icons/fa";
import { deletePub } from "@/lib/controllers/projet.controller";
import { UidContext } from "@/context/UidContext";

export default function Publication({
  title,
  description,
  user,
  dateTime,
  attachment,
  attachmentType,
  attachmentName,
  _id,
  index,
}) {
  const [hidden, setHidden] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const { userId } = useContext(UidContext);
  const ref = useRef();

  const action = async () => {
    const data = await deletePub(userId, _id);
    if (data.deleted) {
      setHidden(true);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = `api/download/file?publication=${_id}`;
    a.download = attachmentName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    !hidden && (
      <div className={styles.container}>
        <CSSTransition
          in={isActive2}
          timeout={350}
          classNames={"pcf"}
          unmountOnExit
          nodeRef={ref}
        >
          <div ref={ref} className={style.popupContainer}>
            <div className={`${style.popupMsg} cft`}>
              <div className={style.popupClose}>
                <i onClick={() => setIsActive2(false)}>
                  <CgClose />
                </i>
              </div>
              <div className={style.hr} />
              <div className={style.popupMiddle}>
                <div className={style.popupContenu}>
                  <p>Souhaitez-vous supprimer cette publication ?</p>
                </div>
                <div className={style.popupButton}>
                  <button
                    style={{
                      background: "#badf5b",
                    }}
                    onClick={action}
                  >
                    OUI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
        <PublicationTop
          setHidden={setHidden}
          pubId={_id}
          dateTime={dateTime}
          user={user}
          index={index}
          setIsActive2={setIsActive2}
        />
        <PublicationText title={title} description={description} />
        {attachmentType === "image" ? (
          <PublicationImage src={attachment} />
        ) : (
          attachmentType === "document" && (
            // <PublicationFileName attachmentName={attachmentName} />
            <div
              onClick={handleDownload}
              className={styles.publicationFileName}
            >
              <FaFile size="1rem" /> {attachmentName}
            </div>
          )
        )}
      </div>
    )
  );
}
