/** @format */

import WaveSurfer from "wavesurfer.js";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
function generateRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => ("0" + byte.toString(16)).slice(-2)).join(
    ""
  );
}
export default function RightVoiceMessage({ record }) {
  const cont = useRef();
  const b = useRef();
  const c = useRef(false);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    if (cont.current && c.current === false) {
      b.current = WaveSurfer.create({
        container: cont.current,
        waveColor: "#b9b9b9",
        progressColor: "#fff",
        backend: "MediaElement",
        responsive: true,
        width: 50,
        height: 40,
        cursorColor: "#fff",
        cursorWidth: 1,
        barWidth: 3,
        barRadius: 2,
        barHeight: 8,
        // fillParent: false,
      });

      c.current = true;

      b.current.load(record);
      b.current.on("ready", () => {
        // b.current.play();
        setLoad((a) => a + 1);
      });
      b.current.on("finish", () => {
        setIsPlaying(false);
      });
    }
  }, [cont.current]);
  const [isPlaying, setIsPlaying] = useState(false);

  const id = generateRandomString(10);
  useEffect(() => {
    const container = document.getElementById(id);
    const wave = container.firstElementChild;

    wave.style.width = "100%";
    wave.style.overflow = "hidden";
  }, [load]);

  return (
    <div
      style={{
        backgroundColor: "#036eff",
        width: "50%",
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px",
        height: "50px",
        // overflow: "hidden",
      }}
    >
      <div
        id={id}
        style={{
          //   backgroundColor: "#d9d9d9",
          width: "100%",
          borderRadius: "50px",
          // height: "50px",
          overflow: "hidden",
        }}
        ref={cont}
      ></div>
      <i
        onClick={() => {
          if (!isPlaying) {
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
          b.current.playPause();
        }}
        style={{
          backgroundColor: "none",
          cursor: "pointer",
        }}
      >
        {!isPlaying ? <FaPlay color="#fff" /> : <FaPause color="#fff" />}
      </i>
    </div>
  );
}
