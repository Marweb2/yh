/** @format */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactDOM from "react-dom/client";
import { AudioRecorder } from "react-audio-voice-recorder";
import WaveSurfer from "wavesurfer.js";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
} from "@/redux/slices/popUpSlice";
import style from "@/styles/projet/Projet.module.css";

export default function Audio({ setVoiceMessage, avisId, setPopUp }) {
  //   useEffect(() => {
  //     const a = document.getElementsByClassName("audio-recorder-mic")[0];
  //     console.log(a);
  //   }, []);

  const dispatch = useDispatch();

  const cont = useRef();
  const b = useRef();
  const c = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [src, setSrc] = useState(false);

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const reader = new FileReader();
    // Événement déclenché lorsque la lecture du fichier est terminée

    reader.onload = function (event) {
      const base64String = event.target.result;
      dispatch(
        updatePopUpStatut({
          popUpStatut: "record",
          data: base64String,
          avisId,
        })
      );
    };
    reader.readAsDataURL(blob); // Lit le fichier et le convertit en base64

    // const audio = document.createElement("audio");
    // audio.src = url;
    // audio.controls = true;
    // document.body.appendChild(audio);
    // setPopUp(true);

    dispatch(
      updateIsActive({
        isActive: true,
      })
    );
    setVoiceMessage(false);
  };

  //   const wavesurfer = WaveSurfer.create({
  //     container: "body",
  //     waveColor: "rgb(200, 0, 200)",
  //     progressColor: "rgb(100, 0, 100)",
  //     url: "/audio.webm",
  //   });

  useEffect(() => {
    if (cont.current && c.current === false) {
      b.current = WaveSurfer.create({
        container: cont.current,
        waveColor: "#b9b9b9",
        progressColor: "#036eff",
        backend: "MediaElement",
        responsive: true,
        width: "50px",
        height: 40,
        cursorColor: "#036eff",
        cursorWidth: 1,
        barWidth: 3,
        barRadius: 2,
        barHeight: 8,
        // fillParent: false,
      });

      c.current = true;

      b.current.load(src);
      b.current.on("ready", () => {
        // b.current.play();
      });
      b.current.on("finish", () => {
        setIsPlaying(false);
      });
    }
  }, [cont.current, src]);
  // wavesurfer.on("click", () => {
  //   console.log("salut");
  //   wavesurfer.play();
  // });
  //   wavesurfer.on("ready", function () {
  //     console.log("salut");
  //     wavesurfer.play();
  //   });

  // useEffect(() => {
  //   const img = document.getElementsByTagName("img");

  //   img[img.length - 1].addEventListener("click", () => {
  //     setVoiceMessage(false);
  //   });
  // });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        saveRecordingLabel="Sauvegarder"
        discardRecordingLabel="Annuler"
        stopRecordingLabel="Arrêter l'enregistrement"
        startRecordingLabel="Commencer l'enregistrement"
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={false}
        downloadFileExtension="webm"
        showVisualizer={true}
      />
      {/* {src && (
        <div
          style={{
            backgroundColor: "#d9d9d9",
            width: "20%",
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
            id="waveform"
            style={{
              backgroundColor: "#d9d9d9",
              width: "100%",
              borderRadius: "50px",
              // height: "50px",
              // overflow: "hidden",
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
            {!isPlaying ? (
              <FaPlay color="#036eff" />
            ) : (
              <FaPause color="#036eff" />
            )}
          </i>
        </div>
      )} */}
    </div>
  );
}
