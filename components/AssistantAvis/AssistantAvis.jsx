/** @format */

import styles from "../../styles/home/Avis.module.css";

// components
import Image from "next/image";
import { isEmpty } from "@/lib/utils/isEmpty";

// react
import { UidContext } from "@/context/UidContext";
import { useContext, useEffect, useState } from "react";

// redux
import { setActualAssistant } from "@/redux/slices/projetSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjets, setActualProject } from "@/redux/slices/projetSlice";
import {
  fetchClientProjets,
  updateProjets,
} from "@/redux/slices/clientProjectSlice";
import { deleteAvis } from "@/lib/controllers/projet.controller";

// icons
import { CgClose } from "react-icons/cg";
import { TfiEmail } from "react-icons/tfi";
import { GoStopwatch } from "react-icons/go";
import { AiOutlineStar } from "react-icons/ai";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

// controllers
import { getAssistantsProjectController } from "@/lib/controllers/projet.controller";
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";

// constants
import { perPage } from "@/lib/constants";
import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
} from "@/redux/slices/popUpSlice";

export default function AssistantAvis({
  name,
  username,
  correspondance,
  project,
  image,
  clientId,
  setUserInfos,
  setIsInfos,
  // projectId,
  index,
  setInfosStatus,
  setRenderPage,
}) {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const { dateString, projectId, _id, assistantId, isNewAvisForAssistant } =
    project;
  const { setLoadingBar, userId } = useContext(UidContext);
  const { deleteAvisAssistant } = useSelector((state) => state.popUp);
  const { pageActuelle, userInfos, indexAvisSelectionee, renderAvis } =
    useSelector((state) => state.clientAvis);

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

  const handleClickOpen = (id) => {
    // setAssistantId(id);
    dispatch(
      updateIsActive({
        isActive: true,
      })
    );
    dispatch(
      updatePopUpStatut({
        popUpStatut: "avis",
      })
    );
    dispatch(
      updateDeleteAvisAssistant({
        id,
      })
    );
  };

  useEffect(() => {
    if (deleteAvisAssistant.id === _id && deleteAvisAssistant.accept === true) {
      async function deleteFavourite() {
        const data = await deleteAvis(projectId._id, _id, userId);
        dispatch(
          updateDeleteAvisAssistant({
            accept: false,
          })
        );
        dispatch(
          updateDeleteAvisAssistant({
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

        if (currentPage === pageLength && clientProjets.length === 1) {
          dispatch(
            updateProjets({
              currentPage: 1,
            })
          );
        }
        setRenderPage((a) => a + 1);
      }
      deleteFavourite();
    }
  }, [deleteAvisAssistant.accept]);

  const date = dateString?.split("-");

  return (
    <div
      className={
        userInfos._id === project?.projectId?.clientId._id &&
        projectId?._id === actualClientProjet._id
          ? `${styles.contAss} ${styles.active}`
          : `${styles.contAss} `
      }
    >
      <div className={styles.top}>
        <div className={styles.cont}>
          <div className={styles.left}>
            {/* <span>{date && date[0]}</span>
            <p>.</p>
            <span>{date && date[1]}</span> */}
            {dateString}
            {/* <p className={styles.sym}>!</p> */}
            <label htmlFor="">{project.correspondance}%</label>
          </div>
          <div className={styles.right}>
            <i
              style={{
                color: projectId?.isClosed ? "#ff5757" : "#badf5b",
                cursor: "pointer",
              }}
            >
              <GoStopwatch size={"1.15rem"} />
            </i>
            <i
              onClick={() => {
                dispatch(
                  fetchClientProjets({
                    actualClientProjet: projectId,
                    correspondance: project.correspondance,
                  })
                );
                dispatch(
                  updateProjets({
                    actualClientIndex: index,
                  })
                );
                dispatch(
                  updateClientAvisInfos({
                    userInfos: projectId.clientId,
                  })
                );
                setIsInfos(true);
                setInfosStatus("messageIcon");
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <TfiEmail size={"1.15rem"} />
            </i>
            <i
              onClick={() => handleClickOpen(_id)}
              style={{
                cursor: "pointer",
              }}
              className={styles.close}
            >
              <CgClose size={"1.15rem"} />
            </i>
          </div>
        </div>
        <div className={styles.hr} />
      </div>
      <div
        onClick={() => {
          dispatch(
            fetchClientProjets({
              actualClientProjet: projectId,
              correspondance: project.correspondance,
            })
          );
          dispatch(
            updateProjets({
              actualClientIndex: index,
            })
          );
          dispatch(
            updateClientAvisInfos({
              userInfos: projectId.clientId,
            })
          );
          setIsInfos(true);
          setInfosStatus("middle");
        }}
        className={styles.contcontenudle}
      >
        {isNewAvisForAssistant && <p className="new">Nouveau</p>}
        <div className={styles.imgCont}>
          <Image
            src={
              !isEmpty(projectId?.clientId?.image)
                ? projectId?.clientId?.image[0]
                : "/default_avatar.jpg"
            }
            alt=""
            className={styles.img}
            width={75}
            height={75}
          />
        </div>
        <div className={styles.infos}>
          <label htmlFor="">
            <span>
              {projectId?.clientId?.username}, {projectId?.clientId?.name}
            </span>
          </label>
          <div className={styles.stars}>
            <div className={styles.icons}>
              <AiOutlineStar size={"1.25rem"} />
              <AiOutlineStar size={"1.25rem"} />
              <AiOutlineStar size={"1.25rem"} />
              <AiOutlineStar size={"1.25rem"} />
              <AiOutlineStar size={"1.25rem"} />
            </div>
            <span>
              {/* {ass.avis?.length === 0 ? (
                <>aucun avis</>
              ) : (
                <>{ass.avis?.length} avis</>
              )} */}
            </span>
          </div>
          <p className="project-name-client">
            {projectId?.name?.length > 25
              ? projectId?.name.slice(0, 26) + "..."
              : projectId?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
