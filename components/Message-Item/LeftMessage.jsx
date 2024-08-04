/** @format */
import {
  BiDotsVerticalRounded,
  BiSolidLeftArrow,
  BiSolidRightArrow,
} from "react-icons/bi";
import { useState } from "react";
import styles from "@/styles/home/infohub/Message.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";

const LeftVoiceMessage = dynamic(
  () => import("@/components/Audio/LeftVoiceMessage"),
  {
    ssr: false,
  }
);

export default function LeftMessage({ message, time, contentType, _id, date }) {
  const handleDownload = () => {
    const a = document.createElement("a");
    const b = document.getElementById("file");
    a.href = `api/download?message=${_id}`;
    b.appendChild(a);
    a.click();
    b.removeChild(a);
  };
  const [isVisible, setIsVisible] = useState({ obj: false });
  const [showHours, setShowHours] = useState(true);

  return (
    <div>
      {contentType === "text" ? (
        <label className={styles.mxt}>{message}</label>
      ) : contentType === "record" ? (
        <LeftVoiceMessage record={message} />
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
            style={{
              borderRadius: "5px",
            }}
            src={message}
            width={140}
            height={140}
            layout="responsive"
          />
        </div>
      ) : (
        <label
          id="file"
          onClick={handleDownload}
          style={{
            textDecoration: "underline",
            cursor: "pointer",
          }}
          className={styles.mxt}
        >
          {message}
        </label>
      )}
      <p>
        {showHours && <span>{date ? date : time}</span>}
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
            </div>
          )}
        </i>
      </p>
    </div>
  );
}
