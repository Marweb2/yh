/** @format */

"use client";

// styles
import styles from "../../styles/home/Middle.module.css";

// icons
import { GoBellFill } from "react-icons/go";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

// react
import ClientOnly from "../ClientOnly";
import { useContext, useEffect, useRef, useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjets,
  setActualProject,
  setActualProjetId,
} from "@/redux/slices/projetSlice";
import {
  fetchClientProjets,
  updateProjets,
} from "@/redux/slices/clientProjectSlice";

// controllers
import {
  getAssistantsProjectController,
  getProjetController,
  getProjetAssistant,
} from "@/lib/controllers/projet.controller";

import { isEmpty } from "@/lib/utils/isEmpty";
import { CSSTransition } from "react-transition-group";
import { UidContext } from "@/context/UidContext";

// components
import Avis from "./Avis";
import MenuProjet from "./MenuProjet";
import {
  updateClientAvis,
  updateClientAvisInfos,
} from "@/redux/slices/clientAvisPotentielSlice";
import { calculerNombrePages } from "@/lib/function";
import { updateActualProject } from "@/redux/slices/actualProjectClientSlice";

export default function Middle({
  assistants,
  setAssistants,
  projects,
  setProjects,
  setUserInfos,
  setIsInfos,
  setInfosStatus,
}) {
  const { userType } = useSelector((state) => state.persistInfos);
  const {
    avisTaille,
    avisParPage,
    pageActuelle,
    userInfos,
    taillePage,
    lastIndex,
  } = useSelector((state) => state.clientAvis);
  const { actualProject, actualProjetId } = useSelector(
    (state) => state.projets
  );

  const { setLoadingBar, userId } = useContext(UidContext);

  const dispatch = useDispatch();
  const ref = useRef();

  const nbTitle = 5;

  const [isLoadingProjet, setIsLoadingProjet] = useState(null);

  const [activeCh, setActiveCh] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [assistantLength, setAssistantLength] = useState(0);
  const [actualPage, setActualPage] = useState(1);
  const [renderPage, setRenderPage] = useState(0);
  const { clientProjets, lastClientIndex, pageLength, currentPage } =
    useSelector((state) => state.clientProject);

  let options;

  if (userType === "client") {
    options = [
      { id: "interested", label: "Assistantes intéressées" },
      { id: "not_interested", label: "Assistantes non-intéressées" },
      { id: "responded", label: "Assistantes ayant répondu" },
      { id: "all", label: "Tous les résultats" },
    ];
  } else {
    options = [
      { id: "accepted", label: "Clients ayant acceptés" },
      { id: "rejected", label: "Clients ayant refusés" },
      { id: "all", label: "Tous les résultats" },
    ];
  }

  const [actualOption, setActualOption] = useState({ id: "all" });

  // useEffect(() => {
  //   (async () => {
  //     if (userType === "client" && userId !== null) {
  //       setIsLoadingProjet(true);
  //       setLoadingBar(20);
  //       const res = await getProjetController(userId);
  //       setIsLoadingProjet(false);
  //       setLoadingBar(40);

  //       if (res?.projets) {
  //         dispatch(
  //           fetchProjets({
  //             projets: res.projets,
  //             projet: res.actualProject,
  //           })
  //         );

  //         dispatch(
  //           setActualProjetId({
  //             actualProjetId: res.actualProject?._id,
  //           })
  //         );

  //         dispatch(
  //           updateActualProject({
  //             actualProjectId2: res.actualProject?._id,
  //           })
  //         );
  //         setLoadingBar(100);
  //       } else {
  //         setLoadingBar(100);
  //         setIsFinish(true);
  //       }
  //     }
  //   })();
  // }, [userId]);

  useEffect(() => {
    if (!isEmpty(actualProjetId) && userType === "client") {
      setLoadingBar(80);
      (async () => {
        const res = await getAssistantsProjectController({
          clientId: userId,
          projectId: actualProjetId,
          actualPage: pageActuelle,
          filter: actualOption.id,
        });

        setAssistantLength(res?.assistantsLength);
        dispatch(
          updateClientAvisInfos({
            avisTaille: res?.assistantsLength,
            taillePage: calculerNombrePages(res?.assistantsLength, avisParPage),
            lastIndex:
              res?.assistantsLength % avisParPage === 0
                ? 3
                : (res?.assistantsLength % avisParPage) - 1,
          })
        );

        if (res?.assistants) {
          dispatch(
            setActualProject({
              projet: res.projet,
            })
          );
          setAssistants(res.assistants);
          dispatch(
            updateClientAvis({
              avis: res?.assistants,
            })
          );
        }
        setLoadingBar(100);
        setIsFinish(true);
      })();
    } else if (userType === "assistant" && userId) {
      setLoadingBar(42);
      async function fetchProjects() {
        const { avisClient, lastIndex, pageNumber } = await getProjetAssistant(
          userId,
          currentPage,
          actualOption.id
        );
        setLoadingBar(60);
        dispatch(
          fetchClientProjets({
            clientProjets: avisClient,
          })
        );
        dispatch(
          updateProjets({
            lastClientIndex: lastIndex,
            pageLength: pageNumber,
          })
        );
        setLoadingBar(80);
      }
      fetchProjects();
      setLoadingBar(100);
      setLoadingBar(0);
    }
  }, [
    actualProjetId,
    userId,
    renderPage,
    userInfos,
    pageActuelle,
    currentPage,
    actualOption,
  ]);

  useEffect(() => {
    if (isFinish) {
      setTimeout(() => {
        setLoadingBar(0);
        setIsFinish(false);
      }, 500);
    }
  }, [isFinish]);

  useEffect(() => {
    if (activeCh) {
      const option = document.getElementById("option");
      const handleClickOutside = (e) => {
        if (e.target.id !== option) {
          setActiveCh(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [activeCh]);

  return (
    <ClientOnly>
      <div className={styles.container}>
        <div className={styles.top}>
          <span>
            <GoBellFill size={"1.4rem"} />
          </span>
          <label>Avis potentiels</label>
          {(!isEmpty(actualProject) || userType === "assistant") && (
            <i onClick={() => setActiveCh((prev) => !prev)}>
              <PiDotsThreeOutlineFill size={"1.5rem"} />
            </i>
          )}
        </div>
        <CSSTransition
          in={activeCh}
          timeout={350}
          classNames={"sc"}
          unmountOnExit
          nodeRef={ref}
        >
          <div ref={ref} id="option" className={styles.select}>
            <i className={styles.tri} />
            {options.map((option) => (
              <label
                key={option.id}
                onClick={() => {
                  setActualOption({ id: option.id });
                  dispatch(
                    updateClientAvisInfos({
                      pageActuelle: 1,
                    })
                  );
                }}
                htmlFor={option.id}
              >
                <span>{option.label}</span>
                <input
                  checked={actualOption.id === option.id}
                  id={option.id}
                  name="assistant"
                  type="radio"
                />
              </label>
            ))}
          </div>
        </CSSTransition>
        <div
          className={
            !isEmpty(actualProject?.assistants)
              ? `${styles.contenu} ${styles.pn} scr`
              : `${styles.contenu} scr`
          }
        >
          {isLoadingProjet ? null : (
            <>
              {!isEmpty(actualProject) && userType === "client" ? (
                <div className={styles.contProjet}>
                  <MenuProjet nbTitle={nbTitle} />

                  <Avis
                    assistants={assistants}
                    setAssistants={setAssistants}
                    projects={projects}
                    setProjects={setProjects}
                    setIsInfos={setIsInfos}
                    userInfos={userInfos}
                    setUserInfos={setUserInfos}
                    assistantLength={assistantLength}
                    setAssistantLength={setAssistantLength}
                    setActualPage={setActualPage}
                    actualPage={actualPage}
                    setRenderPage={setRenderPage}
                    setInfosStatus={setInfosStatus}
                  />
                </div>
              ) : userType === "assistant" && clientProjets?.length ? (
                <div className={styles.contProjet}>
                  <Avis
                    projects={projects}
                    setProjects={setProjects}
                    setIsInfos={setIsInfos}
                    userInfos={userInfos}
                    setUserInfos={setUserInfos}
                    assistantLength={assistantLength}
                    setAssistantLength={setAssistantLength}
                    setActualPage={setActualPage}
                    actualPage={actualPage}
                    setInfosStatus={setInfosStatus}
                    setRenderPage={setRenderPage}
                  />
                </div>
              ) : (
                <div>
                  <h1 className="usn">Aucun résultat</h1>
                  {userType === "client" ? (
                    <label>
                      Afin que l&apos;algorithme puisse offrir des avis
                      potentiels selon les compétences recherchées, veuiller
                      vous créer un Nouveau projet.
                    </label>
                  ) : (
                    <label>
                      Afin que l&apos;algorithme puisse offrir des avis
                      potentiels selon vos compétences, veuiller mettre à jour
                      votre profil.
                    </label>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
