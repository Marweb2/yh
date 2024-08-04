/** @format */
import {
  BiDotsVerticalRounded,
  BiSolidLeftArrow,
  BiSolidRightArrow,
} from "react-icons/bi";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "@/styles/home/infohub/Message.module.css";
// import RightVoiceMessage from "../Audio/RightVoiceMessage";
import { useSelector } from "react-redux";
import Image from "next/image";
const addZero = (num) => {
  return num < 10 ? "0" + num : num;
};

const RightVoiceMessage = dynamic(
  () => import("@/components/Audio/RightVoiceMessage"),
  {
    ssr: false,
  }
);

export default function RightMessage({
  message,
  time,
  contentType,
  _id,
  date,
}) {
  const [isVisible, setIsVisible] = useState({ obj: false });
  const { io } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.user);
  const { userInfos } = useSelector((state) => state.clientAvis);
  const [showHours, setShowHours] = useState(true);

  const handleDownload = () => {
    const a = document.createElement("a");
    const b = document.getElementById("file");
    a.href = `api/download?message=${_id}`;
    b.appendChild(a);
    a.click();
    b.removeChild(a);
  };

  const handleDelete = () => {
    io.emit("deletedMessage", {
      messageId: _id,
      by: user._id,
      to: userInfos._id,
    });
  };

  return (
    <div className={`${styles.own}`}>
      <p>
        <i
          onClick={() =>
            setIsVisible((prev) => ({
              obj: !prev.obj,
            }))
          }
        >
          <BiDotsVerticalRounded size={"1.25rem"} />
          {isVisible.obj && (
            <div className={styles.bdg}>
              <label onClick={() => setShowHours((a) => !a)} className="usn">
                {showHours ? "Masquer l'heure" : "Afficher l'heure"}
              </label>
              <label onClick={handleDelete} className="usn">
                Supprimer le message
              </label>
            </div>
          )}
        </i>
        {showHours && (
          <span> {showHours && <span>{date ? date : time}</span>}</span>
        )}
      </p>
      {contentType === "text" ? (
        <label className={styles.mxt}>{message}</label>
      ) : contentType === "record" ? (
        // <div style={{ width: "20%" }}>
        <RightVoiceMessage record={message} />
      ) : contentType === "image" ? (
        // </div>
        <div
          style={{
            width: "160px",
            position: "relative",
          }}
        >
          <Image
            alt="image"
            src={message}
            style={{
              borderRadius: "5px",
            }}
            width={140}
            height={140}
            layout="responsive"
          />
        </div>
      ) : (
        <label
          onClick={handleDownload}
          style={{
            textDecoration: "underline",
            cursor: "pointer",
          }}
          className={styles.mxt}
          id="file"
        >
          {message}
        </label>
      )}
    </div>
  );
}
