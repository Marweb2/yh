/** @format */

"use client";
import styles from "../../../styles/home/profil/Infos.module.css";
import { pays, clientPays, lang } from "@/lib/menuDeroulant";
import { useRef, useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import Image from "next/image";
import frenchLogo from "../../../assets/french-1.png";
import englishLogo from "../../../assets/english.jpg";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { isEmpty } from "@/lib/utils/isEmpty";
import { VscCheckAll } from "react-icons/vsc";
import { GoTriangleDown } from "react-icons/go";
import { HiChevronDown } from "react-icons/hi";
export default function Infos({
  newUsername,
  setNewUsername,
  newName,
  setNewName,
  newPays,
  setNewPays,
  newVille,
  setNewVille,
  setNewLang,
  newLang,
  newProvince,
  setNewProvince,
  residence,
  setResidence,
  isSubmit,
  setInfosToUpdate,
  setShowPopUp,
}) {
  const { user } = useSelector((state) => state.user);
  const { userType } = useSelector((state) => state.persistInfos);
  const ref = useRef();
  const [showMenu, setShowMenu] = useState({
    obj: "",
    value: false,
  });

  useEffect(() => {
    // pays
    if (newPays.obj !== user.pays) {
      if (!newPays.value) {
        setNewPays((prev) => ({
          ...prev,
          value: true,
        }));
      }
      setInfosToUpdate((prev) => ({ ...prev, pays: newPays.obj }));
    } else if (newPays.obj === user.pays) {
      if (newPays.value) {
        setNewPays((prev) => ({
          ...prev,
          value: false,
        }));
      }
      setInfosToUpdate((prev) => {
        const { pays, ...nwe } = prev;
        return nwe;
      });
    }

    // ville
    if (newVille.obj !== user.ville) {
      if (!newVille.value) {
        setNewVille((prev) => ({
          ...prev,
          value: true,
        }));
      }
      setInfosToUpdate((prev) => ({ ...prev, ville: newVille.obj }));
    } else if (newVille.obj === user.ville) {
      if (newVille.value) {
        setNewVille((prev) => ({
          ...prev,
          value: false,
        }));
      }
      setInfosToUpdate((prev) => {
        const { ville, ...nwe } = prev;
        return nwe;
      });
    }

    // langue
    if (newLang.obj !== user.lang) {
      if (!newLang.value) {
        setNewLang((prev) => ({
          ...prev,
          value: true,
        }));
      }
      setInfosToUpdate((prev) => ({ ...prev, lang: newLang.obj }));
    } else if (newLang.obj === user.lang) {
      if (newLang.value) {
        setNewLang((prev) => ({
          ...prev,
          value: false,
        }));
      }
      setInfosToUpdate((prev) => {
        const { lang, ...nwe } = prev;
        return nwe;
      });
    }

    // province
    if (newProvince.obj !== user.province) {
      if (!newProvince.value) {
        setNewProvince((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({ ...prev, province: newProvince.obj }));
    } else if (newProvince.obj === user.province) {
      if (newProvince.value) {
        setNewProvince((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { province, ...nwe } = prev;
        return nwe;
      });
    }

    if (
      newUsername.obj?.trim() !== user.username &&
      newUsername.obj?.trim()?.length > 2
    ) {
      if (!newUsername.value) {
        setNewUsername((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({
        ...prev,
        username: newUsername.obj?.trim(),
      }));
    } else if (newUsername.obj?.trim() === user.username) {
      if (newUsername.value) {
        setNewUsername((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { username, ...nwe } = prev;
        return nwe;
      });
    }
    if (newName.obj?.trim() !== user.name && newName.obj?.trim().length > 2) {
      if (!newName.value) {
        setNewName((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({ ...prev, name: newName.obj?.trim() }));
    } else if (newName.obj?.trim() === user.name) {
      if (newName.value) {
        setNewName((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { name, ...nwe } = prev;
        return nwe;
      });
    }
  }, [
    newPays.obj,
    newVille.obj,
    newLang.obj,
    newProvince.obj,
    newPays.obj,
    newVille.obj,
    newProvince.obj,
    newUsername.obj,
    newName.obj,
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

  const handleChangeUsername = (e) => {
    setNewUsername((prev) => ({ ...prev, obj: e.target.value }));
  };

  const handleChangeName = (e) => {
    setNewName((prev) => ({ ...prev, obj: e.target.value }));
  };

  return (
    <ClientOnly>
      <div
        className={isSubmit ? `${styles.container} pen` : `${styles.container}`}
      >
        <div>
          <div className={styles.l}>
            <label
              style={{
                color: "rgba(0, 0, 0, 0.5)",
              }}
              htmlFor="prenom"
              className="usn c-pointer"
            >
              Nom
            </label>
            <p
              style={{
                color: "rgba(0, 0, 0, 0.7)",
              }}
            >
              Indiquez votre prénom et nom.
            </p>
          </div>
          <div className={`${styles.r} ${styles.foc}`}>
            <input
              type="text"
              id="prenom"
              onChange={handleChangeUsername}
              value={newUsername.obj}
              placeholder="Prénom"
            />
            <input
              type="text"
              onChange={handleChangeName}
              value={newName.obj}
              placeholder="Nom"
            />
          </div>
        </div>
        <div>
          <div
            style={{
              color: "rgba(0, 0, 0, 0.5)",
            }}
            className={styles.l}
          >
            <label htmlFor="lieu" className="usn c-pointer">
              Lieu de résidence
            </label>
            <p
              style={{
                color: "rgba(0, 0, 0, 0.7)",
              }}
            >
              Sélectionnez votre lieu de résidence.
            </p>
          </div>
          <div className={styles.r}>
            {/* pays */}
            <div>
              <div
                className={
                  showMenu.obj === "pays" && showMenu.value
                    ? `${styles.inputR} ${styles.ic}`
                    : `${styles.inputR}`
                }
                id="pays"
              >
                <input
                  type="text"
                  id="lieu"
                  onClick={() =>
                    setShowMenu((prev) => ({
                      obj: "pays",
                      value: prev.obj === "pays" ? !prev.value : true,
                    }))
                  }
                  value={newPays.obj}
                  readOnly
                  placeholder="Pays"
                  className={`${styles.ina} ${styles.pI}`}
                />
                <i
                  onClick={() =>
                    setShowMenu((prev) => ({
                      obj: "pays",
                      value: prev.obj === "pays" ? !prev.value : true,
                    }))
                  }
                >
                  <GoTriangleDown size={"1.25rem"} className="try1" />
                </i>
                {showMenu.obj === "pays" && showMenu.value && (
                  <div
                    className={`${styles.menuDeroulant} ${styles.hidden} scr`}
                  >
                    <div className={`${styles.pays}`}>
                      {
                        //userType === "client"
                        // ? clientPays.map((p) => {
                        //     return (
                        //       <div
                        //         key={p.pays}
                        //         className={
                        //           newPays.obj === p.pays
                        //             ? `${styles.bg} ${styles.np}`
                        //             : `${styles.np}`
                        //         }
                        //       >
                        //         <h1
                        //           onClick={() => {
                        //             console.log(p);
                        //             setNewPays((prev) => ({
                        //               ...prev,
                        //               obj: prev.obj === p.pays ? "" : p.pays,
                        //             }));
                        //             setResidence({
                        //               pays:
                        //                 newPays.obj === p.pays ? "" : p.pays,
                        //               ville:
                        //                 newPays.obj === p.pays ? "" : p.ville,
                        //               province:
                        //                 newPays.obj === p.pays
                        //                   ? ""
                        //                   : p.province
                        //                   ? p.province
                        //                   : "",
                        //             });
                        //             setShowMenu(() => ({
                        //               obj: "",
                        //               value: false,
                        //             }));
                        //             setNewVille((prev) => ({
                        //               ...prev,
                        //               obj: "",
                        //             }));
                        //             setNewProvince((prev) => ({
                        //               ...prev,
                        //               obj: "",
                        //             }));
                        //           }}
                        //         >
                        //           <span
                        //             style={{
                        //               color: "rgba(0, 0, 0, 0.7)",
                        //             }}
                        //           >
                        //             {p.pays}
                        //           </span>
                        //         </h1>
                        //       </div>
                        //     );
                        //   })
                        // :
                        pays.map((p) => {
                          return (
                            <div
                              key={p.pays}
                              className={
                                newPays.obj === p.pays
                                  ? `${styles.bg} ${styles.np}`
                                  : `${styles.np}`
                              }
                            >
                              <h1
                                onClick={() => {
                                  console.log(p);
                                  if (p.pays === "Autre") {
                                    setShowPopUp({
                                      status: true,
                                      label: "pays",
                                    });
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
                                    ville:
                                      newPays.obj === p.pays ? "" : p.ville,
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
                                <span>{p.pays}</span>
                              </h1>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ville */}
            {/* <div>
              <div
                className={
                  showMenu.obj === "ville" && showMenu.value
                    ? `${styles.inputR} ${styles.ic}`
                    : `${styles.inputR}`
                }
                ref={ref}
                id="ville"
              >
                <input
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
                  className={styles.ina}
                />

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
                {showMenu.obj === "ville" &&
                showMenu.value &&
                isEmpty(residence.pays) ? (
                  <div className={`${styles.menuDeroulant} scr`}>
                    <div className={styles.pays}>
                      {userType === "assistant"
                        ? pays.map((p) => {
                            if (!isEmpty(p.province)) {
                              return (
                                <div
                                  key={p.pays}
                                  className={
                                    newPays.obj === p.pays && newPays.value
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
                                        obj:
                                          newPays.obj === p.pays
                                            ? ""
                                            : p.province,
                                      }));
                                    }}
                                  >
                                    <span>{p.pays}</span>
                                    <i>
                                      <HiChevronDown className="try1" />
                                    </i>
                                  </h1>
                                  <div
                                    className={
                                      newPays.obj === p.pays && newPays.value
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
                                      <span>{p.province}</span>
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
                                                pays:
                                                  newVille.obj === v
                                                    ? ""
                                                    : p.pays,
                                                ville:
                                                  newVille.obj === v
                                                    ? ""
                                                    : p.ville,
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
                                    newPays.obj === p.pays && newPays.value
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
                                        obj:
                                          newPays.obj === p.pays
                                            ? ""
                                            : p.province,
                                      }));
                                    }}
                                  >
                                    <span>{p.pays}</span>
                                    <i>
                                      <HiChevronDown className="try1" />
                                    </i>
                                  </h1>
                                  <div
                                    className={
                                      newPays.obj === p.pays && newPays.value
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
                                            setShowMenu(() => ({
                                              obj: "",
                                              value: false,
                                            }));
                                            setResidence({
                                              pays:
                                                newVille.obj === p.pays
                                                  ? ""
                                                  : p.pays,
                                              ville:
                                                newVille.obj === p.pays
                                                  ? ""
                                                  : p.ville,
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
                          })
                        : clientPays.map((p) => {
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
                                      obj:
                                        newPays.obj === p.pays
                                          ? ""
                                          : p.province,
                                    }));
                                  }}
                                >
                                  <span>{p.pays}</span>
                                  <i>
                                    <HiChevronDown className="try1" />
                                  </i>
                                </h1>
                                <div
                                  className={
                                    newPays.obj === p.pays && newPays.value
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
                                          setShowMenu(() => ({
                                            obj: "",
                                            value: false,
                                          }));
                                          setResidence({
                                            pays:
                                              newVille.obj === v ? "" : p.pays,
                                            ville:
                                              newVille.obj === v ? "" : p.ville,
                                            province:
                                              newVille.obj === v
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
                                      v === newVille.obj
                                        ? `${styles.blue}`
                                        : null
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
          </div>
        </div>

        {/* langue */}
        <div>
          <div
            style={{
              color: "rgba(0, 0, 0, 0.5)",
            }}
            className={styles.l}
          >
            <label htmlFor="lang" className="usn c-pointer">
              Langue
            </label>
            <p
              style={{
                color: "rgba(0, 0, 0, 0.7)",
              }}
            >
              Spécifiez votre langue de préférence pour recevoir les avis
              potentiels.
            </p>
          </div>
          <div className={styles.r}>
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
                onClick={() =>
                  setShowMenu((prev) => ({
                    obj: "langue",
                    value: prev.obj === "langue" ? !showMenu.value : true,
                  }))
                }
                className="usn"
              />

              <i
                onClick={() =>
                  setShowMenu((prev) => ({
                    obj: "langue",
                    value: prev.obj === "langue" ? !showMenu.value : true,
                  }))
                }
              >
                <GoTriangleDown size={"1.25rem"} className="try1" />
              </i>
              {showMenu.obj === "langue" && showMenu.value && (
                <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                  <div className={styles.pays}>
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
                          <span
                            style={{
                              color: "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            {p.obj}
                          </span>
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
