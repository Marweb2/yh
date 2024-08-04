/** @format */

"use client";

// styles
import styles from "../../styles/home/MenuProjet.module.css";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";

import { useDispatch, useSelector } from "react-redux";

import ClientOnly from "../ClientOnly";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
import {
  setActualProject,
  setActualProjetId,
} from "@/redux/slices/projetSlice";
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";
import { UidContext } from "@/context/UidContext";
import { getSingleProjet } from "@/lib/controllers/projet.controller";
import { fetchClientProjets } from "@/redux/slices/clientProjectSlice";
import { updateConversationRightAvis } from "@/redux/slices/conversationRightSlice";
import { fetchUserInfosController } from "@/lib/controllers/user.controller";
import { usePathname } from "next/navigation";

export default function MenuProjet({ nbTitle }) {
  const dispatch = useDispatch();
  const [actualIndex, setActualIndex] = useState(0);
  const { actualProjetId, projets, actualProject } = useSelector(
    (state) => state.projets
  );
  const { setLoadingBar, setInfoProjectAssistant } = useContext(UidContext);
  const { userType } = useSelector((state) => state.persistInfos);
  const path = usePathname();

  async function chooseProject(IdProject) {
    // setLoadingBar(80);
    const data = await getSingleProjet(projets[IdProject]._id);
    // setLoadingBar(60);
    dispatch(
      setActualProject({
        projet: data.projet,
      })
    );
    if (userType === "assistant") {
      dispatch(
        fetchClientProjets({
          actualClientProjet: data.projet,
        })
      );

      if (path === "/mes-avis") {
        dispatch(
          updateConversationRightAvis({
            actualConversationAvis: {
              projectId: data.projet,
            },
          })
        );
        const { user } = await fetchUserInfosController(data.projet.clientId);
        dispatch(
          updateClientAvisInfos({
            userInfos: user,
          })
        );
      }
    }
    dispatch(
      setActualProjetId({
        actualProjetId: projets[IdProject]._id,
      })
    );

    // setLoadingBar(80);

    dispatch(
      updateClientAvisInfos({
        pageActuelle: 1,
      })
    );
    // setLoadingBar(100);
    // setLoadingBar(0);
  }

  useEffect(() => {
    if (projets?.length > 0) {
      setInfoProjectAssistant(projets[0]);
    }
  }, [projets]);

  return (
    <ClientOnly>
      <div className={styles.container}>
        {/* <div className={styles.dr}>
          {projets.length > nbTitle && (
            <i
              className={actualIndex < nbTitle - 1 ? "pen" : null}
              onClick={() => {
                setActualIndex((prev) => (prev >= 0 ? prev - 1 : prev));
              }}
            >
              <BiLeftArrow size={"1.25rem"} />
            </i>
          )}
          {projets.length > nbTitle && actualIndex > nbTitle && <p>...</p>}
        </div> */}
        <div className="project-name">
          {projets?.length >= 3 && (
            <BiSolidLeftArrow
              className="pointer"
              onClick={async () => {
                if (actualIndex > 0) {
                  chooseProject(actualIndex - 1);
                  setActualIndex(actualIndex - 1);
                }
              }}
            />
          )}
          <div className="project-name-container scr ">
            {projets?.map((p, i) => {
              return (
                <p
                  key={p._id}
                  className={
                    p._id === actualProjetId
                      ? `project-name-container-p-active project-name-container-p`
                      : "project-name-container-p"
                  }
                  onClick={() => {
                    if (i === actualIndex) return;
                    chooseProject(i);
                    setActualIndex(i);
                    if (userType === "assistant") {
                      setInfoProjectAssistant(projets[i]);
                    }
                  }}
                >
                  {p.name?.length > 12 ? p.name.slice(0, 13) + "..." : p.name}
                </p>
              );
            })}
          </div>
          {projets?.length >= 3 && (
            <BiSolidRightArrow
              className="pointer"
              onClick={() => {
                if (actualIndex === projets.length - 1) return;
                chooseProject(actualIndex + 1);
                setActualIndex(actualIndex + 1);
              }}
            />
          )}
        </div>
        {/* <div className={styles.dr}> 
          {projets.length > nbTitle && actualIndex < projets.length && (
            <p>...</p>
          )}
          {projets.length > nbTitle && (
            <i
              className={
                actualIndex === projets.length + Math.floor(nbTitle / 2)
                  ? "pen"
                  : null
              }
              onClick={() => {
                setActualIndex((prev) =>
                  prev < projets.length + Math.floor(nbTitle / 2)
                    ? prev + 1
                    : prev
                );
              }}
            >
              <BiRightArrow size={"1.25rem"} />
            </i>
          )}
        </div> */}
      </div>
    </ClientOnly>
  );
}
