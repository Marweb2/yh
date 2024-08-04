/** @format */

"use client";

// styles
import styles from "../styles/LR.module.css";

// hooks
import useLogout from "@/lib/hooks/useLogout";

// components
import Right from "./home/Right";
import ClientOnly from "./ClientOnly";
import Left from "./home/Left";
import EditProfil from "./home/profil/EditProfil";
import Projet from "./projet/Projet";
import Middle from "./home/Middle";
import InfoHub from "./home/infohub/InfoHub";
import MesProjets from "./mes-projets/MesProjets";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "@/lib/utils/isEmpty";

export default function LR({ isHome, isNewProjet, isMyProject }) {
  const { user } = useSelector((state) => state.user);

  const isLogout = useLogout();

  const [isEditProfil, setIsEditProfil] = useState(false);
  const [isInfos, setIsInfos] = useState(false);
  const [isCollapse, setIsCollapse] = useState({ obj: "", value: true });
  const [userInfos, setUserInfos] = useState({});
  const [isOwn, setIsOwn] = useState(true);
  const [assistants, setAssistants] = useState([]);

  useEffect(() => {
    if (!isEmpty(user)) {
      setUserInfos(user);
    }
  }, [user]);

  useEffect(() => {
    if (!isEmpty(userInfos) && !isEmpty(user)) {
      setIsOwn(user._id === userInfos._id);
    }
  }, [userInfos]);

  return (
    <ClientOnly spin home loadJWT>
      <div
        className={
          isLogout.isActive ? `${styles.container} pen` : `${styles.container}`
        }
      >
        <div
          className={
            isCollapse.obj === "profil"
              ? !isCollapse.value
                ? `${styles.left} ${styles.ls} ${styles.none}`
                : `${styles.left} ${styles.ls}`
              : `${styles.left}`
          }
        >
          <div className={styles.leftR}>
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
        {isEditProfil ? (
          <EditProfil
            setIsCollapse={setIsCollapse}
            setIsEditProfil={setIsEditProfil}
          />
        ) : (
          <>
            <div className={styles.middle}>
              {isNewProjet && <Projet />}
              {isHome && !isInfos && (
                <Middle
                  assistants={assistants}
                  setAssistants={setAssistants}
                  setIsInfos={setIsInfos}
                  userInfos={userInfos}
                  setUserInfos={setUserInfos}
                />
              )}
              {isHome && isInfos && (
                <InfoHub
                  assistants={assistants}
                  setAssistants={setAssistants}
                  setIsInfos={setIsInfos}
                  userInfos={userInfos}
                  setUserInfos={setUserInfos}
                />
              )}
              {isMyProject && <MesProjets />}
            </div>
            <div
              className={
                isCollapse.obj === "right"
                  ? `${styles.right} ${styles.rs}`
                  : `${styles.right}`
              }
            >
              <div className={styles.rightR}>
                <Right isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
              </div>
            </div>
          </>
        )}
      </div>
    </ClientOnly>
  );
}
