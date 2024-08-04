/** @format */

"use client";

// styles
import styles from "../../styles/projet/ProjectInfos.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import { usePathname } from "next/navigation";
import { alpha, styled } from "@mui/material/styles";
const ValidationTextField = styled(TextField)({
  "& input:valid + fieldset": {
    borderColor: "#E0E3E7",
    borderWidth: 1,
  },
  "& input:invalid + fieldset": {
    borderColor: "red",
    borderWidth: 1,
  },
  "& input:valid:focus + fieldset": {
    borderLeftWidth: 4,
    padding: "4px !important", // override inline-style
  },
});

const filterOptions = createFilterOptions({
  matchFrom: "start",
});
import {
  pays,
  lang,
  competVirt,
  statut,
  appWeb,
  expPro,
} from "@/lib/menuDeroulant";
import { isEmpty } from "@/lib/utils/isEmpty";

// react
import { useRef, useState, useEffect } from "react";

// components
import Image from "next/image";
import ClientOnly from "@/components/ClientOnly";

// logo
import frenchLogo from "../../assets/french-1.png";
import englishLogo from "../../assets/english.jpg";

// icons
import { VscCheckAll } from "react-icons/vsc";
import { GoTriangleDown } from "react-icons/go";
import { HiChevronDown } from "react-icons/hi";
import { PiWarningCircleFill } from "react-icons/pi";

