/** @format */

import style from "@/styles/projet/Projet.module.css";
import { CSSTransition } from "react-transition-group";
import { CgClose } from "react-icons/cg";
import { useRef, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateIsActive,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
  updatePopUpStatut,
} from "@/redux/slices/popUpSlice";

import dynamic from "next/dynamic";
import Image from "next/image";
import { UidContext } from "@/context/UidContext";
import {
  deleteConversation,
  sendAssistantResponses,
} from "@/lib/controllers/projet.controller";
import { updateAssistantReponses } from "@/redux/slices/questionResponsesSlice";

const Record = dynamic(() => import("@/components/Audio/RightVoiceMessage"), {
  ssr: false,
});

export default function PopUp({ infosStatus, setRender }) {
  const {
    isActive,
    popUpStatut,
    data,
    avisId,
    name,
    deleteFavouriteAssistant,
    projectId,
    deleteAvisAssistant,
  } = useSelector((state) => state.popUp);
  const { actualProject } = useSelector((state) => state.projets);
  const { userType } = useSelector((state) => state.persistInfos);
  const { actualClientProjet } = useSelector((state) => state.clientProject);
  const { body, assistantId } = useSelector(
    (state) => state.assistantResponses
  );
  const {
    avis,
    pageActuelle,
    indexAvisSelectionee,
    userInfos,
    taillePage,
    lastIndex,
  } = useSelector((state) => state.clientAvis);
  const dispatch = useDispatch();
  const { io } = useSelector((state) => state.socket);
  const { setLoadingBar, userId } = useContext(UidContext);
  const {
    conversationAvis,
    actualConversationAvis,
    conversationAvisLength,
    conversationAvisIndex,
  } = useSelector((state) => state.conversationAvis);
  const { actualAvis } = useSelector((state) => state.rightAvis);
  const [client, setClient] = useState();
  const [projectAssistant, setProjectAssistant] = useState();

  useEffect(() => {
    setClient(
      infosStatus === "middle"
        ? actualClientProjet?.clientId?._id
        : infosStatus === "rightFavourite"
        ? actualAvis?.projectId?.clientId?._id
        : actualConversationAvis?.projectId?.clientId?._id
    );
    setProjectAssistant(
      infosStatus === "middle"
        ? actualClientProjet?._id
        : infosStatus === "rightFavourite"
        ? actualAvis?.projectId._id
        : actualConversationAvis?.projectId?._id
    );
  }, [
    client,
    projectAssistant,
    actualClientProjet,
    actualAvis,
    actualConversationAvis,
  ]);

  const isPopup = "default";
  const ref = useRef();
  return (
    <CSSTransition
      in={isActive}
      timeout={350}
      classNames={"pcf"}
      unmountOnExit
      nodeRef={ref}
    >
      <div ref={ref} className={style.popupContainer}>
        <div className={`${style.popupMsg} cft`}>
          <div className={style.popupClose}>
            <i
              onClick={() => {
                dispatch(
                  updateIsActive({
                    isActive: false,
                  })
                );
              }}
            >
              <CgClose />
            </i>
          </div>
          <div className={style.hr} />
          {popUpStatut === "favoris" ? (
            <div className={style.popupMiddle}>
              <div className={style.popupContenu}>
                <p>
                  Voulez-vous vraiment supprimer ce(tte){" "}
                  {userType === "client" ? "assistant(e)" : "client(e)"} des
                  favori(te)s?
                </p>
              </div>
              <div className={style.popupButton}>
                <button
                  style={{
                    background: "#badf5b",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      updateDeleteFavouriteAssistant({
                        accept: true,
                      })
                    );
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          ) : popUpStatut === "avis" ? (
            <div className={style.popupMiddle}>
              <div className={style.popupContenu}>
                <p>
                  {infosStatus === "middle"
                    ? "VOULEZ-VOUS VRAIMENT SUPPRIMER CET AVIS "
                    : userType === "client"
                    ? `VOULEZ-VOUS VRAIMENT SUPPRIMER CET(TE) ASSISTANT(E)
                      DES AVIS POTENTIELS ?`
                    : "VOULEZ-VOUS VRAIMENT SUPPRIMER CE PROJET DES AVIS POTENTIELS ?"}
                </p>
              </div>
              <div className={`${style.popupButton} ${style.bgRed}`}>
                <button
                  style={{
                    background: "#badf5b",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      updateDeleteAvisAssistant({
                        accept: true,
                      })
                    );
                  }}
                >
                  OUI
                </button>
              </div>
            </div>
          ) : popUpStatut === "record" ? (
            <div className={style.popupMiddle}>
              <div className={style.popupContenu}>
                <Record record={data} />
              </div>
              <div className={`${style.popupButton}`}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (userType === "client") {
                      io.emit("sendMessage", {
                        client: userId,
                        assistant: userInfos._id,
                        content: data,
                        sender: "client",
                        projectId: actualProject._id,
                        avisId,
                        contentType: "record",
                      });
                    } else {
                      io.emit("sendMessage", {
                        assistant: userId,
                        client: client,
                        content: data,
                        sender: "assistant",
                        projectId: projectAssistant,
                        avisId,
                        contentType: "record",
                      });
                    }

                    dispatch(
                      updatePopUpStatut({
                        popUpStatut: "",
                        data: "",
                        avisId: "",
                      })
                    );
                    dispatch(
                      updateIsActive({
                        isActive: false,
                      })
                    );
                  }}
                >
                  Envoyer
                </button>
              </div>
            </div>
          ) : popUpStatut === "image" ? (
            <div className={style.popupMiddle}>
              <div
                style={{
                  display: "flex",
                }}
                className={style.popupContenu}
              >
                <Image alt="upload" width={80} height={80} src={data} />
              </div>
              <div className={`${style.popupButton}`}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (userType === "client") {
                      io.emit("sendMessage", {
                        client: userId,
                        assistant: userInfos._id,
                        content: data,
                        sender: "client",
                        projectId: actualProject._id,
                        avisId,
                        contentType: "image",
                      });
                    } else {
                      io.emit("sendMessage", {
                        assistant: userId,
                        client: client,
                        content: data,
                        sender: "assistant",
                        projectId: projectAssistant,
                        avisId,
                        contentType: "image",
                      });
                    }
                    dispatch(
                      updatePopUpStatut({
                        popUpStatut: "",
                        data: "",
                        avisId: "",
                      })
                    );
                    dispatch(
                      updateIsActive({
                        isActive: false,
                      })
                    );
                  }}
                >
                  Envoyer
                </button>
              </div>
            </div>
          ) : popUpStatut === "doc" ? (
            <div className={style.popupMiddle}>
              <div
                style={{
                  display: "flex",
                }}
                className={style.popupContenu}
              >
                Voulez-vous envoyer le fichier {name} ?
              </div>
              <div className={`${style.popupButton}`}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (userType === "client") {
                      io.emit("sendMessage", {
                        client: userId,
                        assistant: userInfos._id,
                        content: name,
                        sender: "client",
                        projectId: actualProject._id,
                        avisId,
                        contentType: "document",
                        document: data,
                      });
                    } else {
                      io.emit("sendMessage", {
                        assistant: userId,
                        client: client,
                        content: name,
                        sender: "assistant",
                        projectId: projectAssistant,
                        avisId,
                        contentType: "document",
                        document: data,
                      });
                    }
                    dispatch(
                      updatePopUpStatut({
                        popUpStatut: "",
                        data: "",
                        avisId: "",
                      })
                    );
                    dispatch(
                      updateIsActive({
                        isActive: false,
                      })
                    );
                  }}
                >
                  Envoyer
                </button>
              </div>
            </div>
          ) : popUpStatut === "questionResponses" ? (
            <div className={style.popupMiddle}>
              <div
                style={{
                  display: "flex",
                }}
                className={style.popupContenu}
              >
                Êtes-vous sûr(e) de vouloir envoyer vos réponses ?
              </div>
              <div className={`${style.popupButton}`}>
                <button
                  style={{
                    background: "#badf5b",
                  }}
                  onClick={(e) => {
                    async function sendResponse() {
                      const data = await sendAssistantResponses(
                        assistantId,
                        body
                      );
                      if (data.created) {
                        updateAssistantReponses({ isResponsesSent: true });
                      }
                    }

                    sendResponse();

                    dispatch(
                      updatePopUpStatut({
                        popUpStatut: "",
                        data: "",
                        avisId: "",
                      })
                    );
                    dispatch(
                      updateIsActive({
                        isActive: false,
                      })
                    );
                    dispatch(
                      updateAssistantReponses({
                        isResponsesSent: true,
                      })
                    );
                    setRender((a) => a + 1);
                    e.preventDefault();
                  }}
                >
                  OUI
                </button>
              </div>
            </div>
          ) : (
            <div className={style.popupMiddle}>
              <div
                style={{
                  display: "flex",
                }}
                className={style.popupContenu}
              >
                voulez-vous supprimer cette conversation de la boite de
                réception ?
              </div>
              <div className={`${style.popupButton}`}>
                <button
                  style={{
                    background: "#badf5b",
                  }}
                  onClick={(e) => {
                    async function deleteConv() {
                      await deleteConversation(userId, userType, avisId);
                    }

                    deleteConv();
                    dispatch(
                      updatePopUpStatut({
                        popUpStatut: "",
                        data: "",
                        avisId: "",
                      })
                    );
                    dispatch(
                      updateIsActive({
                        isActive: false,
                      })
                    );
                    setRender((a) => a + 1);
                    e.preventDefault();
                  }}
                >
                  OUI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CSSTransition>
  );
}
