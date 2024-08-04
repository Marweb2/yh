/** @format */

"use client";

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
  addAssistantFavorite,
  searchAssistantFavorite,
  deleteAssistantFavorite,
  fetchTimeLeft,
  updateAvis,
  updateAssistantAvis,
} from "@/lib/controllers/projet.controller";

export function getDuree(duree, value) {
  const text = duree?.find((a) => a.value === `${value}`);

  return text?.txt || "";
}

export default function UserInfoProjet({
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
  const [newDisp, setNewDisp] = useState({
    obj: actualProject?.disponibilite || [],
    value: false,
  });
  const [status, setStatus] = useState("no_choice");
  const [timeLeft, setTimeLeft] = useState();
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
  });
  const {
    avis,
    taillePage,
    pageActuelle,
    indexAvisSelectionee,
    userInfos,
    lastIndex,
    renderAvis,
  } = useSelector((state) => state.clientAvis);
  const nextAvis = () => {
    dispatch(
      updateClientAvisInfos({
        userInfos: avis[indexAvisSelectionee + 1]?.assistantId,
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
        userInfos: avis[indexAvisSelectionee]?.assistantId,
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
        popUpStatut: "avis",
      })
    );
    dispatch(
      updateDeleteAvisAssistant({
        id,
      })
    );
  };

  let comp;

  if (userType === "client") {
    comp = avis.find((e) => e.assistantId?._id === userInfos._id);
  } else {
    comp = clientProjets.find(
      (e) =>
        e.assistantId === userId && e.projectId?._id === actualClientProjet._id
    );
  }

  useEffect(() => {
    async function fetchData() {
      if (userType === "client") {
        const data = await updateAvis(
          comp?.projectId,
          comp?._id,
          user._id,
          false
        );
      } else {
        await updateAssistantAvis(userId, comp._id);
        // console.log("okok");
        // const data = await updateAvis(
        //   comp?.projectId,
        //   comp?._id,
        //   user._id,
        //   false
        // );
      }
    }

    if (comp.isNewAvis || comp.isNewAvisForAssistant) {
      fetchData();
    }
  }, []);

  const updateChoice = async (choice = "no_choice") => {
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
    const data = await updateAssistantChoice(userId, choice, comp._id);
    setLoadingBar(80);
    dispatch(
      fetchClientProjets({
        clientProjets: clientProjets.map((e) => {
          if (e._id === comp._id) {
            return {
              ...e,
              assistant_choice: data.choice,
            };
          }
          return e;
        }),
      })
    );
    setLoadingBar(100);
    setLoadingBar(0);
  };

  useEffect(() => {
    async function getTimeLeft() {
      if (userType === "client") {
        const data = await fetchTimeLeft(actualProject._id);
        setTimeLeft(data?.remainingDelai?.text);
      } else {
        const data = await fetchTimeLeft(actualClientProjet._id);
        setTimeLeft(data?.remainingDelai?.text);
        setTime({
          days: data?.remainingDelai?.days,
          hours: data?.remainingDelai?.hours,
        });
      }
    }

    getTimeLeft();
  }, [actualProject, actualClientProjet]);

  useEffect(() => {
    if (
      deleteAvisAssistant.id === assistantId2 &&
      deleteAvisAssistant.accept === true
    ) {
      async function deleteFavourite() {
        const data = await deleteAvis(
          userType === "client" ? actualProject._id : actualClientProjet._id,
          comp?._id,
          userId
        );
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
          dispatch(
            updateClientAvisInfos({
              userInfos: user,
            })
          );
          setIsInfos(false);
        } else {
          if (userType === "client") {
            if (
              (pageActuelle < taillePage && indexAvisSelectionee === 3) ||
              (currentPage < pageLength && actualClientIndex === 3)
            ) {
              stayAtCurrentIndex();
            } else {
              nextAvis();
            }
          } else {
            setIsInfos(false);
          }
        }
      }
      deleteFavourite();
    }
  }, [deleteAvisAssistant.accept]);

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
        data = await searchAssistantFavorite(comp?._id, user._id);
      }
      if (data.found) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
    searchIfFavorite();
    setLoadingBar(100);
    setLoadingBar(0);
  }, [userInfos, avis, render]);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userType !== "client") {
      setNewDisp({
        obj: actualClientProjet?.disponibilite || [],
        value: false,
      });
    }
  }, [actualClientProjet]);

  const addFavorite = async () => {
    setLoadingBar(50);
    if (userType === "client") {
      const data = await addClientFavorite(comp?._id, user._id);
      if (data.created) {
        setIsFavorite(data.created);
      }
    } else {
      const data = await addAssistantFavorite(comp?._id, user._id);
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
    const res = await updateAvisStatut(
      comp?.projectId,
      comp?._id,
      user._id,
      statut
    );
    setLoadingBar(80);
    if (res.updated) {
      dispatch(
        updateClientAvis({
          avis: avis.map((e) => {
            if (e.assistantId?._id === comp?.assistantId?._id) {
              const data = { ...e, statut: res.statut };
              return data;
            } else {
              return e;
            }
          }),
        })
      );
    }
    setLoadingBar(100);
    setLoadingBar(0);
  }

  useEffect(() => {
    if (userType !== "client") return;
    const fetchFavorite = async () => {
      setLoadingBar(30);
      const assistant = await fetch(
        `/api/user/${userId}/${avis[indexAvisSelectionee]?._id}`
      );

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
            userType === "client"
              ? actualProject.name
              : actualClientProjet?.name
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
              userType === "client" ? actualProject._id : actualClientProjet._id
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
              userType === "client"
                ? actualProject.desc
                : actualClientProjet?.desc
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
                userType === "client"
                  ? actualProject?.statut
                  : actualClientProjet?.statut
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
                userType === "client"
                  ? getDuree(duree, actualProject?.duree)
                  : getDuree(duree, actualClientProjet?.duree)
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
                userType === "client"
                  ? compatibilite + "%"
                  : correspondance + "%"
              }
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className={styles.btf}>
            <i
              className={
                (pageActuelle === 1 && indexAvisSelectionee === 0) ||
                (actualClientIndex === 0 && currentPage === 1)
                  ? `${styles.disable} pen`
                  : null
              }
              onClick={() => {
                if (userType === "client") {
                  let page =
                    pageActuelle > 1 && indexAvisSelectionee === 0
                      ? pageActuelle - 1
                      : pageActuelle;
                  let index =
                    pageActuelle > 1 && indexAvisSelectionee === 0
                      ? 3
                      : indexAvisSelectionee - 1;
                  dispatch(
                    updateClientAvisInfos({
                      // userInfos:
                      //   pageActuelle > 1 && indexAvisSelectionee === 0
                      //     ? avis[indexAvisSelectionee].assistantId
                      //     : avis[indexAvisSelectionee - 1].assistantId,
                      indexAvisSelectionee: index,
                      pageActuelle: page,
                      prev: page < pageActuelle ? true : false,
                    })
                  );

                  if (page === pageActuelle && indexAvisSelectionee >= 1) {
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: avis[indexAvisSelectionee - 1].assistantId,
                      })
                    );
                  }
                } else if (userType === "assistant") {
                  let page =
                    currentPage > 1 && actualClientIndex === 0
                      ? currentPage - 1
                      : currentPage;
                  let index =
                    currentPage > 1 && actualClientIndex === 0
                      ? 3
                      : actualClientIndex - 1;

                  dispatch(
                    updateProjets({
                      actualClientIndex: index,
                      currentPage: page,
                      prev: page < currentPage ? true : false,
                    })
                  );
                  if (page === currentPage && actualClientIndex >= 1) {
                    dispatch(
                      fetchClientProjets({
                        actualClientProjet:
                          clientProjets[actualClientIndex - 1].projectId,
                        correspondance:
                          clientProjets[actualClientIndex - 1].correspondance,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos:
                          clientProjets[actualClientIndex - 1].projectId
                            .clientId,
                      })
                    );
                  }
                }
              }}
            >
              <BiSolidLeftArrow size={"1.5rem"} />
            </i>
            <div className={styles.cntb}>
              <div className={styles.cntf}>
                <label
                  htmlFor=""
                  className="usn c-pointer"
                  onClick={() => updateChoice("not_interested")}
                  style={{
                    background:
                      comp?.assistant_choice === "not_interested" && "#ff5757",
                    pointerEvents: userType !== "assistant" && "none",
                  }}
                >
                  assistant(e) non-intéressé(e)
                </label>
                <span
                  style={{
                    // color:
                    // actualProject?.isClosed || comp?.projectId.isClosed
                    //   ? "#ff5757"
                    //   : "#badf5b",
                    color:
                      userType === "client"
                        ? actualProject.isClosed ||
                          comp?.assistant_choice === "not_interested" ||
                          comp?.projectId.isClosed
                          ? "#ff5757"
                          : comp?.assistant_choice === "no_choice"
                          ? "#036eff"
                          : "#badf5b"
                        : comp?.projectId.delai === null ||
                          comp?.projectId.isClosed === false
                        ? "#badf5b"
                        : //comp?.projectId.isClosed &&
                          // comp.assistant_choice === "not_interested" ||
                          // comp.assistant_choice === "no_choice") &&
                          "#ff5757",
                    // : "",
                  }}
                  className="watch"
                >
                  <GoStopwatch size={"1.5rem"} />
                  {(actualProject.delai === null && userType === "client") ||
                  (comp?.projectId.delai === null &&
                    userType === "assistant") ? (
                    ""
                  ) : (
                    <span>{timeLeft}</span>
                  )}
                </span>

                <label
                  htmlFor=""
                  className="usn c-pointer"
                  onClick={() => updateChoice("interested")}
                  style={{
                    background:
                      comp?.assistant_choice === "interested" && "#badf5b",
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
                    if (status === "rejected" && userType === "client") {
                      updateStatut("no_choice");
                    } else if (
                      status === "no_choice" ||
                      (status === "accepted" && userType === "client")
                    ) {
                      updateStatut("rejected");
                    }
                  }}
                  className={status === "rejected" ? styles.rf : styles.neutre}
                >
                  {status === "rejected" ? "Refusé(e)" : "Refuser"}
                </button>
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
                <button
                  onClick={() => {
                    if (status === "accepted" && userType === "client") {
                      updateStatut("no_choice");
                    } else if (
                      status === "no_choice" ||
                      (status === "rejected" && userType === "client")
                    ) {
                      updateStatut("accepted");
                    }
                  }}
                  style={{
                    pointerEvents: userType !== "client" && "none",
                  }}
                  className={status === "accepted" ? styles.ac : styles.neutre}
                >
                  {status === "accepted" ? "Accepté(e)" : "Accepter"}
                </button>
              </div>
            </div>
            <i
              className={
                (pageActuelle === taillePage &&
                  indexAvisSelectionee === lastIndex) ||
                (currentPage === pageLength &&
                  lastClientIndex === actualClientIndex)
                  ? `${styles.disable} pen`
                  : null
              }
              onClick={() => {
                if (userType === "client") {
                  let page =
                    pageActuelle < taillePage && indexAvisSelectionee === 3
                      ? pageActuelle + 1
                      : pageActuelle;
                  let index =
                    pageActuelle < taillePage && indexAvisSelectionee === 3
                      ? 0
                      : indexAvisSelectionee + 1;
                  dispatch(
                    updateClientAvisInfos({
                      // userInfos: avis[indexAvisSelectionee + 1]?.assistantId,
                      indexAvisSelectionee: index,
                      pageActuelle: page,
                      next: page > pageActuelle ? true : false,
                    })
                  );

                  if (page === pageActuelle && indexAvisSelectionee < 3) {
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: avis[indexAvisSelectionee + 1]?.assistantId,
                      })
                    );
                  }
                } else if (userType === "assistant") {
                  let page =
                    currentPage < pageLength && actualClientIndex === 3
                      ? currentPage + 1
                      : currentPage;
                  let index =
                    currentPage <= pageLength && actualClientIndex < 3
                      ? actualClientIndex + 1
                      : 0;
                  dispatch(
                    updateProjets({
                      actualClientIndex: index,
                      currentPage: page,
                      next: page > currentPage ? true : false,
                    })
                  );
                  if (page === currentPage && actualClientIndex < 3) {
                    dispatch(
                      fetchClientProjets({
                        actualClientProjet:
                          clientProjets[actualClientIndex + 1].projectId,
                        correspondance:
                          clientProjets[actualClientIndex + 1].correspondance,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos:
                          clientProjets[actualClientIndex + 1].projectId
                            .clientId,
                      })
                    );
                  }
                }
              }}
            >
              <BiSolidRightArrow size={"1.5rem"} />
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}
