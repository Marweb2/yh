/** @format */
"use client";
// styles
import styles from "../../styles/home/Avis.module.css";

//MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// components
import ClientOnly from "@/components/ClientOnly";
import Image from "next/image";
import { isEmpty } from "@/lib/utils/isEmpty";

// react
import { UidContext } from "@/context/UidContext";
import { useContext, useEffect, useState } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActualAssistant } from "@/redux/slices/projetSlice";

// icons
import { CgClose } from "react-icons/cg";
import { TfiEmail } from "react-icons/tfi";
import { GoStopwatch } from "react-icons/go";
import { AiOutlineStar } from "react-icons/ai";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

// controllers
import {
  getAssistantsProjectController,
  deleteAvis,
} from "@/lib/controllers/projet.controller";
import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
} from "@/redux/slices/popUpSlice";
import {
  updateClientAvis,
  updateClientAvisInfos,
} from "@/redux/slices/clientAvisPotentielSlice";

// constants
import { perPage } from "@/lib/constants";
import AssistantAvis from "../AssistantAvis/AssistantAvis";
import { updateProjets } from "@/redux/slices/clientProjectSlice";

function calculerNombrePages(total_elements, elements_par_page) {
  let nombre_pages = total_elements / elements_par_page;

  if (total_elements % elements_par_page !== 0) {
    nombre_pages = Math.ceil(nombre_pages);
  }

  return nombre_pages;
}

