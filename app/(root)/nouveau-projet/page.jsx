/** @format */

"use client";

/** @format */

import Projet from "@/components/projet/Projet";
import styles from "./projet.module.css";
import LR from "@/components/LR";
import Left from "@/components/home/Left";
import style from "../../../styles/LR.module.css";
import { useEffect, useState, useContext } from "react";
import { isEmpty } from "@/lib/utils/isEmpty";
import { UidContext } from "@/context/UidContext";
import { useSelector } from "react-redux";

export default function ProjectPage() {
  const [isEditProfil, setIsEditProfil] = useState(false);
  const [isInfos, setIsInfos] = useState(false);
  const [isCollapse, setIsCollapse] = useState({ obj: "", value: true });
  const [userInfos, setUserInfos] = useState({});
  const [isOwn, setIsOwn] = useState(true);
  const [assistants, setAssistants] = useState([]);
  const { isLoadingJWT, setLoadingBar, userId } = useContext(UidContext);
  const { user } = useSelector((state) => state.user);
  const [render, setRender] = useState(0);

  return (
    <>
      <div className={styles.container}>
        {/* <LR isNewProjet> */}
        {/* <div className={style.leftR}>
          <Left
            isCollapse={isCollapse}
            setIsCollapse={setIsCollapse}
            isEditProfil={isEditProfil}
            setIsEditProfil={setIsEditProfil}
            userInfos={userInfos}
            isOwn={isOwn}
          />
        </div> */}
        <Projet />
        {/* </LR> */}
      </div>
    </>
  );
}
