/** @format */

"use client";
import styles from "../../../styles/home/profil/CV.module.css";
import { useEffect, useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import { useSelector } from "react-redux";
import { appWeb, expPro, competVirt, nbCmp } from "@/lib/menuDeroulant";
import { isEmpty } from "@/lib/utils/isEmpty";
import { GoTriangleDown } from "react-icons/go";

export default function CV({
  newCmp,
  setNewCmp,
  newApp,
  setNewApp,
  newExpPro,
  setNewExpPro,
  isSubmit,
  setInfosToUpdate,
  setShowPopUp,
}) {
  const { user } = useSelector((state) => state.user);
  const [invalidOptions, setInvalidOptions] = useState(() => {
    const initialCmp = [
      ...user.competenceVirtuelle,
      ...Array.from(
        { length: nbCmp - user.competenceVirtuelle?.length },
        () => ""
      ),
    ];
    return initialCmp;
  });
  const [lastIndex, setLastIndex] = useState(0);
  const [showMenu, setShowMenu] = useState({
    obj: "",
    value: false,
    focus: false,
  });
  useEffect(() => {
    for (let i = 0; i < nbCmp; i++) {
      if (newCmp[i].obj === "") {
        setLastIndex(i);
        break;
      }
    }

    // prendre tous les éléments non vides
    const newCmpArray = newCmp
      .filter((objet) => objet.obj !== "")
      .map((objet) => objet.obj);

    if (
      JSON.stringify(newCmpArray) !== JSON.stringify(user.competenceVirtuelle)
    ) {
      setInfosToUpdate((prev) => ({
        ...prev,
        competenceVirtuelle: newCmpArray,
      }));
    } else if (
      JSON.stringify(newCmpArray) === JSON.stringify(user.competenceVirtuelle)
    ) {
      setInfosToUpdate((prev) => {
        const { competenceVirtuelle, ...nwe } = prev;
        return nwe;
      });
    }

    // application web
    if (newApp.obj !== user.applicationWeb) {
      setNewApp((prev) => ({ ...prev, value: true }));
      setInfosToUpdate((prev) => ({ ...prev, applicationWeb: newApp.obj }));
    } else if (newApp.obj === user.applicationWeb) {
      if (newApp.value) {
        setNewApp((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { applicationWeb, ...nwe } = prev;
        return nwe;
      });
    }

    // experience pro
    if (newExpPro.obj !== user.experiencePro) {
      setNewExpPro((prev) => ({ ...prev, value: true }));
      setInfosToUpdate((prev) => ({ ...prev, experiencePro: newExpPro.obj }));
    } else if (newExpPro.obj === user.experiencePro) {
      if (newExpPro.value) {
        setNewExpPro((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => {
        const { experiencePro, ...nwe } = prev;
        return nwe;
      });
    }
  }, [newApp.obj, newExpPro.obj, newCmp]);

  useEffect(() => {
    if (!isEmpty(showMenu.obj)) {
      const act = document.getElementById(showMenu.obj);
      const handleClickOutside = (e) => {
        if (!e.target.id !== act) {
          setShowMenu((prev) => {
            let nwe = { ...prev };
            nwe.obj = "";
            nwe.value = false;
            nwe.focus = false;
            return nwe;
          });
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showMenu.obj]);
  return (
    <ClientOnly>
      <div
        className={isSubmit ? `${styles.container} pen` : `${styles.container}`}
      >
        <div>
          <div className={styles.l}>
            <label htmlFor="cmp" className="usn">
              Compétences
            </label>
            <p>
              Veuillez sélectionner au maximum <span>3</span> compétences
              virtuelles.
            </p>
          </div>

          <div className={styles.cmp}>
            {newCmp.map((c, i) => {
              return (
                <div
                  className={
                    showMenu.obj === `cmp${i}` && showMenu.value
                      ? `${styles.r} ${styles.ot}`
                      : `${styles.r}`
                  }
                  key={i}
                >
                  <div
                    className={
                      showMenu.obj === `cmp${i}` && showMenu.value
                        ? `${styles.inputR} ${styles.ic}`
                        : `${styles.inputR}`
                    }
                    id={`cmp${i}`}
                  >
                    <input
                      type="text"
                      placeholder={`Compétence  ${i + 1}`}
                      id={i === lastIndex ? "cmp" : `cmp${i}`}
                      value={c.obj}
                      readOnly
                      onFocus={() => {
                        showMenu.obj === `cmp${i}` &&
                        showMenu.value &&
                        showMenu.focus &&
                        newCmp[i] === c
                          ? setShowMenu((prev) => ({
                              ...prev,
                              value: !prev.value,
                            }))
                          : setShowMenu({
                              obj: "cmp",
                              value: true,
                              focus: true,
                            });
                      }}
                      onClick={() => {
                        showMenu.obj === `cmp${i}` &&
                        showMenu.value &&
                        !showMenu.focus &&
                        newCmp[i] === c
                          ? setShowMenu((prev) => ({
                              ...prev,
                              value: !prev.value,
                            }))
                          : setShowMenu({ obj: `cmp${i}`, value: true });
                      }}
                      className={styles.ina}
                    />
                    <i
                      onClick={() => {
                        showMenu.obj === `cmp${i}` &&
                        showMenu.value &&
                        newCmp[i] === c
                          ? setShowMenu(() => ({
                              obj: `cmp${i}`,
                              value: !showMenu.value,
                            }))
                          : setShowMenu(() => ({
                              obj: `cmp${i}`,
                              value: true,
                            }));
                      }}
                    >
                      <GoTriangleDown size={"1.25rem"} className="try1" />
                    </i>
                    {showMenu.obj === `cmp${i}` &&
                      showMenu.value &&
                      newCmp[i] === c && (
                        <div
                          className={`${styles.menuDeroulant} ${styles.hidden} scr`}
                        >
                          <div className={styles.pays}>
                            {competVirt.map((p) => {
                              return (
                                <div
                                  key={p}
                                  className={
                                    c.obj === p && newCmp[i] === c
                                      ? `${styles.po} ${styles.bg}`
                                      : invalidOptions.includes(p)
                                      ? `${styles.po}`
                                      : null
                                  }
                                  onClick={() => {
                                    if (p === "Autre") {
                                      setShowPopUp({
                                        status: true,
                                        number: i,
                                        label: "comp",
                                      });
                                      setShowMenu({
                                        obj: "",
                                        value: false,
                                        focus: false,
                                      });
                                      return;
                                    }
                                    setNewCmp((prev) => {
                                      let newCmp = [...prev];
                                      newCmp[i] = {
                                        obj: newCmp[i].obj === p ? "" : p,
                                        value: true,
                                      };
                                      return newCmp;
                                    });
                                    setInvalidOptions((prev) => {
                                      let newInvalidOptions = [...prev];
                                      newInvalidOptions[i] =
                                        newInvalidOptions[i] === p ? "" : p;
                                      return newInvalidOptions;
                                    });
                                    setShowMenu({
                                      obj: "",
                                      value: false,
                                      focus: false,
                                    });
                                  }}
                                >
                                  <span>{p}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* app web */}
        <div>
          <div className={styles.l}>
            <label htmlFor="appli" className="usn">
              Application web
            </label>
            <p>Spécifiez l&apos;application que vous maitrisez le mieux.</p>
          </div>
          <div className={styles.r}>
            <div
              className={
                showMenu.obj === "appWeb" && showMenu.value
                  ? `${styles.inputR} ${styles.ic}`
                  : `${styles.inputR}`
              }
              id="appWeb"
            >
              <input
                type="text"
                id="appli"
                value={newApp.obj}
                readOnly
                onFocus={() => {
                  showMenu.obj === "appWeb" && showMenu.value && showMenu.focus
                    ? setShowMenu((prev) => ({
                        ...prev,
                        value: !prev.value,
                      }))
                    : setShowMenu({
                        ...showMenu,
                        focus: true,
                      });
                }}
                onClick={() => {
                  showMenu.obj === "appWeb" && showMenu.value && !showMenu.focus
                    ? setShowMenu((prev) => ({
                        ...prev,
                        value: !prev.value,
                      }))
                    : setShowMenu({ obj: "appWeb", value: true });
                }}
                placeholder="Application Web"
                className={styles.ina}
              />
              <i
                onClick={() => {
                  showMenu.obj === "appWeb" && showMenu.value
                    ? setShowMenu({ obj: "appWeb", value: !showMenu.value })
                    : setShowMenu({ obj: "appWeb", value: true });
                }}
              >
                <GoTriangleDown size={"1.25rem"} className="try1" />
              </i>
              {showMenu.obj === "appWeb" && showMenu.value && (
                <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                  <div className={styles.stat}>
                    {appWeb.map((p) => {
                      return (
                        <div
                          key={p}
                          className={
                            newApp.obj === p
                              ? `${styles.bg} ${styles.po}`
                              : null
                          }
                          onClick={() => {
                            console.log(p);
                            if (p === "Autre") {
                              setShowPopUp({
                                status: true,
                                label: "app",
                              });
                              setShowMenu({
                                obj: "",
                                value: false,
                                focus: false,
                              });
                              return;
                            }
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
                          <span>{p}</span>
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
            <label htmlFor="experience" className="usn">
              Expérience professionnelle
            </label>
            <p>Depuis combien de temps possédez-vous ces compétences.</p>
          </div>
          <div className={styles.r}>
            <div
              className={
                showMenu.obj === "expPro" && showMenu.value
                  ? `${styles.inputR} ${styles.ic}`
                  : `${styles.inputR}`
              }
              id="expPro"
            >
              <input
                type="text"
                id="experience"
                value={newExpPro.obj}
                readOnly
                onFocus={() => {
                  showMenu.obj === "expPro" && showMenu.value && showMenu.focus
                    ? setShowMenu((prev) => ({
                        ...prev,
                        value: !prev.value,
                      }))
                    : setShowMenu({
                        ...showMenu,
                        focus: true,
                      });
                }}
                onClick={() => {
                  showMenu.obj === "expPro" && showMenu.value && !showMenu.focus
                    ? setShowMenu((prev) => ({
                        ...prev,
                        value: !prev.value,
                      }))
                    : setShowMenu({ obj: "expPro", value: true });
                }}
                placeholder="Expérience professionnelle"
                className={styles.ina}
              />
              <i
                onClick={() => {
                  showMenu.obj === "expPro" && showMenu.value
                    ? setShowMenu({ obj: "expPro", value: !showMenu.value })
                    : setShowMenu({ obj: "expPro", value: true });
                }}
              >
                <GoTriangleDown size={"1.25rem"} className="try1" />
              </i>
              {showMenu.obj === "expPro" && showMenu.value && (
                <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                  <div className={styles.stat}>
                    {expPro.map((p) => {
                      return (
                        <div
                          key={p}
                          className={
                            newExpPro.obj === p
                              ? `${styles.bg}  ${styles.po}`
                              : null
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
                          <span>{p}</span>
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