export default function ProjectInfos({
  newPays,
  setNewPays,
  newVille,
  setNewVille,
  newLang,
  setNewLang,
  newStatutPro,
  setNewStatutPro,
  newProvince,
  setNewProvince,
  residence,
  setResidence,
  newExpPro,
  setNewExpPro,
  isSubmit,
  newApp,
  setNewApp,
  newCmp,
  setNewCmp,
  newProjet,
  setNewProjet,
  setIsPopup,
  setActivePopup,
  isPopup,
  readOnly,
  // setFirstRender,
  // firstRender,
}) {
  const ref = useRef();
  const [app, setApp] = useState(appWeb);
  const [competence, setCompetence] = useState(competVirt);
  const [firstRender, setFirstRender] = useState({
    app: true,
    appOther: false,
    compChange: false,
    appChange: false,
    comp: true,
    compOther: false,
  });
  const pathname = usePathname();

  const [showMenu, setShowMenu] = useState({
    obj: "",
    value: false,
  });
  useEffect(() => {
    // compétence
    if (!isEmpty(newCmp.obj)) {
      setNewProjet((prev) => ({ ...prev, competenceVirtuelle: newCmp.obj }));
    } else {
      setNewProjet((prev) => ({ ...prev, competenceVirtuelle: "" }));
    }

    // app
    if (!isEmpty(newApp.obj)) {
      setNewProjet((prev) => ({ ...prev, applicationWeb: newApp.obj }));
    } else {
      setNewProjet((prev) => ({ ...prev, applicationWeb: "" }));
    }

    // statut pro
    if (!isEmpty(newStatutPro.obj)) {
      setNewProjet((prev) => ({
        ...prev,
        statutProfessionnelle: newStatutPro.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, statutProfessionnelle: "" }));
    }

    // exp pro
    if (!isEmpty(newExpPro.obj)) {
      setNewProjet((prev) => ({
        ...prev,
        experiencePro: newExpPro.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, experiencePro: "" }));
    }

    // pays
    if (!isEmpty(newPays.obj)) {
      setNewProjet((prev) => ({
        ...prev,
        pays: newPays.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, pays: "" }));
    }

    // ville
    if (!isEmpty(newVille.obj)) {
      setNewProjet((prev) => ({
        ...prev,
        ville: newVille.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, ville: "" }));
    }

    // lang
    if (!isEmpty(newLang.obj) && newLang.obj !== newProjet.lang) {
      setNewProjet((prev) => ({
        ...prev,
        lang: newLang.obj,
      }));
    }
  }, [
    newCmp.obj,
    newApp.obj,
    newStatutPro.obj,
    newExpPro.obj,
    newPays.obj,
    newVille.obj,
    newProvince.obj,
    newLang.obj,
  ]);

  useEffect(() => {
    if (!isEmpty(showMenu.obj)) {
      const compt = document.getElementById(showMenu.obj);
      const handleClickOutside = (e) => {
        if (
          !e.target.id !== compt &&
          ref.current &&
          !ref.current.contains(e.target)
        ) {
          setShowMenu(() => ({
            obj: "",
            value: false,
          }));
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showMenu.obj]);
  const other = "autre";

  return (
    <ClientOnly>
      <div
        className={
          isSubmit.is ? `${styles.container} pen` : `${styles.container}`
        }
      >
        {/* cmp */}
        <div>
          <div className={styles.l}>
            <label htmlFor="cmp" className="usn">
              Compétence virtuelle
            </label>
          </div>
          <div className={`${styles.r} ${styles.min}`}>
            <div className={styles.inputR}>
              <Autocomplete
                noOptionsText="Aucune option"
                readOnly={pathname === "/mes-projets"}
                filterOptions={filterOptions}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue === "") {
                    if (firstRender.compChange === true) {
                      setNewCmp((prev) => ({
                        ...prev,
                        obj: "",
                      }));
                      setFirstRender((a) => {
                        return {
                          ...a,
                          compChange: false,
                        };
                      });
                    }
                  } else if (!newInputValue && pathname === "/mes-projets") {
                  } else if (
                    event?.target?.value !== undefined &&
                    newCmp.obj &&
                    newInputValue !== "Autre" &&
                    newInputValue !== ""
                  ) {
                    setNewCmp((prev) => ({
                      ...prev,
                      obj: prev.obj === newInputValue ? "" : newInputValue,
                    }));
                    setFirstRender((prev) => ({
                      ...prev,
                      comp: false,
                      compOther: false,
                      compChange: true,
                    }));
                  } else if (!newInputValue && firstRender.comp === false) {
                    setNewCmp((prev) => ({
                      value: false,
                      obj: "",
                    }));
                    setFirstRender((prev) => ({
                      ...prev,
                      compChange: true,
                    }));
                  } else {
                    if (
                      newInputValue === "Autre" &&
                      firstRender.compOther === false
                    ) {
                      setFirstRender((prev) => ({ ...prev, compOther: true }));

                      setIsPopup("comp");

                      setNewCmp((prev) => ({
                        ...prev,
                        obj: "Autre",
                      }));
                      setActivePopup(true);

                      return;
                    } else if (newCmp.obj && newInputValue === "Autre") {
                      // setNewCmp((prev) => ({
                      //   ...prev,
                      //   obj: newCmp.obj,
                      // }));
                    } else if (
                      newInputValue !== "Autre" &&
                      newInputValue !== ""
                    ) {
                      setNewCmp((prev) => ({
                        ...prev,
                        obj: newInputValue,
                      }));
                    } else if (newInputValue === "Autre") {
                      if (newCmp.obj === "") {
                        setIsPopup("app");

                        setActivePopup(true);
                      }
                    }
                    // else {
                    //   console.log("ato");
                    //   setNewCmp((prev) => ({
                    //     ...prev,
                    //     obj: "",
                    //   }));
                    // }
                    // setFirstRender((prev) => ({ ...prev, comp: false }));
                    setFirstRender((prev) => ({
                      ...prev,
                      comp: false,
                      compChange: true,
                    }));
                  }
                }}
                inputValue={newCmp.obj || ""}
                id="controllable-states-demo"
                options={competVirt}
                sx={{ width: "100%", border: "none" }}
                renderInput={(params) => (
                  <TextField
                    disabled={true}
                    onClick={() => {
                      setNewCmp((prev) => ({
                        ...prev,
                      }));
                    }}
                    label="Compétence"
                    {...params}
                  />
                  // <div ref={params.InputProps.ref}>
                  //   <input
                  //     type="text"
                  //     placeholder="Compétence virtuelle"
                  //     {...params.inputProps}
                  //     readOnly={readOnly}
                  //   />
                  // </div>
                )}
              />
              {isSubmit.value && isEmpty(newCmp.obj) ? (
                <i className={styles.errI}>
                  <PiWarningCircleFill size={"1.25rem"} />
                  <span className={styles.badge}>* Champ obligatoire</span>
                </i>
              ) : (
                // <i
                //   onClick={() =>
                //     setShowMenu((prev) => ({
                //       obj: "cmp",
                //       value: prev.obj === "cmp" ? !prev.value : true,
                //     }))
                //   }
                // >
                //   <GoTriangleDown size={"1.25rem"} className="try1" />
                // </i>
                <div></div>
              )}
              {showMenu.obj === "cmp" && showMenu.value && (
                <div className={`${styles.menuDeroulant} scr`}>
                  <div className={styles.sim}>
                    {competVirt.map((p) => {
                      return (
                        <div
                          key={p}
                          className={newCmp.obj === p ? `${styles.bg}` : null}
                          onClick={() =>
                            setNewCmp((prev) => ({
                              ...prev,
                              obj: prev.obj === p ? "" : p,
                            }))
                          }
                        >
                          <span
                            style={{
                              color: "rgba(0, 0, 0, 0.7)",
                            }}
                            className="usn"
                          >
                            {p}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* app */}
        <div>
          <div className={styles.l}>
            <label htmlFor="appWeb" className="usn">
              Compétence app.
            </label>
          </div>
          <div className={`${styles.r} ${styles.min}`}>
            <div className={styles.inputR}>
              {isSubmit.value && isEmpty(newApp.obj) ? (
                <i className={styles.errI}>
                  <PiWarningCircleFill size={"1.25rem"} />
                  <span className={styles.badge}>* Champ obligatoire</span>
                </i>
              ) : (
                <div></div>
              )}
              <Autocomplete
                noOptionsText="Aucune option"
                readOnly={pathname === "/mes-projets"}
                filterOptions={filterOptions}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue === "") {
                    if (firstRender.appChange === true) {
                      setNewApp((prev) => ({
                        ...prev,
                        obj: "",
                      }));
                    }
                  } else if (!newInputValue && pathname === "/mes-projets") {
                  } else if (
                    event?.target?.value !== undefined &&
                    newApp.obj &&
                    newInputValue !== "Autre"
                  ) {
                    setNewApp((prev) => ({
                      ...prev,
                      obj: prev.obj === newInputValue ? "" : newInputValue,
                    }));
                    setFirstRender((prev) => ({
                      ...prev,
                      app: false,
                      appOther: false,
                      appChange: true,
                    }));
                  } else if (!newInputValue && firstRender.app === false) {
                    setNewApp((prev) => ({
                      value: false,
                      obj: "",
                    }));
                    setFirstRender((prev) => ({
                      ...prev,
                      appChange: true,
                    }));
                  } else {
                    if (
                      newInputValue === "Autre" &&
                      firstRender.appOther === false
                    ) {
                      setFirstRender((prev) => ({ ...prev, appOther: true }));

                      setNewApp((prev) => ({
                        ...prev,
                        obj: "",
                      }));
                      setIsPopup("app");

                      setActivePopup(true);
                      return;
                    } else if (newApp.obj && newInputValue === "Autre") {
                    } else if (
                      newInputValue !== "Autre" &&
                      newInputValue !== ""
                    ) {
                      setNewApp((prev) => ({
                        ...prev,
                        obj: newInputValue,
                      }));
                    } else if (newInputValue === "Autre") {
                      if (newApp.obj === "") {
                        setIsPopup("app");

                        setActivePopup(true);
                      }
                    }
                    setFirstRender((prev) => ({
                      ...prev,
                      appChange: true,
                    }));
                  }
                }}
                inputValue={newApp.obj || ""}
                id="controllable-states-demo"
                options={appWeb}
                sx={{ width: "100%", border: "none" }}
                renderInput={(params) => (
                  <TextField
                    disabled={readOnly}
                    label="Application"
                    {...params}
                  />
                  // <ValidationTextField
                  //   label="CSS validation style"
                  //   {...params.inputProps}
                  // />
                  // <div ref={params.InputProps.ref}>
                  //   <input
                  //     readOnly={readOnly}
                  //     type="text"
                  //     placeholder="Compétence app"
                  //     {...params.inputProps}
                  //   />
                  // </div>
                )}
              />
              {showMenu.obj === "appWeb" && showMenu.value && (
                <div className={`${styles.menuDeroulant} scr`}>
                  <div className={styles.sim}>
                    {appWeb.map((p) => {
                      return (
                        <div
                          key={p}
                          className={newApp.obj === p ? `${styles.bg}` : null}
                          onClick={() => {
                            setNewApp((prev) => ({
                              ...prev,
                              obj: prev.obj === p ? "" : p,
                            }));
                            setShowMenu({
                              obj: "",
                              value: false,
                              focus: false,
                            });
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            {p}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* statut pro */}
        <div>
          <div className={styles.l}>
            <label htmlFor="statutPro" className="usn">
              Statut professionnel
            </label>
          </div>
          <div className={`${styles.r} ${styles.min}`}>
            <div className={styles.inputR}>
              {isSubmit.value && isEmpty(newStatutPro.obj) ? (
                <i className={styles.errI}>
                  <PiWarningCircleFill size={"1.25rem"} />
                  <span className={styles.badge}>* Champ obligatoire</span>
                </i>
              ) : (
                <i
                  onClick={() => {
                    if (readOnly) {
                      return;
                    }
                    setShowMenu((prev) => ({
                      obj: "statutPro",
                      value: prev.obj === "statutPro" ? !prev.value : true,
                    }));
                  }}
                >
                  <GoTriangleDown size={"1.25rem"} className="try1" />
                </i>
              )}
              <input
                type="text"
                id="statutPro"
                value={newStatutPro.obj}
                readOnly
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  setShowMenu((prev) => ({
                    obj: "statutPro",
                    value: prev.obj === "statutPro" ? !prev.value : true,
                  }));
                }}
                placeholder="Statut"
                className={
                  isSubmit.value && isEmpty(newStatutPro.obj)
                    ? `${styles.red} ${styles.red}`
                    : "c-pointer"
                }
              />

              {showMenu.obj === "statutPro" && showMenu.value && (
                <div className={`${styles.menuDeroulant} scr`}>
                  <div className={styles.sim}>
                    {statut.map((p) => {
                      return (
                        <div
                          key={p}
                          className={
                            newStatutPro.obj === p ? `${styles.bg}` : null
                          }
                          onClick={() => {
                            setNewStatutPro((prev) => ({
                              ...prev,
                              obj: prev.obj === p ? "" : p,
                            }));
                            setShowMenu(() => ({
                              obj: "",
                              value: false,
                            }));
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(0, 0, 0, 0.7)",
                            }}
                            className="usn"
                          >
                            {p}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* exp pro */}
        <div>
          <div className={styles.l}>
            <label htmlFor="expPro" className="usn">
              Nombre d{"'"}années d{"'"}expériences
            </label>
          </div>
          <div className={`${styles.r} ${styles.min}`}>
            <div className={styles.inputR}>
              {isSubmit.value && isEmpty(newExpPro.obj) ? (
                <i className={styles.errI}>
                  <PiWarningCircleFill size={"1.25rem"} />
                  <span className={styles.badge}>* Champ obligatoire</span>
                </i>
              ) : (
                <i
                  onClick={() => {
                    if (readOnly) {
                      return;
                    }
                    setShowMenu((prev) => ({
                      obj: "expPro",
                      value: prev.obj === "expPro" ? !prev.value : true,
                    }));
                  }}
                >
                  <GoTriangleDown size={"1.25rem"} className="try1" />
                </i>
              )}
              <input
                type="text"
                id="expPro"
                value={newExpPro.obj}
                readOnly
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  setShowMenu((prev) => ({
                    obj: "expPro",
                    value: prev.obj === "expPro" ? !prev.value : true,
                  }));
                }}
                placeholder="Expérience"
                className={
                  isSubmit.value && isEmpty(newExpPro.obj)
                    ? `${styles.red} ${styles.red}`
                    : "c-pointer"
                }
              />

              {showMenu.obj === "expPro" && showMenu.value && (
                <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                  <div className={styles.sim}>
                    {expPro.map((p) => {
                      return (
                        <div
                          key={p}
                          className={
                            newExpPro.obj === p ? `${styles.bg}` : null
                          }
                          onClick={() => {
                            setNewExpPro((prev) => ({
                              ...prev,
                              obj: prev.obj === p ? "" : p,
                            }));
                            setShowMenu({
                              obj: "",
                              value: false,
                              focus: false,
                            });
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            {p}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* pays */}
        <div>
          <div className={styles.l}>
            <label htmlFor="pays" className="usn">
              Pays
            </label>
          </div>
          <div className={`${styles.r} ${styles.min} ${styles.upp}`}>
            <div className={styles.inputR}>
              {isSubmit.value && isEmpty(newPays.obj) ? (
                <i className={styles.errI}>
                  <PiWarningCircleFill size={"1.25rem"} />
                  <span className={styles.badge}>* Champ obligatoire</span>
                </i>
              ) : (
                <i
                  onClick={() => {
                    if (readOnly) {
                      return;
                    }
                    setShowMenu((prev) => ({
                      obj: "pays",
                      value: prev.obj === "pays" ? !prev.value : true,
                    }));
                  }}
                >
                  <GoTriangleDown size={"1.25rem"} className="try1" />
                </i>
              )}
              <input
                type="text"
                id="pays"
                value={newPays.obj}
                readOnly
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  setShowMenu((prev) => ({
                    obj: "pays",
                    value: prev.obj === "pays" ? !prev.value : true,
                  }));
                }}
                placeholder="Pays"
                className={
                  isSubmit.value && isEmpty(newPays.obj)
                    ? `${styles.red} ${styles.red}`
                    : "c-pointer"
                }
              />

              {showMenu.obj === "pays" && showMenu.value && (
                <div className={`${styles.menuDeroulant} scr`}>
                  <div className={`${styles.sim}`}>
                    {pays.map((p) => {
                      return (
                        <div
                          key={p.pays}
                          className={
                            newPays.obj === p.pays ? `${styles.bg}` : null
                          }
                        >
                          <h1
                            onClick={() => {
                              if (p.pays === "Autre") {
                                setIsPopup("pays");
                                setActivePopup(true);
                                setShowMenu(() => ({
                                  obj: "",
                                  value: false,
                                }));
                                return;
                              }
                              setNewPays((prev) => ({
                                ...prev,
                                obj: prev.obj === p.pays ? "" : p.pays,
                              }));
                              setResidence({
                                pays: newPays.obj === p.pays ? "" : p.pays,
                                ville: newPays.obj === p.pays ? "" : p.ville,
                                province:
                                  newPays.obj === p.pays
                                    ? ""
                                    : p.province
                                    ? p.province
                                    : "",
                              });
                              setShowMenu(() => ({
                                obj: "",
                                value: false,
                              }));
                              setNewVille((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                              setNewProvince((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                            }}
                          >
                            <span
                              style={{
                                color: "rgba(0, 0, 0, 0.7)",
                              }}
                            >
                              {p.pays}
                            </span>
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ville */}
        {/* <div>
          <div className={styles.l}>
            <label htmlFor="villeInput" className="usn">
              Ville
            </label>
          </div>
          <div
            className={
              showMenu.obj === "ville" && showMenu.value
                ? `${styles.r} ${styles.min} ${styles.inputR} ${styles.ic}`
                : `${styles.r} ${styles.min} ${styles.inputR}`
            }
            ref={ref}
            id="ville"
          >
            {isSubmit.value && isEmpty(newVille.obj) ? (
              <i className={styles.errI}>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            ) : (
              <i
                onClick={() =>
                  setShowMenu((prev) => ({
                    obj: "ville",
                    value: prev.obj === "ville" ? !showMenu.value : true,
                  }))
                }
              >
                <GoTriangleDown size={"1.25rem"} className="try1" />
              </i>
            )}
            <input
              id="villeInput"
              type="text"
              value={
                !isEmpty(newProvince.obj) && !isEmpty(newVille.obj)
                  ? newProvince.obj + " - " + newVille.obj
                  : !isEmpty(newProvince.obj) && isEmpty(newVille.obj)
                  ? newProvince.obj + " - "
                  : newVille.obj
              }
              readOnly
              onClick={() =>
                setShowMenu((prev) => ({
                  obj: "ville",
                  value: prev.obj === "ville" ? !showMenu.value : true,
                }))
              }
              placeholder="Ville"
              className={
                isSubmit.value && isEmpty(newVille.obj)
                  ? `${styles.red} ${styles.red}`
                  : "c-pointer"
              }
            />

            {showMenu.obj === "ville" &&
            showMenu.value &&
            isEmpty(residence.pays) ? (
              <div className={`${styles.menuDeroulant} scr`}>
                <div className={styles.pays}>
                  {pays.map((p) => {
                    if (!isEmpty(p.province)) {
                      return (
                        <div
                          key={p.pays}
                          className={
                            newPays.obj === p.pays
                              ? `${styles.bg} ${styles.ch} ${styles.np}`
                              : `${styles.np}`
                          }
                        >
                          <h1
                            onClick={() => {
                              setNewPays((prev) => ({
                                ...prev,
                                obj: prev.obj === p.pays ? "" : p.pays,
                              }));
                              setNewProvince((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                              setNewVille((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                            }}
                          >
                            <label className="usn paysItem">{p.pays}</label>
                            <i>
                              <HiChevronDown className="try1" />
                            </i>
                          </h1>
                          <div
                            className={
                              newPays.obj === p.pays
                                ? null
                                : `${styles.notTogglePays}`
                            }
                          >
                            <h2
                              className={
                                newProvince.obj === p.province
                                  ? `${styles.cl}`
                                  : `${styles.h2}`
                              }
                              onClick={() => {
                                if (newProvince.obj === p.province) {
                                  setNewProvince((prev) => ({
                                    ...prev,
                                    obj: "",
                                  }));
                                  setNewVille((prev) => ({
                                    ...prev,
                                    obj: "",
                                  }));
                                } else {
                                  setNewProvince((prev) => ({
                                    ...prev,
                                    obj: p.province,
                                  }));
                                }
                              }}
                            >
                              <label className="usn paysItem">
                                {p.province}
                              </label>
                              <i>
                                <HiChevronDown className="try1" />
                              </i>
                            </h2>
                            <div
                              className={
                                newProvince.obj === p.province
                                  ? null
                                  : `${styles.notTogglePays}`
                              }
                            >
                              {p.ville.map((v) => {
                                return (
                                  <label
                                    key={v}
                                    className={
                                      v === newVille.obj
                                        ? `${styles.blue}`
                                        : null
                                    }
                                    onClick={() => {
                                      setNewVille((prev) => ({
                                        ...prev,
                                        obj: prev.obj === v ? "" : v,
                                      }));
                                      setResidence(() => ({
                                        pays: newVille.obj === v ? "" : p.pays,
                                        ville:
                                          newVille.obj === v ? "" : p.ville,
                                        province: "",
                                      }));
                                      setShowMenu(() => ({
                                        obj: "",
                                        value: false,
                                      }));
                                    }}
                                  >
                                    {v}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={p.pays}
                          className={
                            newPays.obj === p.pays
                              ? `${styles.bg} ${styles.ch} ${styles.np}`
                              : `${styles.np}`
                          }
                        >
                          <h1
                            onClick={() => {
                              setNewPays((prev) => ({
                                ...prev,
                                obj: prev.obj === p.pays ? "" : p.pays,
                              }));
                              setNewProvince((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                              setNewVille((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                            }}
                          >
                            <label className="usn paysItem">{p.pays}</label>
                            <i>
                              <HiChevronDown className="try1" />
                            </i>
                          </h1>
                          <div
                            className={
                              newPays.obj === p.pays
                                ? null
                                : `${styles.notTogglePays}`
                            }
                          >
                            {p.ville.map((v) => {
                              return (
                                <label
                                  key={v}
                                  className={
                                    v === newVille.obj ? `${styles.blue}` : null
                                  }
                                  onClick={() => {
                                    setNewVille((prev) => ({
                                      ...prev,
                                      obj: prev.obj === v ? "" : v,
                                    }));
                                    setShowMenu(() => ({
                                      obj: "",
                                      value: false,
                                    }));
                                    setResidence({
                                      pays:
                                        newVille.obj === p.pays ? "" : p.pays,
                                      ville:
                                        newVille.obj === p.pays ? "" : p.ville,
                                      province:
                                        newVille.obj === p.pays
                                          ? ""
                                          : p.province
                                          ? p.province
                                          : "",
                                    });
                                  }}
                                >
                                  {v}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ) : (
              showMenu.obj === "ville" &&
              showMenu.value &&
              !isEmpty(residence.pays) && (
                <div className={`${styles.menuDeroulant} scr`}>
                  <div className={`${styles.pays} ${styles.notHover}`}>
                    {!isEmpty(residence.province) ? (
                      <div>
                        <h2
                          className={
                            newProvince.obj === residence.province
                              ? `${styles.blue}`
                              : null
                          }
                          onClick={() => {
                            if (newProvince.obj === residence.province) {
                              setNewProvince((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                              setNewVille((prev) => ({
                                ...prev,
                                obj: "",
                              }));
                            } else {
                              setNewProvince((prev) => ({
                                ...prev,
                                obj: residence.province,
                              }));
                            }
                          }}
                        >
                          <span>{residence.province}</span>
                          <i>
                            <HiChevronDown className="try1" />
                          </i>
                        </h2>
                        <div
                          className={
                            newProvince.obj === residence.province
                              ? null
                              : `${styles.notTogglePays}`
                          }
                        >
                          {residence.ville.map((v) => {
                            return (
                              <label
                                key={v}
                                className={
                                  v === newVille.obj ? `${styles.blue}` : null
                                }
                                onClick={() => {
                                  setShowMenu({
                                    obj: "",
                                    value: false,
                                  });
                                  setNewVille((prev) => ({
                                    ...prev,
                                    obj: prev.obj === v ? "" : v,
                                  }));
                                }}
                              >
                                {v}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {residence?.ville.map((v) => {
                          return (
                            <label
                              className={
                                v === newVille.obj ? `${styles.blue}` : null
                              }
                              key={v}
                              onClick={() => {
                                setShowMenu(() => ({
                                  obj: "",
                                  value: false,
                                }));
                                setNewVille((prev) => ({
                                  ...prev,
                                  obj: prev.obj === v ? "" : v,
                                }));
                              }}
                            >
                              {v}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div> */}

        {/* langue */}
        <div>
          <div className={styles.l}>
            <label htmlFor="lang" className="usn">
              Langue
            </label>
          </div>
          <div className={`${styles.r} ${styles.min}`}>
            <div
              className={
                showMenu.obj === "langue" && showMenu.value
                  ? `${styles.inputR}  ${styles.inputL} ${styles.ic}`
                  : `${styles.inputR} ${styles.inputL}`
              }
              id="langue"
            >
              <Image
                src={newLang.obj === "fr" ? frenchLogo : englishLogo}
                alt=""
                width={15}
                height={15}
                className={styles.flagInput}
              />
              <input
                type="text"
                id="lang"
                value={newLang.sgl}
                readOnly
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  setShowMenu((prev) => ({
                    obj: "langue",
                    value: prev.obj === "langue" ? !showMenu.value : true,
                  }));
                }}
                className="usn c-pointer"
              />

              <i
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  setShowMenu((prev) => ({
                    obj: "langue",
                    value: prev.obj === "langue" ? !showMenu.value : true,
                  }));
                }}
              >
                <GoTriangleDown size={"1.25rem"} className="try1" />
              </i>
              {showMenu.obj === "langue" && showMenu.value && (
                <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                  <div className={styles.sim}>
                    {lang.map((p) => {
                      return (
                        <div
                          key={p.obj}
                          className={
                            newLang.sgl === p.obj
                              ? `${styles.bl} ${styles.po} ${styles.lg} ${styles.lng}`
                              : `${styles.lb} ${styles.lng}`
                          }
                          onClick={() => {
                            setNewLang((prev) => ({
                              ...prev,
                              obj: p.tp,
                              sgl: p.obj,
                            }));
                            setShowMenu(() => ({
                              obj: "",
                              value: false,
                            }));
                          }}
                        >
                          <span>{p.obj}</span>
                          {newLang.sgl === p.obj && (
                            <span>
                              <VscCheckAll size={"1.15rem"} className="trx1" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
