/** @format */

"use client";

// styles
import styles from "@/styles/home/infohub/Question.module.css";

// react
import { useContext, useEffect, useState } from "react";
import { UidContext } from "@/context/UidContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";
import { determineTooltip } from "@/lib/function";

// components

// redux
import { useSelector, useDispatch } from "react-redux";
import { updateRightAvis } from "@/redux/slices/rightAvisSlice";
import { updateConversationRightAvis } from "@/redux/slices/conversationRightSlice";
import { updateAssistantReponses } from "@/redux/slices/questionResponsesSlice";

import {
  updateProjets,
  fetchClientProjets,
} from "@/redux/slices/clientProjectSlice";
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";

// icons
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { Button } from "@mui/material";
import {
  getAssistantResponses,
  searchUserBlocked,
  sendAssistantResponses,
} from "@/lib/controllers/projet.controller";
import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
} from "@/redux/slices/popUpSlice";

const AssistantQuestions = ({ infosStatus }) => {
  const [responses, setResponses] = useState([]);
  const {
    clientProjets,
    lastClientIndex,
    pageLength,
    currentPage,
    actualClientIndex,
    actualClientProjet,
  } = useSelector((state) => state.clientProject);
  const { setIsActive, isActive } = useContext(UidContext);

  // const {
  //   avis,
  //   pageActuelle,
  //   indexAvisSelectionee,
  //   userInfos,
  //   taillePage,
  //   lastIndex,
  // } = useSelector((state) => state.clientAvis);
  const { userId } = useContext(UidContext);
  const [open, setOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isError, setIsError] = useState({
    blank: false,
    overflowCharacter: false,
  });
  const [tooltip, setTooltip] = useState();

  useEffect(() => {
    setTooltip(determineTooltip(isActive.obj));
  }, [isActive.obj]);
  // const [isResponsesSent, setIsResponsesSent] = useState(false);
  const dispatch = useDispatch();
  const {
    conversationAvis,
    actualConversationAvis,
    conversationAvisLength,
    conversationAvisIndex,
  } = useSelector((state) => state.conversationAvis);
  const { avis, actualAvis, index, length } = useSelector(
    (state) => state.rightAvis
  );

  const { isResponsesSent } = useSelector((state) => state.assistantResponses);
  const pathname = usePathname();

  const handleClick = async () => {
    if (open) {
      setOpen(false);
    }
    if (
      // isBlocked ||
      infosStatus === "rightFavourite" ||
      infosStatus === "fav" ||
      infosStatus === "conversationFavourite"
    )
      return;
    const searchForBlanckField = responses?.find((a) => a.value === "");
    setResponses((e) => {
      return e.map((val) => {
        if (!val.value) {
          return {
            ...val,
            blank: true,
          };
        } else if (val.value?.length > 160) {
          return {
            ...val,
            overflowCharacter: true,
          };
        } else {
          return val;
        }
      });
    });
    const searchForOveflowCharacter = responses?.find(
      (a) => a.value?.length > 160
    );
    if (searchForBlanckField) {
      setIsError({
        blank: true,
      });
      setOpen(true);
    } else if (searchForOveflowCharacter) {
      setIsError({
        overflowCharacter: true,
      });
      setOpen(true);
    } else {
      setIsError({
        blank: false,
        overflowCharacter: false,
      });
      dispatch(
        updateIsActive({
          isActive: true,
        })
      );
      dispatch(
        updatePopUpStatut({
          popUpStatut: "questionResponses",
        })
      );
      dispatch(
        updateAssistantReponses({
          assistantId: userId,
          body: {
            response: responses.map((val) => val.value),
            projectId:
              infosStatus === "middle" || infosStatus === "messageIcon"
                ? actualClientProjet._id
                : infosStatus === "rightFavourite" || infosStatus === "fav"
                ? actualAvis.projectId._id
                : actualConversationAvis.projectId?._id,
          },
        })
      );
    }
  };

  const path = usePathname();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setResponses((previousState) => {
      let array = [];
      Array.from(
        {
          length:
            infosStatus === "middle" || infosStatus === "messageIcon"
              ? actualClientProjet?.questions?.length
              : infosStatus === "rightFavourite" || infosStatus === "fav"
              ? actualAvis.projectId.questions?.length
              : actualConversationAvis.projectId.questions?.length,
        },
        (_, index) =>
          (array = [
            ...array,
            { value: "", overflowCharacter: false, blank: false },
          ])
      );
      return array;
    });
  }, []);

  const questions =
    infosStatus === "middle" || infosStatus === "messageIcon"
      ? actualClientProjet?.questions
      : infosStatus === "rightFavourite" || infosStatus === "fav"
      ? actualAvis.projectId.questions
      : actualConversationAvis.projectId.questions;
  useEffect(() => {
    async function getResponses() {
      const data = await getAssistantResponses(
        userId,
        infosStatus === "middle" || infosStatus === "messageIcon"
          ? actualClientProjet._id
          : infosStatus === "rightFavourite" || infosStatus === "fav"
          ? actualAvis.projectId._id
          : actualConversationAvis.projectId._id
      );

      if (data.response !== null) {
        dispatch(
          updateAssistantReponses({
            isResponsesSent: true,
          })
        );
      } else {
        dispatch(
          updateAssistantReponses({
            isResponsesSent: false,
          })
        );
      }

      const blocked = await searchUserBlocked(
        userId,
        infosStatus === "middle" || infosStatus === "messageIcon"
          ? actualClientProjet.clientId._id
          : infosStatus === "rightFavourite" || infosStatus === "fav"
          ? actualAvis.projectId.clientId._id
          : actualConversationAvis.projectId.clientId._id
      );
    }
    getResponses();
  }, [
    currentPage,
    actualClientIndex,
    actualAvis,
    actualConversationAvis,
    isResponsesSent,
  ]);

  const handleChange = (index, event) => {
    setResponses((prev) => {
      const tab = prev.map((val, i) => {
        if (i === index) {
          if (event.target.value?.length > 160) {
            return {
              value: event.target.value.slice(0, 160),
            };
          } else {
            return {
              value: event.target.value,
            };
          }
        } else {
          return val;
        }
      });

      return tab;
    });
  };

  return (
    <div className={`${styles.container} scr`}>
      {!isResponsesSent ? (
        <>
          <div className={styles.grid}>
            {questions?.map((q, i) => (
              <div key={i} className={styles.cntq}>
                <label htmlFor="">{q}</label>
                <textarea
                  className={
                    responses[i]?.blank || responses[i]?.overflowCharacter
                      ? "error-response"
                      : "scr"
                  }
                  rows={5}
                  onChange={(e) => handleChange(i, e)}
                  readOnly={
                    // path === "/mes-avis" &&
                    infosStatus === "conversationFavourite" ||
                    infosStatus === "rightFavourite" ||
                    infosStatus === "fav"
                  }
                  value={responses[i]?.value}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>Réponses envoyées</div>
      )}
      <div className={styles.bot}>
        {pathname !== "/mes-avis" ? (
          <>
            <i
              className={
                (actualClientIndex === 0 &&
                  currentPage === 1 &&
                  infosStatus === "middle") ||
                ((infosStatus === "rightFavourite" || infosStatus === "fav") &&
                  index === 0) ||
                (infosStatus === "conversationFavourite" &&
                  conversationAvisIndex === 0)
                  ? styles.disable
                  : null
              }
              onClick={() => {
                if (infosStatus === "middle" || infosStatus === "messageIcon") {
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
                } else if (
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
                        conversationAvis[conversationAvisIndex - 1]?.projectId
                          .clientId,
                    })
                  );
                }
                dispatch(
                  updateAssistantReponses({
                    isResponsesSent: false,
                  })
                );
              }}
            >
              <BiSolidLeftArrow size={"1.5rem"} />
            </i>
            {!isResponsesSent && (
              <>
                <div className="assBtn">
                  <Button
                    onClick={handleClick}
                    sx={{
                      background:
                        // isBlocked ||
                        infosStatus == "rightFavourite" ||
                        infosStatus == "fav" ||
                        infosStatus == "conversationFavourite"
                          ? "#b9b9b9"
                          : "#badf5b",
                      pointerEvents:
                        (infosStatus == "rightFavourite" ||
                          infosStatus == "fav" ||
                          infosStatus == "conversationFavourite") &&
                        "none",
                    }}
                    variant="contained"
                  >
                    Soumettre
                  </Button>
                </div>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {isError.blank
                      ? "Veuillez répondre à toutes le questions"
                      : isError.overflowCharacter && "Maximum 160 caractères"}
                  </Alert>
                </Snackbar>
              </>
            )}
            <i
              className={
                (currentPage === pageLength &&
                  lastClientIndex === actualClientIndex) ||
                ((infosStatus === "rightFavourite" || infosStatus === "fav") &&
                  index === length - 1) ||
                (infosStatus === "conversationFavourite" &&
                  conversationAvisIndex === conversationAvisLength - 1)
                  ? styles.disable
                  : ""
              }
              onClick={() => {
                if (infosStatus === "middle" || infosStatus === "messageIcon") {
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
                } else if (
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
                        conversationAvis[conversationAvisIndex + 1].projectId
                          .clientId,
                    })
                  );
                }
                dispatch(
                  updateAssistantReponses({
                    isResponsesSent: false,
                  })
                );
              }}
            >
              <BiSolidRightArrow size={"1.5rem"} />
            </i>
          </>
        ) : (
          <>
            <Tooltip title={tooltip?.left} placement="top-end">
              <i onClick={() => setIsActive({ obj: tooltip?.lAbr })}>
                <BiSolidLeftArrow size={"1.5rem"} />
              </i>
            </Tooltip>
            {!isResponsesSent && (
              <>
                <div
                  style={{
                    pointerEvents:
                      // isBlocked ||
                      infosStatus == "rightFavourite" ||
                      infosStatus == "fav" ||
                      infosStatus == "conversationFavourite"
                        ? "none"
                        : "",
                  }}
                  className={"assBtn"}
                >
                  <Button
                    onClick={handleClick}
                    sx={{
                      background:
                        // isBlocked ||
                        infosStatus == "rightFavourite" ||
                        infosStatus == "fav" ||
                        infosStatus == "conversationFavourite"
                          ? "#b9b9b9"
                          : "#badf5b",
                      pointerEvents:
                        // isBlocked ||
                        infosStatus == "rightFavourite" ||
                        infosStatus == "fav" ||
                        infosStatus == "conversationFavourite"
                          ? "none"
                          : "",
                    }}
                    variant="contained"
                    disabled
                  >
                    Soumettre
                  </Button>
                </div>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity={
                      isError.blank || isError.overflowCharacter
                        ? "error"
                        : "success"
                    }
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {isError.blank
                      ? "Veuillez répondre à toutes le questions"
                      : isError.overflowCharacter && "Maximum 160 caractères"}
                  </Alert>
                </Snackbar>
              </>
            )}
            <Tooltip title={tooltip?.right} placement="top-end">
              <i onClick={() => setIsActive({ obj: tooltip?.rAbr })}>
                <BiSolidRightArrow size={"1.5rem"} />
              </i>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default AssistantQuestions;
