/** @format */

import * as React from "react";

import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UidContext } from "@/context/UidContext";

import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
} from "@/redux/slices/popUpSlice";

import "./favorite.css";
import { GoMail } from "react-icons/go";
import { BiX } from "react-icons/bi";
import { IoIosHeart } from "react-icons/io";
import Image from "next/image";
import {
  deleteClientFavorite,
  searchAssistantFavorite,
  searchClientFavorite,
} from "@/lib/controllers/projet.controller";
import { updateConversationRightAvis } from "@/redux/slices/conversationRightSlice";
import {
  updateClientAvis,
  updateClientAvisInfos,
} from "@/redux/slices/clientAvisPotentielSlice";
import { useEffect } from "react";
import { setActualProjetId } from "@/redux/slices/projetSlice";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default function Conversation({
  assistantId,
  projectId,
  correspondance,
  dateString,
  _id,
  avisId,
  setRender,
  assistant,
  client,
  setIsInfos,
  setInfosStatus,
  viewedByAssistant,
  viewedByClient,
  notViewedByAssistant,
  notViewedByClient,
  i,
  infosStatus,
  convId,
  date,
  setIsCollapse,
}) {
  const [open, setOpen] = useState(false);
  const { actualProject, compatibilite, projets } = useSelector(
    (state) => state.projets
  );

  const { width } = useWindowSize();

  const { deleteFavouriteAssistant } = useSelector((state) => state.popUp);
  const { userInfos } = useSelector((state) => state.clientAvis);
  const { userType } = useSelector((state) => state.persistInfos);
  const { conversationAvis, actualConversationAvis } = useSelector(
    (state) => state.conversationAvis
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const {
    actualAvis,
    avis: rightAvis,
    index,
    length,
  } = useSelector((state) => state.rightAvis);
  const {
    clientProjets,
    lastClientIndex,
    pageLength,
    currentPage,
    actualClientIndex,
    actualClientProjet,
  } = useSelector((state) => state.clientProject);
  const [notification, setNotification] = useState(
    (userType === "client" && !viewedByClient) ||
      (userType === "assistant" && !viewedByAssistant)
  );

  const dispatch = useDispatch();

  const sameProject =
    userType === "client" && infosStatus === "middle"
      ? actualProject?._id === avisId.projectId?._id
      : userType === "assistant" && infosStatus === "middle"
      ? actualClientProjet?._id === avisId.projectId?._id
      : infosStatus === "conversationFavourite"
      ? actualConversationAvis?.projectId?._id === avisId.projectId?._id
      : actualAvis?.projectId?._id === avisId.projectId?._id;

  const { userId } = useContext(UidContext);

  const handleClick = () => {
    setInfosStatus("conversationFavourite");
    setNotification(false);
    if (width <= 700) {
      setIsCollapse((prev) => ({
        ...prev,
        obj: prev.obj === "right" ? "" : "right",
      }));
    }

    setIsInfos(true);
    if (userType === "client") {
      dispatch(
        updateConversationRightAvis({
          actualConversationAvis: conversationAvis[i],
          conversationAvisIndex: i,
        })
      );
      dispatch(
        updateClientAvisInfos({
          userInfos: conversationAvis[i].assistantId,
        })
      );
    } else {
      dispatch(
        updateConversationRightAvis({
          actualConversationAvis: conversationAvis[i],
          conversationAvisIndex: i,
        })
      );
      dispatch(
        updateClientAvisInfos({
          userInfos: conversationAvis[i].projectId?.clientId,
        })
      );
      dispatch(
        setActualProjetId({
          actualProjetId: conversationAvis[i].projectId._id,
        })
      );
    }
  };

  useEffect(() => {
    async function search() {
      let data;
      if (userType === "client") {
        data = await searchClientFavorite(avisId?._id, userId);
      } else {
        data = await searchAssistantFavorite(avisId?._id, userId);
      }
      if (data.found) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }

    search();
  }, []);

  return (
    <section
      className={
        (avisId?.assistantId?._id === userInfos?._id && sameProject) ||
        (avisId.projectId?.clientId?._id === userInfos?._id && sameProject)
          ? "assistant-container assistant-active"
          : "assistant-container"
      }
    >
      <div className="top">
        <div className=" top--info ">
          <p className=" text-gray-500 date "> {date}</p>
          <p className="text-g">{avisId?.correspondance}%</p>
        </div>
        <div className=" top--action ">
          <IoIosHeart
            style={{
              color: isFavorite && "#036eff",
            }}
            size={"16px"}
          />
          {/* <GoMail size={"16px"} className="icon" /> */}
          <span
            style={{
              position: "relative",
              cursor: "pointer",
            }}
            onClick={handleClick}
          >
            {/* <Badge badgeContent={count} color="error"> */}
            <GoMail size={"1.4rem"} />
            {notification && (
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  background: "red",
                  color: "white",
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {userType === "assistant"
                  ? notViewedByAssistant
                  : notViewedByClient}
              </div>
            )}
            {/* </Badge> */}
          </span>
          <BiX
            onClick={() => {
              dispatch(
                updatePopUpStatut({
                  popUpStatut: "conversation",
                  avisId: userType === "client" ? _id : convId,
                })
              );
              dispatch(
                updateIsActive({
                  isActive: true,
                })
              );
              // dispatch(
              //   updateDeleteAvisAssistant({
              //     id: _id,
              //   })
              // );
            }}
            className="icon"
          />
        </div>
      </div>
      <div className="bottom">
        <div className="img">
          <Image
            src={
              userType === "client"
                ? avisId.assistantId?.image?.length > 0
                  ? avisId.assistantId?.image[0]
                  : "/default_avatar.jpg"
                : avisId.projectId?.clientId?.image?.length > 0
                ? avisId.projectId?.clientId?.image[0]
                : "/default_avatar.jpg"
            }
            height={40}
            width={40}
            alt={"photo"}
          />
        </div>
        <div className="bottom--information" onClick={handleClick}>
          <div className="bottom--personnal">
            <h3>
              {userType === "client"
                ? `${avisId.assistantId?.username} , ${avisId.assistantId?.name} `
                : ` ${avisId.projectId?.clientId?.name}, ${avisId.projectId?.clientId?.username} `}
            </h3>
            <p>
              {userType === "client"
                ? avisId.assistantId?.statutProfessionnelle
                : avisId.projectId?.clientId?.statutProfessionnelle}
            </p>
          </div>
          <div className="name">
            {avisId.projectId?.name?.length <= 9
              ? avisId.projectId?.name
              : avisId.projectId?.name?.slice(0, 10) + "..."}
          </div>
        </div>
      </div>
    </section>
  );
}
