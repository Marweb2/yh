/** @format */

import styles from "../../styles/home/Avis.module.css";
import style from "@/styles/projet/Projet.module.css";

// components
import Image from "next/image";
import { isEmpty } from "@/lib/utils/isEmpty";
import { CSSTransition } from "react-transition-group";

// react
import { UidContext } from "@/context/UidContext";
import { useContext, useEffect, useRef, useState } from "react";

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
  const [active, setActive] = useState(false);
  const ref = useRef();

  // console.log(projectId.deletedByClient);

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
        const data = await deleteAvis(projectId._id, _id, userId, "assistant");
        console.log("salut", data);
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
      <CSSTransition
        in={active}
        timeout={350}
        classNames={"pcf"}
        unmountOnExit
        nodeRef={ref}
      >
        <div ref={ref} className={style.popupContainer}>
          <div className={`${style.popupMsg} cft`}>
            <div className={style.popupClose}>
              <span
                style={{
                  display: "flex",
                  justifyContent: "right",
                  cursor: "pointer",
                }}
                onClick={() => setActive(false)}
              >
                <CgClose />
              </span>
            </div>
            <div className={style.hr} />
            <div className={style.popupMiddle}>
              <div className={style.popupContenu}>
                <p
                  style={{
                    textAlign: "left",
                    hyphens: "auto",
                    // wordSpacing: "-0.1rem",
                    fontSize: "14px",
                    lineHeight: "16px",
                  }}
                >
                  ce projet n&apos;existe plus ou ce projet n&apos;est pas
                  disponible pour le moment. De ce fait, Voulez-vous supprimer
                  ce projet de votre côté aussi ou le conserver dans votre
                  historique?
                </p>
              </div>
              <div className={style.popupButton}>
                <button
                  style={{
                    background: "#badf5b",
                  }}
                  onClick={async () => {
                    await deleteAvis(projectId._id, _id, userId, "assistant");
                    setRenderPage((a) => a + 1);
                    setActive(false);
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
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
          if (projectId.deletedByClient) {
            setActive(true);
            return;
          }
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
