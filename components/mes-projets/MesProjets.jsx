/** @format */

"use client";

// styles
import styles from "../../styles/mes-projets/MesProjets.module.css";
import style from "@/styles/projet/Projet.module.css";
import { CSSTransition } from "react-transition-group";

// react
import { UidContext } from "@/context/UidContext";
import { useContext, useEffect, useState, useRef } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { fetchProjets, setActualProject } from "@/redux/slices/projetSlice";

// components
import DT from "../projet/DT";
import Desc from "../projet/Desc";
import ClientOnly from "../ClientOnly";
import MenuProjet from "../home/MenuProjet";
import ProjectInfos from "../projet/ProjectInfos";
import InfoHub from "../home/infohub/InfoHub";

// icons
import { TbBulb } from "react-icons/tb";
import { CgClose } from "react-icons/cg";
import { HiPencilAlt } from "react-icons/hi";
import { isEmpty } from "@/lib/utils/isEmpty";
import { VscDebugRestart } from "react-icons/vsc";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

// controllers
import {
  deleteProject,
  getAssistantsProjectController,
  getProjetController,
  updateProjet,
} from "@/lib/controllers/projet.controller";

const MENU = {
  DESC: 0,
  INFOS: 1,
  DT: 2,
};

export default function MesProjets() {
  const { projets, actualProject } = useSelector((state) => state.projets);
  const { userType } = useSelector((state) => state.persistInfos);
  const { setLoadingBar, userId } = useContext(UidContext);

  const {
    isInfos,
    setIsInfos,
    render,
    setRender,
    infosStatus,
    setInfosStatus,
    setRefetchDataCount,
  } = useContext(UidContext);
  const { userInfos } = useSelector((state) => state.clientAvis);

  const dispatch = useDispatch();
  const nbTitle = 5;

  const [isActive, setIsActive] = useState({ obj: "avis" });
  const [actualProjectId, setActualProjectId] = useState("");
  const [isFinish, setIsFinish] = useState(false);
  const [activeCh, setActiveCh] = useState(false);
  const [actualIndex, setActualIndex] = useState(2);
  const [assistants, setAssistants] = useState([]);
  const [active, setActive] = useState(MENU.DESC);
  const [isValidDisp, setIsValidDisp] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // desc
  const [projetctName, setProjectName] = useState({
    obj: actualProject?.name || "",
    value: false,
  });
  const [projectDesc, setProjectDesc] = useState({
    obj: actualProject?.desc || "",
    value: false,
  });
  const [projectStatut, setProjectStatut] = useState({
    obj: actualProject?.statut || null,
  });
  const [projectDuration, setProjectDuration] = useState({
    obj: actualProject?.duree || null,
    obj: actualProject?.duree || null,
  });
  const [isSubmit, setIsSubmit] = useState({ is: false, value: false });
  const [newProjet, setNewProjet] = useState(actualProject);
  const [showPopUp, setShowPopUP] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setNewProjet(actualProject);
  }, [actualIndex, actualProject]);
  // infos
  const [newPays, setNewPays] = useState({
    obj: actualProject?.pays,
    value: false,
  });
  const [newVille, setNewVille] = useState({
    obj: actualProject?.ville,
    value: false,
  });
  const [newProvince, setNewProvince] = useState({
    obj: actualProject?.province,
    value: false,
  });
  const [newCmp, setNewCmp] = useState({
    obj: actualProject?.competenceVirtuelle,
    value: false,
  });
  const [residence, setResidence] = useState({
    pays: "",
    ville: [],
    province: "",
  });
  const [newLang, setNewLang] = useState({
    obj: actualProject?.lang,
    sgl: actualProject?.lang === "en" ? "Anglais" : "Français",
    value: false,
  });
  const [newStatutPro, setNewStatutPro] = useState({
    obj: actualProject?.statutProfessionnelle,
    value: false,
  });
  const [newExpPro, setNewExpPro] = useState({
    obj: actualProject?.experiencePro,
    value: false,
  });

  const [newApp, setNewApp] = useState({
    obj: actualProject?.applicationWeb,
    value: false,
  });

  // D & T
  const [newDelai, setNewDelai] = useState({
    obj: actualProject?.delai,
    value: false,
  });
  const [newTh, setNewTh] = useState({
    obj: actualProject?.tarif,
    value: false,
  });
  const [newBenevolat, setNewBenevolat] = useState({
    obj: actualProject?.benevolat,
    value: false,
  });
  const [newMTF, setNewMTF] = useState({
    obj: actualProject?.montantForfaitaire,
    value: false,
  });
  const [newDisp, setNewDisp] = useState({
    obj: actualProject?.disponibilite || [],
    value: false,
  });
  useEffect(() => {
    setProjectName({ obj: actualProject?.name || "", value: false });
    setProjectDesc({
      obj: actualProject?.desc || "",
      value: false,
    });
    setProjectStatut({
      obj: actualProject?.statut || null,
    });
    setProjectDuration({
      obj: actualProject?.duree || null,
    });
    setNewStatutPro({
      obj: actualProject?.statutProfessionnelle,
      value: false,
    });
    setNewLang({
      obj: actualProject?.lang,
      sgl: actualProject?.lang === "en" ? "Anglais" : "Français",
      value: false,
    });
    setResidence({
      pays: "",
      ville: [],
      province: "",
    });
    setNewCmp({
      obj: actualProject?.competenceVirtuelle,
      value: false,
    });
    setNewApp({
      obj: actualProject?.applicationWeb,
      value: false,
    });
    setNewProvince({
      obj: actualProject?.province,
      value: false,
    });
    setNewVille({
      obj: actualProject?.ville,
      value: false,
    });
    setNewPays({
      obj: actualProject?.pays,
      value: false,
    });
    setNewExpPro({
      obj: actualProject?.experiencePro,
      value: false,
    });
    setNewDelai({
      obj: actualProject?.delai,
      value: false,
    });
    setNewTh({
      obj: actualProject?.tarif,
      value: false,
    });
    setNewBenevolat({
      obj: actualProject?.benevolat,
      value: false,
    });
    setNewMTF({
      obj: actualProject?.montantForfaitaire,
      value: false,
    });
    setNewDisp({
      obj: actualProject?.disponibilite || [],
      value: false,
    });
  }, [actualProject]);
  useEffect(() => {
    setProjectName({ obj: actualProject?.name || "", value: false });
    setProjectDesc({
      obj: actualProject?.desc || "",
      value: false,
    });
    setProjectStatut({
      obj: actualProject?.statut || null,
    });
    setProjectDuration({
      obj: actualProject?.duree || null,
    });
    setNewStatutPro({
      obj: actualProject?.statutProfessionnelle,
      value: false,
    });
    setNewLang({
      obj: actualProject?.lang,
      sgl: actualProject?.lang === "en" ? "Anglais" : "Français",
      value: false,
    });
    setResidence({
      pays: "",
      ville: [],
      province: "",
    });
    setNewCmp({
      obj: actualProject?.competenceVirtuelle,
      value: false,
    });
    setNewApp({
      obj: actualProject?.applicationWeb,
      value: false,
    });
    setNewProvince({
      obj: actualProject?.province,
      value: false,
    });
    setNewVille({
      obj: actualProject?.ville,
      value: false,
    });
    setNewPays({
      obj: actualProject?.pays,
      value: false,
    });
    setNewExpPro({
      obj: actualProject?.experiencePro,
      value: false,
    });
    setNewDelai({
      obj: actualProject?.delai,
      value: false,
    });
    setNewTh({
      obj: actualProject?.tarif,
      value: false,
    });
    setNewBenevolat({
      obj: actualProject?.benevolat,
      value: false,
    });
    setNewMTF({
      obj: actualProject?.montantForfaitaire,
      value: false,
    });
    setNewDisp({
      obj: actualProject?.disponibilite || [],
      value: false,
    });
  }, [actualProject]);

  const [canUpdate, setCanUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onBack = () => {
    setActive((value) => value - 1);
  };

  const onNext = () => {
    setActive((value) => value + 1);
  };

  const [deleted, setDeleted] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (isActive.obj === "anc") {
        const data = await fetch(`/api/projet/${userId}`, {
          method: "PATCH",
        });
        const a = await data.json();
        setProjectName({
          obj: a.projets[actualIndex]?.name || "",
          value: false,
        });
        setProjectDesc({
          obj: a.projets[actualIndex]?.desc || "",
          value: false,
        });
        setProjectStatut({
          obj: a.projets[actualIndex]?.statut || null,
        });

        setProjectDuration({
          obj: a.projets[actualIndex]?.duree || null,
        });
        setNewStatutPro({
          obj: a.projets[actualIndex]?.statutProfessionnelle,
          value: false,
        });
        setNewExpPro({
          obj: a.projets[actualIndex]?.experiencePro,
          value: false,
        });
        setNewPays({
          obj: a.projets[actualIndex]?.pays,
          value: false,
        });
        setNewVille({
          obj: a.projets[actualIndex]?.ville,
          value: false,
        });
        setNewProvince({
          obj: a.projets[actualIndex]?.province,
          value: false,
        });
        setNewLang({
          obj: a.projets[actualIndex]?.lang,
          sgl: a.projets[actualIndex]?.lang === "en" ? "Anglais" : "Français",
          value: false,
        });
        setNewDisp({
          obj: a.projets[actualIndex]?.disponibilite || [],
          value: false,
        });
        setNewDelai({
          obj: a.projets[actualIndex]?.delai,
          value: false,
        });
        setNewTh({
          obj: a.projets[actualIndex]?.tarif,
          value: false,
        });
        setNewMTF({
          obj: a.projets[actualIndex]?.montantForfaitaire,
          value: false,
        });
        setNewBenevolat({
          obj: a.projets[actualIndex]?.benevolat,
          value: false,
        });
        setDeleted(a.projets);
      } else {
        setProjectName({ obj: actualProject?.name || "", value: false });
        setProjectDesc({
          obj: actualProject?.desc || "",
          value: false,
        });
        setProjectStatut({
          obj: actualProject?.statut || null,
        });
        setProjectDuration({
          obj: actualProject?.duree || null,
        });
        setNewStatutPro({
          obj: actualProject?.statutProfessionnelle,
          value: false,
        });
        setNewExpPro({
          obj: actualProject?.experiencePro,
          value: false,
        });
        setNewPays({
          obj: actualProject?.pays,
          value: false,
        });
        setNewVille({
          obj: actualProject?.ville,
          value: false,
        });
        setNewProvince({
          obj: actualProject?.province,
          value: false,
        });
        setNewLang({
          obj: actualProject?.lang,
          sgl: actualProject?.lang === "en" ? "Anglais" : "Français",
          value: false,
        });
        setNewDisp({
          obj: actualProject?.disponibilite || [],
          value: false,
        });
        setNewDelai({
          obj: actualProject?.delai,
          value: false,
        });
        setNewTh({
          obj: actualProject?.tarif,
          value: false,
        });
        setNewMTF({
          obj: actualProject?.montantForfaitaire,
          value: false,
        });
        setNewBenevolat({
          obj: actualProject?.benevolat,
          value: false,
        });
      }
    }
    fetchData();
  }, [isActive.obj, actualIndex]);
  const [generatedProject, setGeneratedProject] = useState({
    number: 0,
    showPopUp: false,
  });

  // useEffect(() => {
  //   (async () => {
  //     if (userType === "client") {
  //       setLoadingBar(20);
  //       const res = await getProjetController(userId);
  //       setLoadingBar(60);
  //       if (res?.projets) {
  //         dispatch(
  //           fetchProjets({
  //             projets: res.projets,
  //             projet: res.actualProject.actualProject,
  //           })
  //         );
  //         setActualProjectId(res.actualProject._id);
  //         setLoadingBar(100);
  //         setLoadingBar(0);
  //       } else {
  //         setLoadingBar(100);
  //         setIsFinish(true);
  //       }
  //     }
  //   })();
  // }, [userType]);

  useEffect(() => {
    if (isFinish) {
      setTimeout(() => {
        setLoadingBar(0);
        setIsFinish(false);
      }, 500);
    }
  }, [isFinish]);

  useEffect(() => {
    if (activeCh) {
      const option = document.getElementById("option");
      const handleClickOutside = (e) => {
        if (e.target.id !== option) {
          setActiveCh(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [activeCh]);

  const handleReset = () => {
    setProjectName({ obj: actualProject?.name || "", value: false });
    setProjectDesc({
      obj: actualProject?.desc || "",
      value: false,
    });
    setProjectStatut({
      obj: actualProject?.statut || null,
    });
    setProjectDuration({
      obj: actualProject?.duree || null,
    });
    setNewStatutPro({
      obj: actualProject?.statutProfessionnelle,
      value: false,
    });
    setNewLang({
      obj: actualProject?.lang,
      sgl: actualProject?.lang === "en" ? "Anglais" : "Français",
      value: false,
    });
    setResidence({
      pays: "",
      ville: [],
      province: "",
    });
    setNewCmp({
      obj: actualProject?.competenceVirtuelle,
      value: false,
    });
    setNewApp({
      obj: actualProject?.applicationWeb,
      value: false,
    });
    setNewProvince({
      obj: actualProject?.province,
      value: false,
    });
    setNewVille({
      obj: actualProject?.ville,
      value: false,
    });
    setNewPays({
      obj: actualProject?.pays,
      value: false,
    });
    setNewExpPro({
      obj: actualProject?.experiencePro,
      value: false,
    });
    setNewDelai({
      obj: actualProject?.delai,
      value: false,
    });
    setNewTh({
      obj: actualProject?.tarif,
      value: false,
    });
    setNewBenevolat({
      obj: actualProject?.benevolat,
      value: false,
    });
    setNewMTF({
      obj: actualProject?.montantForfaitaire,
      value: false,
    });
    setNewDisp({
      obj: actualProject?.disponibilite || [],
      value: false,
    });

    setIsEditable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const data = await updateProjet(newProjet._id, newProjet);
    setNewProjet(data.projet);
    dispatch(
      setActualProject({
        projet: data.projet,
      })
    );
    setGeneratedProject({
      number: data.newProjectGenerated,
      showPopUp: true,
    });
    setIsEditable(false);
  };

  return (
    <ClientOnly activeTopLoading>
      <div className={styles.container}>
        <CSSTransition
          in={showPopUp || generatedProject.showPopUp}
          timeout={350}
          classNames={"pcf"}
          unmountOnExit
          nodeRef={ref}
        >
          <div ref={ref} className={style.popupContainer}>
            <div className={`${style.popupMsg} cft`}>
              <div className={style.popupClose}>
                <i
                  onClick={() => {
                    if (!showPopUp) {
                      setGeneratedProject({
                        number: 0,
                        showPopUp: false,
                      });
                      return;
                    }
                    setShowPopUP(false);
                  }}
                >
                  <CgClose />
                </i>
              </div>
              <div className={style.hr} />
              <div className={style.popupMiddle}>
                <div className={style.popupContenu}>
                  <p>
                    {showPopUp
                      ? "êtes-vous sûr(e) de vouloir supprimer définitivement ce projet"
                      : `${
                          generatedProject.number === 0
                            ? "Suite à votre (vos) modification (s), aucun nouveau profils n'a été trouvé"
                            : `Suite à votre (vos) modification (s), ${
                                generatedProject.number
                              }  ${
                                generatedProject.number > 1
                                  ? "nouveaux profils ont été générés"
                                  : "nouveau profil a été généré"
                              }`
                        }`}
                  </p>
                </div>
                <div className={style.popupButton}>
                  {showPopUp ? (
                    <>
                      <button
                        style={{
                          background: "#ff5757",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPopUP(false);
                        }}
                      >
                        NON
                      </button>
                      <button
                        style={{
                          background: "#badf5b",
                          marginLeft: "4px",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsLoading(true);
                          async function utils() {
                            await deleteProject(actualProject?._id);
                            setRefetchDataCount((a) => a + 1);
                            setShowPopUP(false);
                            setIsLoading(false);
                          }
                          utils();
                        }}
                      >
                        OUI{isLoading && "..."}
                      </button>
                    </>
                  ) : (
                    <button
                      style={{
                        background: "#badf5b",
                        marginLeft: "4px",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setGeneratedProject({
                          number: 0,
                          showPopUp: false,
                        });
                      }}
                    >
                      OK
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
        <div className={styles.middle}>
          <div style={{ height: "2.5rem" }}>
            <MenuProjet
              nbTitle={nbTitle}
              actualProject={actualProject}
              actualIndex={actualIndex}
              setActualIndex={setActualIndex}
              actualProjectId={actualProjectId}
              setActualProjectId={setActualProjectId}
              projets={isActive.obj === "anc" ? deleted : projets}
              isActive={isActive}
            />
          </div>
          {!isInfos && (
            <div className={styles.lmd}>
              <div className={styles.tmp}>
                <label htmlFor="">{actualProject?.dateString}</label>
                {isEditable && (
                  <div className="mes-projets--title">
                    <span>
                      <HiPencilAlt size={"1.4rem"} />{" "}
                    </span>
                    <label style={{ color: "#036eff" }}>
                      Modifier le projet
                    </label>
                  </div>
                )}
                <label htmlFor="">
                  <i onClick={() => setIsEditable((value) => !value)}>
                    <HiPencilAlt
                      color={isEditable && "#036eff"}
                      size={"1.25rem"}
                    />
                  </i>
                  <i
                    onClick={() => {
                      // try {
                      //   setLoadingBar(30);
                      //   console.log(actualProjectId, userId, projets);
                      //   await fetch(`/api/projet/delete/${actualProjectId}`, {
                      //     method: "PATCH",
                      //   });
                      //   setLoadingBar(70);
                      //   const a = await fetch(`/api/projet/${userId}`);
                      //   const data = await a.json();
                      //   setLoadingBar(80);
                      //   dispatch(
                      //     fetchProjets({
                      //       projets: data.projets,
                      //       projet: data.actualProject,
                      //     })
                      //   );
                      //   setActualProjectId(data.actualProject?._id);
                      //   console.log(data.actualProject?._id, data);
                      //   setLoadingBar(100);
                      //   setLoadingBar(0);
                      // } catch (error) {
                      //   console.log(error);
                      // }
                      setShowPopUP(true);
                    }}
                  >
                    <CgClose size={"1.25rem"} />
                  </i>
                </label>
              </div>
              <div className={styles.cmd}>
                <div className={styles.mnd}>
                  <div
                    onClick={() => setActive(0)}
                    className={
                      active === MENU.DESC
                        ? `${styles.active} c-pointer`
                        : "c-pointer"
                    }
                  >
                    <label>Description du projet</label>
                  </div>
                  <div
                    onClick={() => setActive(1)}
                    className={
                      active === MENU.INFOS
                        ? `${styles.active} c-pointer`
                        : "c-pointer"
                    }
                  >
                    <label>Informations recherchées</label>
                  </div>
                  <div
                    onClick={() => setActive(2)}
                    className={
                      active === MENU.DT
                        ? `${styles.active} c-pointer`
                        : "c-pointer"
                    }
                  >
                    <label>Disponibilités & Tarifications</label>
                  </div>
                </div>

                {active === MENU.DESC && (
                  <>
                    <div className={styles.op}>
                      <Desc
                        projetctName={projetctName}
                        setProjectName={setProjectName}
                        projectDesc={projectDesc}
                        setProjectDesc={setProjectDesc}
                        projectStatut={projectStatut}
                        setProjectStatut={setProjectStatut}
                        projectDuration={projectDuration}
                        setProjectDuration={setProjectDuration}
                        setIsValidDisp={setIsValidDisp}
                        newProjet={newProjet}
                        setNewProjet={setNewProjet}
                        isSubmit={isSubmit}
                        readOnly={!isEditable}
                      />
                    </div>
                  </>
                )}
                {active === MENU.INFOS && (
                  <>
                    <div className={styles.op}>
                      <ProjectInfos
                        newCmp={newCmp}
                        setNewCmp={setNewCmp}
                        newPays={newPays}
                        setNewPays={setNewPays}
                        newVille={newVille}
                        setNewVille={setNewVille}
                        newProvince={newProvince}
                        setNewProvince={setNewProvince}
                        residence={residence}
                        setResidence={setResidence}
                        newStatutPro={newStatutPro}
                        setNewStatutPro={setNewStatutPro}
                        setNewLang={setNewLang}
                        newLang={newLang}
                        newApp={newApp}
                        setNewApp={setNewApp}
                        newExpPro={newExpPro}
                        setNewExpPro={setNewExpPro}
                        setIsValidDisp={setIsValidDisp}
                        isSubmit={isSubmit}
                        newProjet={newProjet}
                        setNewProjet={setNewProjet}
                        readOnly={!isEditable}
                      />
                    </div>
                  </>
                )}
                {active === MENU.DT && (
                  <>
                    <div className={styles.op}>
                      <DT
                        newDelai={newDelai}
                        setNewDelai={setNewDelai}
                        newTh={newTh}
                        setNewTh={setNewTh}
                        newBenevolat={newBenevolat}
                        setNewBenevolat={setNewBenevolat}
                        newMTF={newMTF}
                        setNewMTF={setNewMTF}
                        canUpdate={canUpdate}
                        setCanUpdate={setCanUpdate}
                        isValidDisp={isValidDisp}
                        setIsValidDisp={setIsValidDisp}
                        newDisp={newDisp}
                        setNewDisp={setNewDisp}
                        newProjet={newProjet}
                        setNewProjet={setNewProjet}
                        isSubmit={isSubmit}
                        isLoading={isLoading}
                        handleSubmit={handleSubmit}
                        readOnly={!isEditable}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={styles.bottom}>
                <div>
                  {isEditable && (
                    <button
                      className={!isEditable ? "pen" : null}
                      type="reset"
                      onClick={handleReset}
                    >
                      <label>Annuler</label>
                    </button>
                  )}
                  <div className={styles.switch}>
                    <i
                      onClick={onBack}
                      className={
                        active === MENU.DESC ? `${styles.disbl}` : null
                      }
                    >
                      <FaCircleArrowLeft size={"1.8rem"} />
                    </i>
                    <i
                      onClick={onNext}
                      className={
                        userType === "client"
                          ? active === MENU.DT
                            ? `${styles.disbl}`
                            : null
                          : active === MENU.OFFRES
                          ? `${styles.disbl}`
                          : null
                      }
                    >
                      <FaCircleArrowRight size={"1.8rem"} />
                    </i>
                  </div>
                  {isEditable && (
                    <button
                      className={!isEditable ? `${styles.dis} ` : null}
                      onClick={handleSubmit}
                      type="submit"
                    >
                      <label>Mettre à jour</label>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {isInfos && (
            <div className={styles.lmd}>
              <InfoHub
                assistants={assistants}
                setAssistants={setAssistants}
                setIsInfos={setIsInfos}
                userInfos={userInfos}
                render={render}
                setRender={setRender}
                infosStatus={infosStatus}
                setInfosStatus={setInfosStatus}
              />
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
