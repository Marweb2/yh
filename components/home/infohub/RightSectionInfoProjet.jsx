/** @format */

"use client";

// styles
import styles from "../../../styles/home/infohub/InfoProjet.module.css";

import Calendar from "../Calendar";
import { Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";
import { determineTooltip } from "@/lib/function";

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
  addAssistantFavorite,
  searchAssistantFavorite,
  deleteAssistantFavorite,
  fetchTimeLeft,
} from "@/lib/controllers/projet.controller";
import { updateRightAvis } from "@/redux/slices/rightAvisSlice";
import { updateConversationRightAvis } from "@/redux/slices/conversationRightSlice";

export function getDuree(duree, value) {
  const text = duree?.find((a) => a.value === `${value}`);

  return text?.txt || "";
}

export default function RightSectionInfoProjet({
  assistantIndex,
  setAssistantIndex,
  assistants,
  render,
  setRender,
  setIsInfos,
  setUserInfos,
  infosStatus,
}) {
  const { actualProject } = useSelector((state) => state.projets);
  const { userType } = useSelector((state) => state.persistInfos);
  const { setLoadingBar, userId } = useContext(UidContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isValidDisp, setIsValidDisp] = useState(false);
  const { avis, actualAvis, index, length } = useSelector(
    (state) => state.rightAvis
  );

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
  });
  const { setIsActive, isActive } = useContext(UidContext);
  const [tooltip, setTooltip] = useState();
  const pathname = usePathname();

  useEffect(() => {
    setTooltip(determineTooltip(isActive.obj));
  }, [isActive.obj]);
  const {
    conversationAvis,
    actualConversationAvis,
    conversationAvisLength,
    conversationAvisIndex,
  } = useSelector((state) => state.conversationAvis);

  const [newDisp, setNewDisp] = useState({
    obj:
      infosStatus === "rightFavourite" || infosStatus === "fav"
        ? actualAvis.projectId?.disponibilite || []
        : actualConversationAvis.projectId?.disponibilite || [],
    value: false,
  });

  const [status, setStatus] = useState("no_choice");
  const {
    // actualAvis,
    taillePage,
    pageActuelle,
    indexAvisSelectionee,
    userInfos,
    lastIndex,
    renderAvis,
  } = useSelector((state) => state.clientAvis);
  //.log(actualAvis);
  const nextAvis = () => {
    dispatch(
      updateClientAvisInfos({
        userInfos: actualAvis[indexAvisSelectionee + 1]?.assistantId,
        indexAvisSelectionee:
          pageActuelle < taillePage && indexAvisSelectionee === 3
            ? 0
            : indexAvisSelectionee + 1,
        pageActuelle:
          pageActuelle < taillePage && indexAvisSelectionee === 3
            ? pageActuelle + 1
            : pageActuelle,
      })
    );
  };
  const stayAtCurrentIndex = () => {
    dispatch(
      updateClientAvisInfos({
        userInfos: actualAvis[indexAvisSelectionee]?.assistantId,
        indexAvisSelectionee:
          pageActuelle < taillePage && indexAvisSelectionee === 3
            ? 3
            : indexAvisSelectionee,
        renderAvis: renderAvis + 1,
        // pageActuelle < taillePage && indexAvisSelectionee === 3
        //   ? pageActuelle + 1
        //   : pageActuelle,
      })
    );
  };

  const {
    clientProjets,
    lastClientIndex,
    pageLength,
    currentPage,
    actualClientIndex,
    actualClientProjet,
    correspondance,
  } = useSelector((state) => state.clientProject);
  const { deleteAvisAssistant } = useSelector((state) => state.popUp);

  const [assistantId, setAssistantId] = useState([]);
  const [compatibilite, setCompatibilite] = useState(0);
  const [assistantId2, setAssistantId2] = useState("");

  const handleClickOpen = (id) => {
    setAssistantId2(id);
    dispatch(
      updateIsActive({
        isActive: true,
      })
    );
    dispatch(
      updatePopUpStatut({
        popUpStatut: "actualAvis",
      })
    );
    dispatch(
      updateDeleteAvisAssistant({
        id,
      })
    );
  };

  let comp;

  //

  if (userType === "client") {
    comp = avis?.find((e) => e.assistantId?._id === userInfos._id);
  } else {
    comp = actualConversationAvis;
  }

  const updateChoice = async (choice = "no_choice") => {
    // if (time.days === 0 && time.hours === 0) return;
    if (comp?.projectId?.delai === null) {
    } else if (
      time.days === 0 &&
      time.hours === 0 &&
      actualProject.delai !== null
      // comp?.projectId.isClosed === false
    ) {
      return;
    }
    setLoadingBar(43);
    if (choice === comp?.assistant_choice) {
      choice = "no_choice";
    }
    setLoadingBar(60);
    setLoadingBar(80);
    // dispatch(
    //   fetchClientProjets({
    //     clientProjets: clientProjets.map((e) => {
    //       if (e._id === comp._id) {
    //         return {
    //           ...e,
    //           assistant_choice: data.choice,
    //         };
    //       }
    //       return e;
    //     }),
    //   })
    // );

    if (infosStatus === "rightFavourite" || infosStatus === "fav") {
      const res = await updateAssistantChoice(userId, choice, comp._id);

      const fav = avis.find(
        (e) =>
          e.assistantId?._id === actualAvis?.assistantId?._id &&
          e.projectId._id === actualAvis?.projectId._id
      );
      dispatch(
        updateRightAvis({
          actualAvis: { ...fav, assistant_choice: res.choice },
        })
      );
    } else {
      const res = await updateAssistantChoice(userId, choice, comp._id);

      if (res.updated) {
        const avis = conversationAvis.find(
          (e) =>
            e.assistantId?._id === actualConversationAvis?.assistantId?._id &&
            e.projectId._id === actualConversationAvis?.projectId._id
        );

        dispatch(
          updateConversationRightAvis({
            actualConversationAvis: { ...avis, assistant_choice: res.choice },
          })
        );
      }
    }
    setLoadingBar(100);
    setLoadingBar(0);

    //.log(data);
  };

  useEffect(() => {
    if (
      deleteAvisAssistant.id === assistantId2 &&
      deleteAvisAssistant.accept === true
    ) {
      async function deleteFavourite() {
        const data = await deleteAvis(
          infosStatus === "rightFavourite" || infosStatus === "fav"
            ? actualAvis.projectId._id
            : actualConversationAvis._id,
          comp?._id,
          userId,
          userType === "client" ? "client" : "assistant"
        );
        //.log(data); actualAvis.projectId._id
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
        if (
          (pageActuelle === taillePage && indexAvisSelectionee === lastIndex) ||
          (currentPage === pageLength && lastClientIndex === actualClientIndex)
        ) {
          //.log(1);
          dispatch(
            updateClientAvisInfos({
              userInfos: user,
            })
          );
          setIsInfos(false);
        } else {
          //.log(2);
          if (pageActuelle < taillePage && indexAvisSelectionee === 3) {
            stayAtCurrentIndex();
          } else {
            nextAvis();
          }
        }
      }
      deleteFavourite();
    }
  }, [deleteAvisAssistant.accept]);
  // Affichage time left
  const [timeLeft, setTimeLeft] = useState();

  useEffect(() => {
    async function getTimeLeft() {
      if (infosStatus === "rightFavourite" || infosStatus === "fav") {
        const data = await fetchTimeLeft(actualAvis.projectId._id);
        setTimeLeft(data.remainingDelai?.text);
        setTime({
          days: data?.remainingDelai?.days,
          hours: data?.remainingDelai?.hours,
        });
      } else {
        const data = await fetchTimeLeft(
          actualConversationAvis?.projectId?._id
        );
        setTimeLeft(data?.remainingDelai?.text);
        setTime({
          days: data?.remainingDelai?.days,
          hours: data?.remainingDelai?.hours,
        });
      }
    }

    getTimeLeft();
  }, [actualAvis, actualClientProjet]);

  useEffect(() => {
    if (!userInfos) return;
    setLoadingBar(40);

    setStatus(comp?.statut);
    setCompatibilite(comp?.correspondance);
    setLoadingBar(80);
    async function searchIfFavorite() {
      let data;

      if (userType === "client") {
        data = await searchClientFavorite(comp?._id, user._id);
      } else {
        //.log(actualAvis._id, user._id, userId);
        data = await searchAssistantFavorite(actualAvis._id, userId);
      }
      //.log(data);
      if (data.found) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
    searchIfFavorite();
    setLoadingBar(100);
    setLoadingBar(0);
  }, [userInfos, actualAvis, render]);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userType !== "client") {
      if (infosStatus === "rightFavourite" || infosStatus === "fav") {
        setNewDisp({
          obj: actualAvis?.projectId.disponibilite || [],
          value: false,
        });
      } else {
        setNewDisp({
          obj: actualConversationAvis?.projectId.disponibilite || [],
          value: false,
        });
      }
    }
  }, [actualAvis]);

  const addFavorite = async () => {
    setLoadingBar(50);
    if (userType === "client") {
      const data = await addClientFavorite(comp?._id, user._id);
      if (data.created) {
        setIsFavorite(data.created);
      }
    } else {
      //.log(comp?._id, user._id);
      const data = await addAssistantFavorite(comp?._id, user._id);
      //.log(data);
    }

    setLoadingBar(100);
    setLoadingBar(0);
    setRender((a) => a + 1);
  };

  const deleteFavorite = async () => {
    setLoadingBar(50);
    let data;

    if (userType === "client") {
      data = await deleteClientFavorite(comp?._id, user._id);
    } else {
      data = await deleteAssistantFavorite(comp?._id, user._id);
    }
    if (data.deleted) {
      setIsFavorite(!data.deleted);
    }

    setLoadingBar(100);
    setLoadingBar(0);
    setRender((a) => a + 1);
  };

  async function updateStatut(statut) {
    setLoadingBar(40);
    if (infosStatus === "rightFavourite" || infosStatus === "fav") {
      const res = await updateAvisStatut(
        actualAvis?.projectId?._id,
        actualAvis?._id,
        user._id,
        statut
      );
      const fav = avis.find(
        (e) =>
          e.assistantId?._id === actualAvis?.assistantId?._id &&
          e.projectId._id === actualAvis?.projectId._id
      );
      dispatch(
        updateRightAvis({
          actualAvis: { ...fav, statut: res.statut },
        })
      );
    } else {
      const res = await updateAvisStatut(
        actualConversationAvis?.projectId?._id,
        actualConversationAvis?._id,
        user._id,
        statut
      );
      if (res.updated) {
        const avis = conversationAvis.find(
          (e) =>
            e.assistantId?._id === actualConversationAvis?.assistantId?._id &&
            e.projectId._id === actualConversationAvis?.projectId._id
        );
        dispatch(
          updateConversationRightAvis({
            actualConversationAvis: { ...avis, statut: res.statut },
          })
        );
      }
    }

    setLoadingBar(80);

    setLoadingBar(100);
    setLoadingBar(0);
  }

  useEffect(() => {
    if (userType !== "client") return;
    const fetchFavorite = async () => {
      setLoadingBar(30);
      const assistant = await fetch(`/api/user/${userId}/${actualAvis?._id}`);

      const { data } = await assistant.json();

      setAssistantId(data);
    };
    setLoadingBar(60);

    fetchFavorite();
    setLoadingBar(100);
    setLoadingBar(0);
  }, [assistantIndex, render]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <input
          type="text"
          readOnly
          value={
            infosStatus === "rightFavourite" || infosStatus === "fav"
              ? actualAvis.projectId.name
              : actualConversationAvis.projectId.name
          }
          className="scr"
          onChange={() => {}}
          style={{
            width: "70%",
          }}
        />
        <i
          onClick={() => {
            handleClickOpen(
              infosStatus === "rightFavourite" || infosStatus === "fav"
                ? actualAvis._id
                : actualConversationAvis._id
            );
          }}
        >
          <CgClose size={"1.5rem"} />
        </i>
      </div>
      <div className={styles.des}>
        <div>
          <textarea
            readOnly
            value={
              infosStatus === "rightFavourite" || infosStatus === "fav"
                ? actualAvis.projectId.desc
                : actualConversationAvis.projectId.desc
            }
            className="scr"
            onChange={() => {}}
            style={{
              height: "150px",
            }}
          />
        </div>
        <div className={styles.dsp}>
          <div>
            <h1>
              <span className="usn">Disponibilités</span>
            </h1>
            <Calendar
              isValidDisp={isValidDisp}
              setIsValidDisp={setIsValidDisp}
              newDisp={newDisp}
              setNewDisp={setNewDisp}
              blue
              readOnly
            />
          </div>
        </div>
      </div>
      <div className={styles.bdg}>
        <div>
          <label htmlFor="" className="usn">
            Statut
          </label>
          <div className={styles.inpc}>
            <input
              type="text"
              readOnly
              value={
                infosStatus === "rightFavourite" || infosStatus === "fav"
                  ? actualAvis.projectId?.statut
                  : actualConversationAvis.projectId.statut
              }
              onChange={() => {}}
            />
          </div>
        </div>
        <div>
          <label className={`${styles.txl} usn`}>Durée du projet</label>
          <div className={styles.inpc}>
            <input
              type="text"
              readOnly
              // value={actualProject.duree || ""}
              value={
                infosStatus === "rightFavourite" || infosStatus === "fav"
                  ? getDuree(duree, actualAvis.projectId?.duree)
                  : getDuree(duree, actualConversationAvis.projectId.duree)
              }
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
      <div className={styles.bot}>
        <div className={styles.cnt}>
          <div className={styles.center}>
            <label htmlFor="" className="usn">
              Compatibilité
            </label>
            <input
              type="text"
              value={
                infosStatus === "rightFavourite" || infosStatus === "fav"
                  ? actualAvis.correspondance + "%"
                  : actualConversationAvis.correspondance + "%"
              }
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className={styles.btf}>
            {pathname !== "/mes-projets" && pathname !== "/mes-avis" ? (
              <i
                className={
                  ((infosStatus === "rightFavourite" ||
                    infosStatus === "fav") &&
                    index === 0) ||
                  (infosStatus === "conversationFavourite" &&
                    conversationAvisIndex === 0)
                    ? `${styles.disable} pen`
                    : null
                }
                onClick={() => {
                  if (userType === "client") {
                    if (infosStatus === "rightFavourite") {
                      dispatch(
                        updateRightAvis({
                          actualAvis: avis[index - 1],
                          index: index - 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos: avis[index - 1].assistantId,
                        })
                      );
                    } else {
                      dispatch(
                        updateConversationRightAvis({
                          actualConversationAvis:
                            conversationAvis[conversationAvisIndex - 1],
                          conversationAvisIndex: conversationAvisIndex - 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos:
                            conversationAvis[conversationAvisIndex - 1]
                              .assistantId,
                        })
                      );
                    }
                  } else if (userType === "assistant") {
                    if (
                      infosStatus === "rightFavourite" ||
                      infosStatus === "fav"
                    ) {
                      dispatch(
                        updateRightAvis({
                          actualAvis: avis[index - 1],
                          index: index - 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos: avis[index - 1]?.projectId?.clientId,
                        })
                      );
                    } else {
                      dispatch(
                        updateConversationRightAvis({
                          actualConversationAvis:
                            conversationAvis[conversationAvisIndex - 1],
                          conversationAvisIndex: conversationAvisIndex - 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos:
                            conversationAvis[conversationAvisIndex - 1]
                              .projectId.clientId,
                        })
                      );
                    }
                  }
                }}
              >
                <BiSolidLeftArrow size={"1.5rem"} />
              </i>
            ) : (
              <Tooltip title={tooltip?.left} placement="top-end">
                <i onClick={() => setIsActive({ obj: tooltip?.lAbr })}>
                  <BiSolidLeftArrow size={"1.5rem"} />
                </i>
              </Tooltip>
            )}
            <div className={styles.cntb}>
              <div className={styles.cntf}>
                <label
                  htmlFor=""
                  className="usn c-pointer"
                  onClick={() => updateChoice("not_interested")}
                  style={{
                    background:
                      (actualConversationAvis?.assistant_choice ===
                        "not_interested" ||
                        actualAvis?.assistant_choice === "not_interested") &&
                      "#ff5757",
                    pointerEvents: userType !== "assistant" && "none",
                  }}
                >
                  assistant(e) non-intéressé(e)
                </label>
                <span
                  style={{
                    // color:
                    //   actualProject?.isClosed || comp?.projectId.isClosed
                    //     ? "#ff5757"
                    //     : "#badf5b",
                    color:
                      userType === "client"
                        ? actualConversationAvis?.projectId?.isClosed ||
                          actualConversationAvis?.assistant_choice ===
                            "not_interested" ||
                          actualAvis?.projectId?.isClosed ||
                          actualAvis?.assistant_choice === "not_interested"
                          ? "#ff5757"
                          : actualConversationAvis?.assistant_choice ===
                              "no_choice" ||
                            actualAvis?.assistant_choice === "no_choice"
                          ? "#036eff"
                          : "#badf5b"
                        : infosStatus === "conversationFavourite"
                        ? actualConversationAvis?.projectId.delai === null ||
                          actualConversationAvis?.projectId.isClosed === false
                          ? "#badf5b"
                          : "#ff5757"
                        : infosStatus !== "conversationFavourite" &&
                          (actualAvis?.projectId?.delai === null ||
                            actualAvis?.projectId?.isClosed === false)
                        ? "#badf5b"
                        : "#ff5757",
                  }}
                  className="watch"
                >
                  <GoStopwatch
                    size={"1.5rem"}
                    // style={{
                    //   color:
                    //     actualProject?.isClosed || comp?.projectId.isClosed
                    //       ? "#ff5757"
                    //       : "#036eff",
                    // }}
                  />
                  {(actualProject.delai || comp?.projectId?.delai) && (
                    <span>{timeLeft}</span>
                  )}
                </span>
                <label
                  htmlFor=""
                  className="usn c-pointer"
                  onClick={() => updateChoice("interested")}
                  style={{
                    background:
                      (actualConversationAvis?.assistant_choice ===
                        "interested" ||
                        actualAvis?.assistant_choice === "interested") &&
                      "#badf5b",
                    pointerEvents: userType !== "assistant" && "none",
                  }}
                >
                  assistant(e) intéressé(e)
                </label>
              </div>
              <div className={styles.cnts}>
                <button
                  style={{
                    pointerEvents: userType !== "client" && "none",
                  }}
                  onClick={() => {
                    //.log("salut", status);
                    if (
                      (actualConversationAvis?.statut === "rejected" ||
                        actualAvis.statut === "rejected") &&
                      userType === "client"
                    ) {
                      //.log("true");
                      updateStatut("no_choice");
                    } else if (
                      actualConversationAvis?.statut === "no_choice" ||
                      actualConversationAvis?.statut === "accepted" ||
                      actualAvis.statut === "no_choice" ||
                      (actualAvis.statut === "accepted" &&
                        userType === "client")
                    ) {
                      updateStatut("rejected");
                      //.log(false);
                    }
                  }}
                  className={
                    actualConversationAvis?.statut === "rejected" ||
                    actualAvis?.statut === "rejected"
                      ? styles.rf
                      : styles.neutre
                  }
                >
                  {actualConversationAvis?.statut === "rejected" ||
                  actualAvis?.statut === "rejected"
                    ? "Refusé(e)"
                    : "Refuser"}
                </button>
                {(infosStatus === "rightFavourite" ||
                  infosStatus === "fav") && (
                  <i
                    style={{
                      color: isFavorite && "#ff5757",
                    }}
                    onClick={() => {
                      if (isFavorite) {
                        deleteFavorite();
                      } else {
                        addFavorite();
                      }
                    }}
                  >
                    <IoIosHeart size={"1.5rem"} />
                  </i>
                )}

                <button
                  onClick={() => {
                    if (
                      (actualConversationAvis?.statut === "accepted" ||
                        actualAvis.statut === "accepted") &&
                      userType === "client"
                    ) {
                      updateStatut("no_choice");
                    } else if (
                      actualConversationAvis?.statut === "no_choice" ||
                      actualConversationAvis?.statut === "rejected" ||
                      actualAvis.statut === "no_choice" ||
                      (actualAvis.statut === "rejected" &&
                        userType === "client")
                    ) {
                      updateStatut("accepted");
                    }
                  }}
                  style={{
                    pointerEvents: userType !== "client" && "none",
                  }}
                  className={
                    actualConversationAvis?.statut === "accepted" ||
                    actualAvis?.statut === "accepted"
                      ? styles.ac
                      : styles.neutre
                  }
                >
                  {actualConversationAvis?.statut === "accepted" ||
                  actualAvis?.statut === "accepted"
                    ? "Accepté(e)"
                    : "Accepter"}
                </button>
              </div>
            </div>
            {pathname !== "/mes-projets" && pathname !== "/mes-avis" ? (
              <i
                className={
                  (infosStatus === "rightFavourite" && index === length - 1) ||
                  (infosStatus === "conversationFavourite" &&
                    conversationAvisIndex === conversationAvisLength - 1)
                    ? `${styles.disable} pen`
                    : null
                }
                onClick={() => {
                  if (userType === "client") {
                    if (infosStatus === "rightFavourite") {
                      dispatch(
                        updateRightAvis({
                          actualAvis: avis[index + 1],
                          index: index + 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos: avis[index + 1].assistantId,
                        })
                      );
                    } else {
                      dispatch(
                        updateConversationRightAvis({
                          actualConversationAvis:
                            conversationAvis[conversationAvisIndex + 1],
                          conversationAvisIndex: conversationAvisIndex + 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos:
                            conversationAvis[conversationAvisIndex + 1]
                              .assistantId,
                        })
                      );
                    }
                  } else if (userType === "assistant") {
                    if (
                      infosStatus === "rightFavourite" ||
                      infosStatus === "fav"
                    ) {
                      dispatch(
                        updateRightAvis({
                          actualAvis: avis[index + 1],
                          index: index + 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos: avis[index + 1]?.projectId?.clientId,
                        })
                      );
                    } else {
                      dispatch(
                        updateConversationRightAvis({
                          actualConversationAvis:
                            conversationAvis[conversationAvisIndex + 1],
                          conversationAvisIndex: conversationAvisIndex + 1,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos:
                            conversationAvis[conversationAvisIndex + 1]
                              .projectId.clientId,
                        })
                      );
                    }
                  }
                }}
              >
                <BiSolidRightArrow size={"1.5rem"} />
              </i>
            ) : (
              <Tooltip title={tooltip?.right} placement="top-end">
                <i onClick={() => setIsActive({ obj: tooltip?.rAbr })}>
                  <BiSolidRightArrow size={"1.5rem"} />
                </i>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
