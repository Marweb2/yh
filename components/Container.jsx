/** @format */

"use client";

//hooks
import useLogout from "@/lib/hooks/useLogout";

// styles
import styles from "../styles/Container.module.css";
import Left from "./home/Left";
import Right from "./home/Right";
import EditProfil from "./home/profil/EditProfil";
import style from "../styles/LR.module.css";
import { usePathname } from "next/navigation";

import ClientOnly from "./ClientOnly";
import Bottom from "./menu/Bottom";
import Menu from "./menu/Menu";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "@/lib/utils/isEmpty";
import Middle from "./home/Middle";
import InfoHub from "./home/infohub/InfoHub";
import PopUp from "./PopUp";
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";
import { UidContext } from "@/context/UidContext";
import {
  getAssistantsProjectController,
  getProjetController,
} from "@/lib/controllers/projet.controller";
import Spinner from "./Spinner";
import {
  fetchProjets,
  setActualProject,
  setActualProjetId,
} from "@/redux/slices/projetSlice";
import { updateActualProject } from "@/redux/slices/actualProjectClientSlice";

export default function Container({ children }) {
  const { user } = useSelector((state) => state.user);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isEditProfil, setIsEditProfil] = useState(false);
  const {
    isInfos,
    setIsInfos,
    render,
    setRender,
    infosStatus,
    setInfosStatus,
  } = useContext(UidContext);
  const [isCollapse, setIsCollapse] = useState({ obj: "", value: true });
  const { userInfos } = useSelector((state) => state.clientAvis);

  const [isOwn, setIsOwn] = useState(true);
  const [assistants, setAssistants] = useState([]);
  const [projects, setProjects] = useState([]);
  const isLogout = useLogout();
  const { userType } = useSelector((state) => state.persistInfos);
  const { setLoadingBar, userId, verifyJWT, refetchDataCount } =
    useContext(UidContext);
  const [isLoadingProjet, setIsLoadingProjet] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      if (userType === "client" && userId !== null) {
        setIsLoadingProjet(true);
        setLoadingBar(20);
        const res = await getProjetController(userId);
        setIsLoadingProjet(false);
        setLoadingBar(40);

        if (res?.projets) {
          dispatch(
            fetchProjets({
              projets: res.projets,
              projet: res.actualProject,
            })
          );

          dispatch(
            setActualProjetId({
              actualProjetId: res.actualProject?._id,
            })
          );

          dispatch(
            updateActualProject({
              actualProjectId2: res.actualProject?._id,
            })
          );
          setLoadingBar(100);
        } else {
          setLoadingBar(100);
          setIsFinish(true);
        }
      }
    })();
  }, [userId, refetchDataCount]);

  useEffect(() => {
    if (!isEmpty(user)) {
      dispatch(
        updateClientAvisInfos({
          userInfos: user,
        })
      );
    }
  }, [user]);

  useEffect(() => {
    if (!isEmpty(userInfos) && !isEmpty(user)) {
      setIsOwn(user._id === userInfos._id);
    }
  }, [userInfos]);

  if (typeof window === "undefined" || isEmpty(user) /*|| verifyJWT*/) {
    return <Spinner />;
  }

  return (
    <ClientOnly spin>
      <div className={`${styles.container} `}>
        <PopUp setRender={setRender} infosStatus={infosStatus} />
        <div className={styles.top}>
          <Menu
            isInfos={isInfos}
            setIsInfos={setIsInfos}
            isEditProfil={isEditProfil}
            setIsEditProfil={setIsEditProfil}
          />
        </div>
        <div
          className={
            isLogout.isActive ? `${style.container} pen` : `${style.container}`
          }
        >
          {
            <div
              className={
                isCollapse.obj === "profil"
                  ? !isCollapse.value
                    ? `${style.left} ${style.ls} ${style.none}`
                    : `${style.left} ${style.ls}`
                  : `${style.left}`
              }
            >
              <div className={style.leftR}>
                <Left
                  isCollapse={isCollapse}
                  setIsCollapse={setIsCollapse}
                  isEditProfil={isEditProfil}
                  setIsEditProfil={setIsEditProfil}
                  userInfos={userInfos}
                  isOwn={isOwn}
                />
              </div>
            </div>
          }
          {isEditProfil ? (
            <EditProfil
              setIsCollapse={setIsCollapse}
              setIsEditProfil={setIsEditProfil}
            />
          ) : (
            <>
              <div className={style.middle}>
                {pathname !== "/accueil" ? (
                  children
                ) : (
                  <>
                    {!isInfos && (
                      <Middle
                        assistants={assistants}
                        setAssistants={setAssistants}
                        projects={projects}
                        setProjects={setProjects}
                        setIsInfos={setIsInfos}
                        userInfos={userInfos}
                        setInfosStatus={setInfosStatus}
                      />
                    )}
                    {isInfos && (
                      <InfoHub
                        assistants={assistants}
                        setAssistants={setAssistants}
                        setIsInfos={setIsInfos}
                        userInfos={userInfos}
                        render={render}
                        setRender={setRender}
                        infosStatus={infosStatus}
                        setInfosStatus={setInfosStatus}
                      />
                    )}
                  </>
                )}{" "}
              </div>
              {pathname !== "/info-hub" && (
                <div
                  className={
                    isCollapse.obj === "right"
                      ? !isCollapse.value
                        ? `${style.right} ${style.rs} ${style.none}`
                        : `${style.right} ${style.rs}`
                      : `${style.right}`
                  }
                >
                  <div className={style.rightR}>
                    <Right
                      render={render}
                      setRender={setRender}
                      isCollapse={isCollapse}
                      setIsCollapse={setIsCollapse}
                      setIsInfos={setIsInfos}
                      isInfos={isInfos}
                      setInfosStatus={setInfosStatus}
                      infosStatus={infosStatus}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.bottom}>
          <Bottom isInfos={isInfos} setIsInfos={setIsInfos} />
        </div>
      </div>
    </ClientOnly>
  );
}
