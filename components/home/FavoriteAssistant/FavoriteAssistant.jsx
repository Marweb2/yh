/** @format */

import * as React from "react";

import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UidContext } from "@/context/UidContext";

import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
} from "@/redux/slices/popUpSlice";
import { useWindowSize } from "./Conversation";

import "./favorite.css";
import { GoMail } from "react-icons/go";
import { BiX } from "react-icons/bi";
import { IoIosHeart } from "react-icons/io";
import Image from "next/image";
import {
  deleteAssistantFavorite,
  deleteClientFavorite,
} from "@/lib/controllers/projet.controller";
import {
  updateClientAvis,
  updateClientAvisInfos,
} from "@/redux/slices/clientAvisPotentielSlice";
import { updateRightAvis } from "@/redux/slices/rightAvisSlice";

export default function FavoriteAssistant({
  assistantId,
  projectId,
  correspondance,
  dateString,
  _id,
  setRender,
  setInfosStatus,
  infosStatus,
  setIsInfos,
  assistant,
  conversation,
  i,
  setIsCollapse,
}) {
  const [open, setOpen] = useState(false);
  const { actualProject, compatibilite, projets } = useSelector(
    (state) => state.projets
  );

  const {
    conversationAvis,
    actualConversationAvis,
    conversationAvisLength,
    conversationAvisIndex,
  } = useSelector((state) => state.conversationAvis);
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

  const { deleteFavouriteAssistant, projectId: project } = useSelector(
    (state) => state.popUp
  );
  const { userInfos } = useSelector((state) => state.clientAvis);
  const { userType } = useSelector((state) => state.persistInfos);
  const { avis } = useSelector((state) => state.rightAvis);
  const { width } = useWindowSize();

  const sameProject =
    userType === "client" && infosStatus === "middle"
      ? actualProject._id === projectId._id
      : userType === "assistant" && infosStatus === "middle"
      ? actualClientProjet._id === projectId._id
      : infosStatus === "conversationFavourite"
      ? actualConversationAvis?.projectId?._id === projectId?._id
      : actualAvis?.projectId?._id === projectId?._id;

  const dispatch = useDispatch();

  const { userId } = useContext(UidContext);

  const handleClickOpen = () => {
    dispatch(
      updateIsActive({
        isActive: true,
      })
    );
    dispatch(
      updatePopUpStatut({
        popUpStatut: "favoris",
      })
    );
    dispatch(
      updateDeleteFavouriteAssistant({
        id: userType === "client" ? assistantId?._id : projectId.clientId._id,
        projectId: projectId._id,
      })
    );
  };

  React.useEffect(() => {
    if (
      (deleteFavouriteAssistant.id === assistantId?._id ||
        deleteFavouriteAssistant.id === projectId.clientId._id) &&
      deleteFavouriteAssistant.accept === true &&
      project === projectId._id
    ) {
      async function deleteFavourite() {
        let data;
        if (userType === "client") {
          data = await deleteClientFavorite(_id, userId);
        } else {
          data = await deleteAssistantFavorite(_id, userId);
        }

        dispatch(
          updateDeleteFavouriteAssistant({
            accept: false,
          })
        );
        dispatch(
          updateDeleteFavouriteAssistant({
            id: "",
          })
        );
        dispatch(
          updateIsActive({
            isActive: false,
          })
        );
        dispatch(
          updatePopUpStatut({
            popUpStatut: "",
          })
        );
        if (data.deleted) {
          setRender((a) => a + 1);
        }
      }
      deleteFavourite();
    }
  }, [deleteFavouriteAssistant.accept]);

  const handleClick = async (assistantId, ProjectName) => {
    await fetch(`/api/favorite/user/${userId}?id=${assistantId}`, {
      method: "DELETE",
    });
    setOpen(false);

    if (actualProject.name === ProjectName) {
      setRender((a) => a + 1);
    } else {
      setRenderRight((a) => a + 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <section
      className={
        (assistantId?._id === userInfos._id && sameProject) ||
        (projectId?.clientId?._id === userInfos._id && sameProject)
          ? "assistant-container assistant-active"
          : "assistant-container"
      }
    >
      <div className="top">
        <div className=" top--info ">
          <p className=" text-gray-500 date "> {dateString}</p>
          <p className="text-g">{correspondance}%</p>
        </div>
        <div className=" top--action ">
          <IoIosHeart
            style={{
              color: "#ff5757",
            }}
            size={"16px"}
          />
          <span
            style={{
              position: "relative",
            }}
          >
            <GoMail
              onClick={() => {
                if (width <= 700) {
                  setIsCollapse((prev) => ({
                    ...prev,
                    obj: prev.obj === "right" ? "" : "right",
                  }));
                }
                setInfosStatus("fav");
                setIsInfos(true);
                if (userType === "client") {
                  dispatch(
                    updateRightAvis({
                      actualAvis: avis[i],
                      index: i,
                    })
                  );
                  dispatch(
                    updateClientAvisInfos({
                      userInfos: avis[i].assistantId,
                    })
                  );
                } else {
                  dispatch(
                    updateRightAvis({
                      actualAvis: avis[i],
                      index: i,
                    })
                  );
                  dispatch(
                    updateClientAvisInfos({
                      userInfos: avis[i]?.projectId?.clientId,
                    })
                  );
                }
              }}
              size={"16px"}
              className="icon"
            />

            {conversation !== null &&
              conversation?.lastMesssageSentBy !== userType &&
              ((conversation?.viewedByClient === false &&
                userType === "client") ||
                (conversation?.viewedByAssistant === false &&
                  userType === "assistant")) && (
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
                  {1}
                </div>
              )}
          </span>
          <BiX onClick={handleClickOpen} className="icon" />
        </div>
      </div>
      <div
        className="bottom"
        onClick={() => {
          setInfosStatus("rightFavourite");
          setIsInfos(true);

          if (width <= 700) {
            setIsCollapse((prev) => ({
              ...prev,
              obj: prev.obj === "right" ? "" : "right",
            }));
          }

          if (userType === "client") {
            dispatch(
              updateRightAvis({
                actualAvis: avis[i],
                index: i,
              })
            );
            dispatch(
              updateClientAvisInfos({
                userInfos: avis[i].assistantId,
              })
            );
          } else {
            dispatch(
              updateRightAvis({
                actualAvis: avis[i],
                index: i,
              })
            );
            dispatch(
              updateClientAvisInfos({
                userInfos: avis[i]?.projectId?.clientId,
              })
            );
          }
        }}
      >
        <div className="img">
          <Image
            src={
              userType === "client"
                ? assistantId?.image?.length > 0
                  ? assistantId?.image[0]
                  : "/default_avatar.jpg"
                : projectId.clientId?.image?.length > 0
                ? projectId.clientId?.image[0]
                : "/default_avatar.jpg"
            }
            height={40}
            width={40}
            alt={"photo"}
          />
        </div>
        <div className="bottom--information">
          <div className="bottom--personnal">
            <h3>
              {userType === "client"
                ? `${assistantId?.username} , ${assistantId?.name} `
                : ` ${projectId?.clientId?.name}, ${projectId.clientId?.username} `}
            </h3>
            <p>
              {userType === "client"
                ? assistantId?.statutProfessionnelle
                : projectId.clientId?.statutProfessionnelle}
            </p>
          </div>
          <div className="name">
            {projectId?.name?.length <= 9
              ? projectId.name
              : projectId.name?.slice(0, 10) + "..."}
          </div>
        </div>
      </div>
    </section>
  );
}
