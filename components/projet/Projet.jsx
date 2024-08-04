/** @format */

"use client";

// styles
import styles from "../../styles/projet/Projet.module.css";

// components
import ClientOnly from "@/components/ClientOnly";
import ProjectInfos from "./ProjectInfos";
import Desc from "./Desc";
import QS from "./QS";
import DT from "./DT";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useRouter } from "next/navigation";

// icons
import { CgClose } from "react-icons/cg";
import { IoNewspaperOutline } from "react-icons/io5";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

// redux
import { setActualProject } from "@/redux/slices/projetSlice";
import { useDispatch, useSelector } from "react-redux";

// controllers
import { createProjectController } from "@/lib/controllers/projet.controller";
import { questionLength } from "@/lib/constants";
import { isEmpty } from "@/lib/utils/isEmpty";
import { UidContext } from "@/context/UidContext";

const MENU = {
  DESC: 0,
  INFOS: 1,
  DT: 2,
  QS: 3,
};

export default function Projet({ setAssistants }) {
  // desc
  const optionsDesc = ["name", "desc", "budget", "duree"];
  const optionsFacDesc = [""];

  // infos
  const optionsInfos = [
    "competenceVirtuelle",
    "applicationWeb",
    "statutProfessionnelle",
    "experiencePro",
    "pays",
    "province",
    "lang",
  ];
  const optionsFacInfos = ["province"];

  // D & T
  const optionsDT = [
    "delai",
    "disponibilite",
    "tarif",
    "montantForfaitaire",
    "benevolat",
  ];
  const optionsFacDT = ["montantForfaitaire", "benevolat", "delai"];

  const { setLoadingBar, userId, setRefetchDataCount } = useContext(UidContext);
  const { user } = useSelector((state) => state.user);
  const { lang } = useSelector((state) => state.persistInfos);
  const { push } = useRouter();
  const [compValue, setCompValue] = useState("");
  const [paysValue, setPaysValue] = useState("");
  const [appValue, setAppValue] = useState("");

  const ref = useRef();
  const dispatch = useDispatch();

  const initialProject = useMemo(() => {
    return {
      // descritpion
      name: "",
      desc: "",
      duree: "",
      statut: "",

      // infos
      competenceVirtuelle: "",
      applicationWeb: "",
      statutProfessionnelle: "",
      experiencePro: "",
      pays: "",
      ville: "",
      province: "",
      lang,

      // dis & tarif
      delai: null,
      disponibilite: [],
      tarif: null,
      uniteMonaitaire: null,
      montantForfaitaire: null,
      benevolat: null,

      // qs
      questions: [],

      // error
      errorDesc: true,
      errorInfos: true,
      errorDT: true,
      errorQS: true,
    };
  }, []);
  // desc
  const [projectDesc, setProjectDesc] = useState({ obj: "", value: false });
  const [projetctName, setProjectName] = useState({ obj: "", value: false });
  // const [projectBudget, setProjectBudget] = useState({ obj: null });
  const [projectDuration, setProjectDuration] = useState({ obj: null });
  const [projectStatut, setProjectStatut] = useState({ obj: "" });

  // infos
  const [newPays, setNewPays] = useState({ obj: "", value: false });
  const [newVille, setNewVille] = useState({ obj: "", value: false });
  const [newProvince, setNewProvince] = useState({ obj: "", value: false });
  const [newCmp, setNewCmp] = useState({ obj: "", value: false });
  const [residence, setResidence] = useState({
    pays: "",
    ville: [],
    province: "",
  });
  const [newLang, setNewLang] = useState({
    obj: user?.lang,
    sgl: user?.lang === "en" ? "Anglais" : "Français",
    value: false,
  });
  const [newStatutPro, setNewStatutPro] = useState({ obj: "", value: false });
  const [newExpPro, setNewExpPro] = useState({ obj: "", value: false });
  const [newApp, setNewApp] = useState({ obj: "", value: false });

  // D & T
  const [newDelai, setNewDelai] = useState({ obj: null, value: false });
  const [newTh, setNewTh] = useState({ obj: null, value: false });
  const [newUniteMonaitaire, setNewUniteMonaitaire] = useState({
    obj: null,
    value: false,
  });
  const [newBenevolat, setNewBenevolat] = useState({ obj: null, value: false });
  const [newMTF, setNewMTF] = useState({ obj: null, value: false });
  const [newDisp, setNewDisp] = useState({ obj: [], value: false });

  // QS
  const [projetQS, setProjetQS] = useState(() =>
    Array.from({ length: questionLength }, () => ({ obj: "", value: false }))
  );

  const [isPopup, setIsPopup] = useState("default");
  const [active, setActive] = useState(MENU.DESC);
  const [activePopup, setActivePopup] = useState(true);
  const [isSubmit, setIsSubmit] = useState({ is: false, value: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isValidDisp, setIsValidDisp] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const [newProjet, setNewProjet] = useState(initialProject);
  const [firstRender, setFirstRender] = useState({
    app: true,
    appOther: false,
    comp: true,
    compOther: false,
    justClauseCompPopUp: false,
  });

  useEffect(() => {
    if (active !== MENU.DT && canUpdate) {
      setIsValidDisp(true);
      if (
        isValidDisp &&
        JSON.stringify(newDisp.obj) !== JSON.stringify(newProjet.disponibilite)
      ) {
        if (!newDisp.value) {
          setNewDisp((prev) => ({ ...prev, value: true }));
        }
        setNewProjet((prev) => ({ ...prev, disponibilite: newDisp.obj }));
        setIsValidDisp(false);
        setCanUpdate(false);
      } else if (
        JSON.stringify(newDisp.obj) === JSON.stringify(newProjet.disponibilite)
      ) {
        setIsValidDisp(false);
        setCanUpdate(false);
      }
    }
  }, [active, isValidDisp, canUpdate]);

  // desc
  useEffect(() => {
    setNewProjet((prev) => {
      const updatedProjet = { ...prev };
      let isValidDesc = true;
      Object.keys(updatedProjet).forEach((key) => {
        if (optionsDesc.includes(key)) {
          if (!optionsFacDesc.includes(key) && isEmpty(updatedProjet[key])) {
            isValidDesc = false;
          }
        }
      });
      updatedProjet.errorDesc = !isValidDesc;
      return updatedProjet;
    });
  }, [newProjet.name, newProjet.desc, newProjet.statut, newProjet.duree]);

  // infos
  useEffect(() => {
    setNewProjet((prev) => {
      const updatedProjet = { ...prev };
      let isValidInfos = true;
      Object.keys(updatedProjet).forEach((key) => {
        if (optionsInfos.includes(key)) {
          if (!optionsFacInfos.includes(key) && isEmpty(updatedProjet[key])) {
            isValidInfos = false;
          }
        }
      });
      updatedProjet.errorInfos = !isValidInfos;
      return updatedProjet;
    });
  }, [
    newProjet.competenceVirtuelle,
    newProjet.applicationWeb,
    newProjet.statutProfessionnelle,
    newProjet.experiencePro,
    newProjet.pays,
    newProjet.ville,
    newProjet.province,
    newProjet.lang,
  ]);

  // D & T
  useEffect(() => {
    setNewProjet((prev) => {
      const updatedProjet = { ...prev };

      let isValidInfos = true;

      Object.keys(updatedProjet).forEach((key) => {
        if (optionsDT.includes(key)) {
          if (!optionsFacDT.includes(key) && isEmpty(updatedProjet[key])) {
            isValidInfos = false;
          }
        }
      });
      updatedProjet.errorDT = !isValidInfos;
      return updatedProjet;
    });
  }, [
    newProjet.delai,
    newProjet.disponibilite,
    newProjet.tarif,
    newProjet.montantForfaitaire,
    newProjet.benevolat,
    newProjet.uniteMonaitaire,
  ]);

  // qs
  useEffect(() => {
    setNewProjet((prev) => {
      const updatedProjet = { ...prev };
      let isValidInfos = true;
      Object.keys(updatedProjet).forEach((key) => {
        if (key === "questions") {
          if (isEmpty(updatedProjet[key])) {
            isValidInfos = false;
          }
        }
      });
      updatedProjet.errorQS = !isValidInfos;
      return updatedProjet;
    });
  }, [newProjet.questions]);

  useEffect(() => {
    const isObjectModified = (obj1, obj2) => {
      for (const key in obj1) {
        if (Array.isArray(obj1[key])) {
          if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            return true;
          }
        } else if (obj1[key] !== obj2[key]) {
          return true;
        }
      }
      return false;
    };
    const modified = isObjectModified(initialProject, newProjet);
    setIsModified(modified);
  }, [newProjet, initialProject]);

  useEffect(() => {
    if (isFinish) {
      setTimeout(() => {
        setLoadingBar(0);
      }, 500);
    }
  }, [isFinish, setLoadingBar]);

  const onBack = () => {
    setActive((value) => value - 1);
  };

  const onNext = () => {
    setActive((value) => value + 1);
  };

  const handleReset = () => {
    setNewProjet(initialProject);

    setProjectName({ obj: "", value: false });
    setProjectDesc({ obj: "", value: false });
    setProjetQS(() =>
      Array.from({ length: questionLength }, () => ({ obj: "", value: false }))
    );
    setProjectStatut({ obj: "" });
    setProjectDuration({ obj: null });
    setNewPays({ obj: "", value: false });
    setNewVille({ obj: "", value: false });
    setNewProvince({ obj: "", value: false });
    setNewLang({
      obj: user.lang,
      sgl: user.lang === "en" ? "Anglais" : "Français",
      value: false,
    });
    setNewStatutPro({ obj: "", value: false });
    setNewCmp({ obj: "", value: false });
    setNewExpPro({ obj: "", value: false });
    setNewApp({ obj: "", value: false });
    setNewDelai({ obj: null, value: false });
    setNewTh({ obj: null, value: false });
    setNewBenevolat({ obj: null, value: false });
    setNewMTF({ obj: null, value: false });
    setNewDisp({ obj: [], value: false });
    setIsSubmit({ is: false, value: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit((prev) => ({ ...prev, value: true }));
    if (
      newProjet.errorDT ||
      newProjet.errorDesc ||
      newProjet.errorInfos ||
      newProjet.errorQS
    ) {
      setActivePopup(true);
      setIsPopup("default");
    } else {
      setLoadingBar(60);

      setIsSubmit((prev) => ({ ...prev, is: true }));
      let res = await createProjectController({
        ...newProjet,
        clientId: userId,
      });

      if (res?.created) {
        setLoadingBar(100);

        // setAssistants(res.assistants);

        dispatch(setActualProject({ projet: res.actualProject }));
        setIsSubmit((prev) => ({ ...prev, is: false }));
        setIsFinish(true);
        setRefetchDataCount((a) => a + 1);
        push("/accueil");
      }
    }
  };

  return (
    <ClientOnly activeTopLoading>
      <form onSubmit={handleSubmit} className={styles.container}>
        <div className={styles.top}>
          <span>
            <IoNewspaperOutline size={"1.5rem"} />{" "}
          </span>
          <label>Nouveau projet</label>
        </div>
        <div className={styles.menu}>
          <div
            onClick={() => setActive(0)}
            className={
              active === MENU.DESC ? `${styles.active} c-pointer` : "c-pointer"
            }
          >
            {isSubmit.value && newProjet.errorDesc && (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            )}
            <label>Description du projet</label>
          </div>
          <div
            onClick={() => setActive(1)}
            className={
              active === MENU.INFOS ? `${styles.active} c-pointer` : "c-pointer"
            }
          >
            {isSubmit.value && newProjet.errorInfos && (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            )}
            <label>Informations recherchées</label>
          </div>
          <div
            onClick={() => setActive(2)}
            className={
              active === MENU.DT ? `${styles.active} c-pointer` : "c-pointer"
            }
          >
            {isSubmit.value && newProjet.errorDT && (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            )}
            <label>Disponibilités & Tarifications</label>
          </div>
          <div
            onClick={() => setActive(3)}
            className={
              active === MENU.QS ? `${styles.active} c-pointer` : "c-pointer"
            }
          >
            {isSubmit.value && newProjet.errorQS && (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            )}
            <label>Questions</label>
          </div>
        </div>
        <div className={`${styles.contenu} scr`}>
          <CSSTransition
            in={activePopup}
            timeout={350}
            classNames={"pcf"}
            unmountOnExit
            nodeRef={ref}
          >
            {isPopup === "default" || isPopup === "reset" ? (
              <div ref={ref} className={styles.popupContainer}>
                <div className={`${styles.popupMsg} cft`}>
                  <div className={styles.popupClose}>
                    <i
                      onClick={() => {
                        setActivePopup(false);
                        setFirstRender;
                      }}
                    >
                      <CgClose />
                    </i>
                  </div>
                  <div className={styles.hr} />
                  {isPopup === "default" ? (
                    <div className={styles.popupMiddle}>
                      <div className={styles.popupContenu}>
                        <p>Veuillez remplir tous les champs et sections</p>
                      </div>
                      <div className={styles.popupButton}>
                        <button
                          style={{
                            background: "#badf5b",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setActivePopup(false);
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  ) : (
                    isPopup === "reset" && (
                      <div className={styles.popupMiddle}>
                        <div className={styles.popupContenu}>
                          <p>
                            êtes-vous sûr(e) de vouloir annuler votre nouveau
                            projet
                          </p>
                        </div>
                        <div
                          className={`${styles.popupButton} ${styles.bgRed}`}
                        >
                          <button
                            style={{
                              background: "#badf5b",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setActivePopup(false);
                              handleReset();
                              push("/accueil");
                              setLoadingBar(50);
                            }}
                          >
                            OUI
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div ref={ref} className={styles.popupContainer}>
                <div className={`${styles.popupMsg} cft`}>
                  <div className={styles.popupClose}>
                    <i
                      onClick={() => {
                        if (isPopup === "app" && !appValue) {
                          return;
                        } else if (isPopup === "comp" && !compValue) {
                          return;
                        }
                        setActivePopup(false);
                      }}
                    >
                      <CgClose />
                    </i>
                  </div>
                  <div className={styles.hr} />

                  {isPopup === "comp" ? (
                    <div className={styles.popupMiddle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                        className={styles.popupContenu}
                      >
                        <p>Entrez une Compétence virtuelle</p>
                        <input
                          value={compValue}
                          placeholder="compétence"
                          className="paysInput"
                          type="text"
                          onChange={(e) => {
                            setCompValue(e.target.value);
                          }}
                        />
                      </div>
                      <div className={styles.popupButton}>
                        <button
                          style={{
                            background: "#badf5b",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (compValue) {
                              setNewCmp((prev) => ({
                                ...prev,
                                obj: compValue,
                              }));
                              setIsPopup("");
                              setCompValue("");
                              setActivePopup(false);
                              return;
                            }
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  ) : isPopup === "app" ? (
                    <div className={styles.popupMiddle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                        className={styles.popupContenu}
                      >
                        <p>Entrez une Compétence application</p>
                        <input
                          value={appValue}
                          placeholder="compétence"
                          className="paysInput"
                          type="text"
                          onChange={(e) => {
                            setAppValue(e.target.value);
                          }}
                        />
                      </div>
                      <div className={styles.popupButton}>
                        <button
                          style={{
                            background: "#badf5b",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (appValue) {
                              setNewApp((prev) => ({
                                ...prev,
                                obj: appValue,
                              }));
                              setIsPopup("");
                              setAppValue("");
                              setActivePopup(false);
                              return;
                            }
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.popupMiddle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                        className={styles.popupContenu}
                      >
                        <p>Entrez un pays</p>
                        <input
                          value={paysValue}
                          placeholder="pays"
                          className="paysInput"
                          type="text"
                          onChange={(e) => {
                            setPaysValue(e.target.value);
                          }}
                        />
                      </div>
                      <div className={styles.popupButton}>
                        <button
                          style={{
                            background: "#badf5b",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (paysValue) {
                              setNewPays((prev) => ({
                                ...prev,
                                obj: paysValue,
                              }));
                              setIsPopup("");
                              setActivePopup(false);
                              return;
                            }
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CSSTransition>
          {active === MENU.DESC && (
            <>
              <div className={styles.op}>
                <Desc
                  projetctName={projetctName}
                  setProjectName={setProjectName}
                  projectDesc={projectDesc}
                  setProjectDesc={setProjectDesc}
                  projectDuration={projectDuration}
                  setProjectDuration={setProjectDuration}
                  setIsValidDisp={setIsValidDisp}
                  newProjet={newProjet}
                  setNewProjet={setNewProjet}
                  isSubmit={isSubmit}
                  setProjectStatut={setProjectStatut}
                  projectStatut={projectStatut}
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
                  setIsPopup={setIsPopup}
                  setActivePopup={setActivePopup}
                  isPopup={isPopup}
                  firstRender={firstRender}
                  setFirstRender={setFirstRender}
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
                  newUniteMonaitaire={newUniteMonaitaire}
                  setNewUniteMonaitaire={setNewUniteMonaitaire}
                />
              </div>
            </>
          )}
          {active === MENU.QS && (
            <>
              <div className={styles.op}>
                <QS
                  projetQS={projetQS}
                  setProjetQS={setProjetQS}
                  setIsValidDisp={setIsValidDisp}
                  newProjet={newProjet}
                  setNewProjet={setNewProjet}
                  isSubmit={isSubmit}
                />
              </div>
            </>
          )}
        </div>
        <div className={styles.bottom}>
          <div>
            <button
              disabled={isSubmit.is}
              className={isSubmit.is ? "pen" : null}
              type="reset"
              onClick={() => {
                if (isModified) {
                  setActivePopup(true);
                  setIsPopup("reset");
                } else {
                  handleReset();
                  setActivePopup(true);
                  setIsPopup("reset");
                }
              }}
            >
              <label>Annuler</label>
            </button>
            <div className={styles.switch}>
              <i
                onClick={onBack}
                className={active === MENU.DESC ? `${styles.disbl}` : null}
              >
                <FaCircleArrowLeft size={"1.8rem"} />
              </i>
              <i
                onClick={onNext}
                className={active === MENU.QS ? `${styles.disbl}` : null}
              >
                <FaCircleArrowRight size={"1.8rem"} />
              </i>
            </div>
            <button
              className={isSubmit.is ? `${styles.dis} ` : null}
              disabled={isSubmit.is}
              onClick={handleSubmit}
              type="submit"
            >
              <label>Soumettre</label>
            </button>
          </div>
        </div>
      </form>
    </ClientOnly>
  );
}
