/** @format */

"use client";
/** @format */

import UserInfoProjet from "./UserInfoProjet";

// styles
import styles from "../../../styles/home/infohub/InfoProjet.module.css";

import Calendar from "../Calendar";

//redux
import {
  updateProjets,
  fetchClientProjets,
} from "@/redux/slices/clientProjectSlice";
import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
} from "@/redux/slices/popUpSlice";

import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoIosHeart } from "react-icons/io";
import { GoStopwatch } from "react-icons/go";
import { CgClose } from "react-icons/cg";
import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UidContext } from "@/context/UidContext";
import { fetchProjets } from "@/redux/slices/projetSlice";
import { duree } from "@/components/projet/Desc";
import {
  updateClientAvis,
  updateClientAvisInfos,
} from "@/redux/slices/clientAvisPotentielSlice";
import {
  updateAvisStatut,
  addClientFavorite,
  searchClientFavorite,
  deleteClientFavorite,
  deleteAvis,
  updateAssistantChoice,
} from "@/lib/controllers/projet.controller";
import RightSectionInfoProjet from "./RightSectionInfoProjet";

export function getDuree(duree, value) {
  const text = duree?.find((a) => a.value === `${value}`);

  return text?.txt || "";
}
export default function InfoProjet({
  assistantIndex,
  setAssistantIndex,
  assistants,
  render,
  setRender,
  setIsInfos,
  setUserInfos,
  infosStatus,
}) {
  const { userType } = useSelector((state) => state.persistInfos);

  return infosStatus === "middle" || infosStatus === "messageIcon" ? (
    <UserInfoProjet
      render={render}
      setRender={setRender}
      setIsInfos={setIsInfos}
      assistantIndex={assistantIndex}
      infosStatus={infosStatus}
    />
  ) : (
    <RightSectionInfoProjet
      render={render}
      setRender={setRender}
      setIsInfos={setIsInfos}
      assistantIndex={assistantIndex}
      infosStatus={infosStatus}
    />
  );
}
