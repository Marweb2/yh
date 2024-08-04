/** @format */
"use client";
import HomeContainer from "@/components/home/HomeContainer";
import styles from "./home.module.css";
import LR from "@/components/LR";
import Middle from "@/components/home/Middle";
import { useState, useContext } from "react";
import { UidContext } from "@/context/UidContext";
import { useSelector } from "react-redux";
import InfoHub from "@/components/home/infohub/InfoHub";
import Left from "@/components/home/Left";
import style from "../../../styles/LR.module.css";
import { useEffect } from "react";
import { isEmpty } from "@/lib/utils/isEmpty";
import Right from "@/components/home/Right";
import useLogout from "@/lib/hooks/useLogout";

export default function HomePage() {
  const [isEditProfil, setIsEditProfil] = useState(false);
  const [isInfos, setIsInfos] = useState(false);
  const [isCollapse, setIsCollapse] = useState({ obj: "", value: true });
  const [userInfos, setUserInfos] = useState({});
  const [isOwn, setIsOwn] = useState(true);
  const [assistants, setAssistants] = useState([]);
  const { isLoadingJWT, setLoadingBar, userId } = useContext(UidContext);
  const { user } = useSelector((state) => state.user);
  const [render, setRender] = useState(0);
  const isLogout = useLogout();

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
    <div
      className={
        isLogout.isActive ? `${style.container} pen` : `${style.container}`
      }
    >
      <LR isHome>
        <HomeContainer />
      </LR>
      {/* <div
        className={
          isCollapse.obj === "profil"
            ? !isCollapse.value
              ? `home-left ${style.ls} ${style.none}`
              : `home-left ${style.ls}`
            : `home-left`
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
            isHome
          />
        </div>
      </div> */}
      <>
        {/* {!isLoadingJWT && !isInfos && (
          <Middle
            assistants={assistants}
            setAssistants={setAssistants}
            setIsInfos={setIsInfos}
            userInfos={userInfos}
            setUserInfos={setUserInfos}
          />
        )}
        {isInfos && (
          <InfoHub
            assistants={assistants}
            setAssistants={setAssistants}
            setIsInfos={setIsInfos}
            userInfos={userInfos}
            setUserInfos={setUserInfos}
            render={render}
            setRender={setRender}
          />
        )} */}
        {/* <div
          className={
            isCollapse.obj === "right" ? `home-right ${style.rs}` : `home-right`
          }
        >
          <div className={style.rightR}>
            <Right
              render={render}
              setRender={setRender}
              isCollapse={isCollapse}
              setIsCollapse={setIsCollapse}
            />
          </div>
        </div> */}
      </>
    </div>
  );
}