export default function Avis({
  assistants,
  userInfos,
  setUserInfos,
  setIsInfos,
  setRenderPage,
  setInfosStatus,
}) {
  const { userType } = useSelector((state) => state.persistInfos);
  const { actualProject } = useSelector((state) => state.projets);
  const { deleteAvisAssistant } = useSelector((state) => state.popUp);
  const { avis, taillePage, pageActuelle } = useSelector(
    (state) => state.clientAvis
  );

  const { clientProjets, lastClientIndex, pageLength, currentPage } =
    useSelector((state) => state.clientProject);

  const { setLoadingBar, userId } = useContext(UidContext);
  const dispatch = useDispatch();

  const [isFinish, setIsFinish] = useState(false);
  const [assistantId, setAssistantId] = useState("");

  const handleClickOpen = (id) => {
    setAssistantId(id);
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
    if (
      deleteAvisAssistant.id === assistantId &&
      deleteAvisAssistant.accept === true
    ) {
      async function deleteFavourite() {
        const data = await deleteAvis(actualProject._id, assistantId, userId);
        console.log(data);
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
        if (taillePage === pageActuelle && avis.length === 1) {
          dispatch(
            updateClientAvisInfos({
              pageActuelle: 1,
            })
          );
        }

        setRenderPage((a) => a + 1);
      }
      deleteFavourite();
    }
  }, [deleteAvisAssistant.accept]);

  useEffect(() => {
    if (isFinish) {
      setTimeout(() => {
        setLoadingBar(0);
        setIsFinish(false);
      }, 500);
    }
  }, [isFinish]);

  const getActualIndex = ({ assistantsId, assistantId }) => {
    const actualIndex = assistantsId.findIndex((p) => p._id === assistantId);
    return actualIndex;
  };

  return (
    <ClientOnly>
      <div className={styles.container}>
        {avis?.length > 0 && userType === "client" ? (
          <>
            <div className={styles.avisCont}>
              <div
                className={
                  avis?.length === 1
                    ? styles.oneAvis
                    : avis?.length === 2
                    ? styles.twoAvis
                    : styles.content
                }
                style={{
                  color: "#c9c9c9",
                }}
              >
                {avis?.map(
                  (
                    {
                      assistantId,
                      correspondance,
                      dateString,
                      _id,
                      assistant_choice,
                      isNewAvis,
                    },
                    i
                  ) => (
                    <div key={i} className={styles.item}>
                      <div
                        className={
                          userInfos._id === assistantId?._id
                            ? `${styles.contAss} ${styles.active}`
                            : `${styles.contAss}`
                        }
                      >
                        <div className={styles.top}>
                          <div className={styles.cont}>
                            <div className={styles.left}>
                              <span /*className="date avis-date"*/>
                                {/* <span>{dateString?.split("-")[0]}</span>
                                <p>.</p>
                                <span>{dateString?.split("-")[1]}</span> */}
                                {dateString}
                              </span>
                              {/* <p className={styles.sym}>!</p> */}
                              <label htmlFor="">{correspondance}%</label>
                            </div>
                            <div className={styles.right}>
                              <i
                                style={{
                                  color:
                                    actualProject.isClosed ||
                                    assistant_choice === "not_interested"
                                      ? // assistant_choice === "no_choice"
                                        "#ff5757"
                                      : "#badf5b",
                                  cursor: "pointer",
                                }}
                              >
                                <GoStopwatch size={"1.15rem"} />
                              </i>
                              <i
                                onClick={() => {
                                  dispatch(
                                    setActualAssistant({
                                      actualAssistant: assistantId,
                                      actualIndex: getActualIndex({
                                        assistantsId: assistants,
                                        assistantId: assistantId?._id,
                                      }),
                                      compatibilite: correspondance,
                                    })
                                  );
                                  dispatch(
                                    updateClientAvisInfos({
                                      indexAvisSelectionee: i,
                                      idAssistantSelectionee: assistantId?._id,
                                      userInfos: assistantId,
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
                                style={{
                                  cursor: "pointer",
                                }}
                                className={styles.close}
                              >
                                <CgClose
                                  onClick={() => handleClickOpen(_id)}
                                  size={"1.15rem"}
                                />
                              </i>
                            </div>
                          </div>
                          <div className={styles.hr} />
                        </div>
                        <div
                          onClick={() => {
                            dispatch(
                              setActualAssistant({
                                actualAssistant: assistantId,
                                actualIndex: getActualIndex({
                                  assistantsId: assistants,
                                  assistantId: assistantId?._id,
                                }),
                                compatibilite: correspondance,
                              })
                            );
                            dispatch(
                              updateClientAvisInfos({
                                indexAvisSelectionee: i,
                                idAssistantSelectionee: assistantId?._id,
                                userInfos: assistantId,
                              })
                            );
                            setIsInfos(true);
                            setInfosStatus("middle");
                          }}
                          className={styles.contcontenudle}
                        >
                          {isNewAvis && <p className="new">Nouveau</p>}
                          <div className={styles.imgCont}>
                            <Image
                              src={
                                !isEmpty(assistantId?.image)
                                  ? assistantId?.image[0]
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
                                {assistantId?.username}, {assistantId?.name}
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
                                {assistantId?.avis?.length === 0 ? (
                                  <>aucun avis</>
                                ) : (
                                  <>{assistantId?.avis?.length} avis</>
                                )}
                              </span>
                            </div>
                            <p>
                              Statut professionnel :{" "}
                              <span>
                                {!isEmpty(assistantId?.statutProfessionnelle)
                                  ? assistantId?.statutProfessionnelle
                                  : " aucun"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.bot}>
              {taillePage > 1 && (
                <section style={{ display: "flex" }}>
                  <div>
                    <i
                      onClick={() => {
                        dispatch(
                          updateClientAvisInfos({
                            pageActuelle: pageActuelle - 1,
                          })
                        );
                      }}
                      style={{
                        display: pageActuelle === 1 ? "none" : "block",
                        cursor: "pointer",
                      }}
                    >
                      <BiSolidLeftArrow size={"1.25rem"} />
                    </i>
                  </div>
                  <div>
                    {Array.from(
                      {
                        length: taillePage,
                      },
                      (_, index) => (
                        <i
                          className={`${
                            pageActuelle === index + 1 && styles.active
                          }`}
                          onClick={() =>
                            dispatch(
                              updateClientAvisInfos({
                                pageActuelle: index + 1,
                              })
                            )
                          }
                          key={index}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {index + 1}
                        </i>
                      )
                    )}
                  </div>
                  <div>
                    <i
                      onClick={() => {
                        dispatch(
                          updateClientAvisInfos({
                            pageActuelle: pageActuelle + 1,
                          })
                        );
                      }}
                      style={{
                        display: pageActuelle === taillePage ? "none" : "block",
                        cursor: "pointer",
                      }}
                    >
                      <BiSolidRightArrow size={"1.25rem"} />
                    </i>
                  </div>
                </section>
              )}
            </div>
          </>
        ) : userType === "assistant" && clientProjets?.length ? (
          <>
            <div className={styles.avisCont}>
              <div
                className={
                  clientProjets?.length === 1
                    ? styles.oneAvis
                    : clientProjets?.length === 2
                    ? styles.twoAvis
                    : styles.content
                }
                style={{
                  color: "#c9c9c9",
                }}
              >
                {clientProjets?.map((a, i) => {
                  return (
                    <AssistantAvis
                      setIsInfos={setIsInfos}
                      setUserInfos={setUserInfos}
                      key={i}
                      project={a}
                      index={i}
                      setInfosStatus={setInfosStatus}
                      setRenderPage={setRenderPage}
                    />
                  );
                })}
              </div>
            </div>

            <div className={styles.bot}>
              {pageLength > 1 && (
                <section style={{ display: "flex" }}>
                  <div>
                    <i
                      onClick={() => {
                        dispatch(
                          updateProjets({
                            currentPage: currentPage - 1,
                          })
                        );
                      }}
                      style={{
                        display: currentPage === 1 ? "none" : "block",
                        cursor: "pointer",
                      }}
                    >
                      <BiSolidLeftArrow size={"1.25rem"} />
                    </i>
                  </div>
                  <div>
                    {Array.from(
                      {
                        length: pageLength,
                      },
                      (_, index) => (
                        <i
                          className={`${
                            currentPage === index + 1 && styles.active
                          }`}
                          onClick={() => {
                            if (currentPage === index + 1) return;
                            dispatch(
                              updateProjets({
                                currentPage: index + 1,
                              })
                            );
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                          key={index}
                        >
                          {index + 1}
                        </i>
                      )
                    )}
                  </div>
                  <div>
                    <i
                      onClick={() => {
                        dispatch(
                          updateProjets({
                            currentPage: currentPage + 1,
                          })
                        );
                      }}
                      style={{
                        display: currentPage === pageLength ? "none" : "block",
                        cursor: "pointer",
                      }}
                    >
                      <BiSolidRightArrow size={"1.25rem"} />
                    </i>
                  </div>
                </section>
              )}
            </div>
          </>
        ) : (
          <div className={styles.auc}>
            <h1 className="usn">Aucun résultat</h1>
            <label>
              Actuellement, aucun assistant ne correspond au profil recherché.
            </label>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
