/** @format */

"use client";

// styles
import styles from "../../../styles/home/infohub/InfoHub.module.css";

// icons
import { TbBulb } from "react-icons/tb";
import { TfiEmail } from "react-icons/tfi";
import { GoBellFill } from "react-icons/go";
import { CiCircleList } from "react-icons/ci";

// components
import Avis from "../Avis";
import Message from "./Message";
import Questions from "./Questions";
import InfoProjet from "./InfoProjet";
import ClientOnly from "@/components/ClientOnly";
import { isEmpty } from "@/lib/utils/isEmpty";

// react
import { UidContext } from "@/context/UidContext";
import { useContext, useEffect, useState } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  fetchClientProjets,
  updateProjets,
} from "@/redux/slices/clientProjectSlice";

import {
  updateClientAvis,
  updateClientAvisInfos,
} from "@/redux/slices/clientAvisPotentielSlice";

import {
  getAssistantsProjectController,
  getProjetAssistant,
  getProjetController,
} from "@/lib/controllers/projet.controller";

// controllers
import { getAssistantProjectController } from "@/lib/controllers/projet.controller";
import { calculerNombrePages } from "@/lib/function";
import { usePathname } from "next/navigation";

export default function InfoHub({
  assistants,
  setAssistants,
  setIsInfos,
  setUserInfos,
  render,
  setRender,
  infosStatus,
  setInfosStatus,
}) {
  const { actualIndex, actualProjetId } = useSelector((state) => state.projets);
  const [firstRender, setFirstRender] = useState(true);
  const { setLoadingBar, userId, setIsActive, isActive } =
    useContext(UidContext);
  const {
    pageActuelle,
    userInfos,
    indexAvisSelectionee,
    renderAvis,
    next: nextAssistant,
    prev: prevAssistant,
  } = useSelector((state) => state.clientAvis);
  const { userType } = useSelector((state) => state.persistInfos);
  const {
    clientProjets,
    lastClientIndex,
    pageLength,
    currentPage,
    actualClientIndex,
    actualClientProjet,
    prev,
    next,
  } = useSelector((state) => state.clientProject);
  const {
    conversationAvis,
    actualConversationAvis,
    conversationAvisLength,
    conversationAvisIndex,
  } = useSelector((state) => state.conversationAvis);
  const { avis, actualAvis, index, length } = useSelector(
    (state) => state.rightAvis
  );
  const [isDeleted, setIsDeleted] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsDeleted(
      infosStatus === "middle" || infosStatus === "messageIcon"
        ? actualClientProjet?.deletedByClient
        : infosStatus === "rightFavourite" || infosStatus === "fav"
        ? actualAvis.projectId.deletedByClient
        : actualConversationAvis?.projectId?.deletedByClient
    );
  }, [isActive, actualClientProjet, actualAvis, actualConversationAvis]);

  // useEffect(() => {
  //   if (isDeleted) {
  //     setIsActive({ obj: "mes" });
  //   }
  // }, [isDeleted]);

  useEffect(() => {
    if (
      infosStatus === "conversationFavourite" ||
      infosStatus === "messageIcon" ||
      infosStatus === "fav" ||
      isDeleted
    ) {
      setIsActive({ obj: "mes" });
    } else {
      setIsActive({ obj: "infos" });
    }
  }, [infosStatus, isDeleted]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    setLoadingBar(80);
    if (userType === "client") {
      (async () => {
        const res = await getAssistantsProjectController({
          clientId: userId,
          projectId: actualProjetId,
          actualPage: pageActuelle,
          filter: "all",
        });

        if (res?.assistants) {
          dispatch(
            updateClientAvis({
              avis: res?.assistants,
            })
          );
          const avisParPage = 4;

          if (nextAssistant) {
            dispatch(
              updateClientAvisInfos({
                userInfos: res?.assistants[indexAvisSelectionee]?.assistantId,
                avisTaille: res?.assistantsLength,
                taillePage: calculerNombrePages(
                  res?.assistantsLength,
                  avisParPage
                ),
                lastIndex:
                  res?.assistantsLength % avisParPage === 0
                    ? 3
                    : (res?.assistantsLength % avisParPage) - 1,
                next: false,
              })
            );
          } else if (prevAssistant) {
            dispatch(
              updateClientAvisInfos({
                userInfos: res?.assistants[indexAvisSelectionee]?.assistantId,
                avisTaille: res?.assistantsLength,
                taillePage: calculerNombrePages(
                  res?.assistantsLength,
                  avisParPage
                ),
                lastIndex:
                  res?.assistantsLength % avisParPage === 0
                    ? 3
                    : (res?.assistantsLength % avisParPage) - 1,
                prev: false,
              })
            );
          }
          setLoadingBar(100);
          setIsFinish(true);
        }
      })();
    } else if (userType === "assistant") {
      async function fetchProjects() {
        // const projects = await fetch(
        //   `/api/assistant/${userId}?page=${currentPage}`
        // );
        const { avisClient, lastIndex, pageNumber } = await getProjetAssistant(
          userId,
          currentPage,
          "all"
        );
        // const { data, lastIndex, pageNumber } = await projects.json();
        dispatch(
          fetchClientProjets({
            clientProjets: avisClient,
          })
        );
        if (prev) {
          dispatch(
            fetchClientProjets({
              actualClientProjet: avisClient[actualClientIndex].projectId,
            })
          );
          dispatch(
            updateProjets({
              lastClientIndex: lastIndex,
              pageLength: pageNumber,
              prev: false,
            })
          );
        } else if (next) {
          dispatch(
            fetchClientProjets({
              actualClientProjet: avisClient[actualClientIndex]?.projectId,
            })
          );
          dispatch(
            updateProjets({
              lastClientIndex: lastIndex,
              pageLength: pageNumber,
              next: false,
            })
          );
          dispatch(
            updateClientAvisInfos({
              userInfos: avisClient[actualClientIndex]?.projectId?.clientId,
            })
          );
        }
      }
      fetchProjects();
    }
  }, [pageActuelle, currentPage, renderAvis]);

  const dispatch = useDispatch();

  const [assistantIndex, setAssistantIndex] = useState(null);

  const [isFinish, setIsFinish] = useState(false);

  useEffect(() => {
    setAssistantIndex(actualIndex);
  }, [actualIndex]);

  useEffect(() => {
    if (isFinish) {
      setLoadingBar(0);
      setIsFinish(false);
    }
  }, [isFinish]);

  console.log(actualConversationAvis?.projectId?.deletedByClient);

  return (
    <ClientOnly>
      <div className={styles.container}>
        {pathname !== "/mes-projets" && pathname !== "/mes-avis" && (
          <div className={styles.top}>
            {isDeleted === false ? (
              <div className={styles.menu}>
                <label
                  onClick={() => setIsActive({ obj: "infos" })}
                  className={
                    isActive.obj === "infos" ? `${styles.active} pen` : null
                  }
                >
                  <i>
                    <TbBulb size={"1.35rem"} />
                  </i>
                  <span className="usn">Infoprojet</span>
                </label>
                <label
                  onClick={() => setIsActive({ obj: "qs" })}
                  className={
                    isActive.obj === "qs" ? `${styles.active} pen` : null
                  }
                >
                  <i>
                    <CiCircleList size={"1.35rem"} />
                  </i>
                  <span className="usn">Questions</span>
                </label>

                {(infosStatus === "middle" ||
                  infosStatus === "messageIcon") && (
                  <label
                    onClick={() => setIsActive({ obj: "avis" })}
                    className={
                      isActive.obj === "avis" ? `${styles.active} pen` : null
                    }
                  >
                    <i>
                      <GoBellFill size={"1.25rem"} />
                    </i>
                    <span className="usn">Avis Potentiels</span>
                  </label>
                )}
                <label
                  onClick={() => setIsActive({ obj: "mes" })}
                  className={
                    isActive.obj === "mes"
                      ? `${styles.active} mobileVersion pen`
                      : "mobileVersion"
                  }
                >
                  <i>
                    <TfiEmail size={"1.2rem"} />
                  </i>
                  <span className="usn">Messagerie</span>
                </label>
              </div>
            ) : (
              <div
                style={{
                  justifyContent: "center",
                }}
                className={styles.menu}
              >
                <label
                  className={
                    isActive.obj === "mes"
                      ? `${styles.active} mobileVersion pen`
                      : "mobileVersion"
                  }
                >
                  <i>
                    <TfiEmail size={"1.2rem"} />
                  </i>
                  <span className="usn">Messagerie</span>
                </label>
              </div>
            )}
          </div>
        )}
        {isActive.obj !== "mes" ? (
          <div className={styles.mid}>
            {isActive.obj === "infos" && (
              <InfoProjet
                assistantIndex={assistantIndex}
                setAssistantIndex={setAssistantIndex}
                setUserInfos={setUserInfos}
                assistants={assistants}
                setRender={setRender}
                render={render}
                setIsInfos={setIsInfos}
                infosStatus={infosStatus}
              />
            )}
            {isActive.obj === "qs" && (
              <Questions
                assistantIndex={assistantIndex}
                setAssistantIndex={setAssistantIndex}
                userInfos={userInfos}
                infosStatus={infosStatus}
              />
            )}
            {isActive.obj === "avis" &&
              (infosStatus === "middle" || infosStatus === "messageIcon") && (
                <Avis
                  assistants={assistants}
                  setAssistants={setAssistants}
                  setIsInfos={setIsInfos}
                  userInfos={userInfos}
                  setUserInfos={setUserInfos}
                  setInfosStatus={setInfosStatus}
                />
              )}
          </div>
        ) : (
          <div className={styles.mes}>
            <Message
              assistantIndex={assistantIndex}
              setAssistantIndex={setAssistantIndex}
              assistants={assistants}
              setRender={setRender}
              render={render}
              infosStatus={infosStatus}
            />
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
