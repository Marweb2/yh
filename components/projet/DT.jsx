/** @format */

"use client";
import styles from "../../styles/projet/DT.module.css";
import { delai, tarifications } from "@/lib/menuDeroulant";
import { useRef, useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import { useEffect } from "react";
import { isEmpty } from "@/lib/utils/isEmpty";
import { GoStopwatch, GoTriangleDown } from "react-icons/go";
import Calendar from "../home/Calendar";
import { PiWarningCircleFill } from "react-icons/pi";
export default function DT({
  newDelai,
  setNewDelai,
  newTh,
  setNewTh,
  newBenevolat,
  setNewBenevolat,
  newMTF,
  setNewMTF,
  newDisp,
  setNewDisp,
  canUpdate,
  setCanUpdate,
  isValidDisp,
  setIsValidDisp,
  isSubmit,
  newProjet,
  setNewProjet,
  setInfosToUpdate,
  isLoading,
  readOnly,
  newUniteMonaitaire,
  setNewUniteMonaitaire,
}) {
  const [showMenu, setShowMenu] = useState({
    obj: "",
    value: false,
  });

  const [isMobile, setIsMobile] = useState(false);
  const refCalendar = useRef();
  const firstRender = useRef(true);
  // const size = useRef(0);

  const [size, setSize] = useState({ width: 0, height: 0 });

  let val = 0;

  useEffect(() => {
    const div = document.getElementById("calendar");
    if (refCalendar.current && firstRender.current) {
      const { width } = refCalendar?.current?.getBoundingClientRect();
      setSize({ width });
      firstRender.current = false;
    }
  });

  useEffect(() => {
    if (window.innerWidth < 500) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth < 500) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });

    return () =>
      window.removeEventListener("resize", () => {
        if (window.innerWidth < 500) {
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      });
  }, []);

  useEffect(() => {
    // delai
    if (!isEmpty(newDelai.obj)) {
      setNewProjet((prev) => ({
        ...prev,
        delai: newDelai.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, delai: "" }));
    }

    // tarif
    if (!isEmpty(newTh.obj)) {
      setNewProjet((prev) => ({
        ...prev,
        tarif: newTh.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, tarif: "" }));
    }

    //unité Monaitaire
    if (!isEmpty(newUniteMonaitaire)) {
      setNewProjet((prev) => ({
        ...prev,
        uniteMonaitaire: newUniteMonaitaire?.obj,
      }));
    }

    // benevolat
    if (newBenevolat.obj !== newProjet.benevolat) {
      setNewProjet((prev) => ({
        ...prev,
        benevolat: newBenevolat.obj,
      }));
    }

    // montant forfaitaire
    if (newMTF.obj !== newProjet.montantForfaitaire) {
      setNewProjet((prev) => ({
        ...prev,
        montantForfaitaire: newMTF.obj,
      }));
    }
  }, [
    newDisp.obj,
    newDelai.obj,
    newTh.obj,
    newBenevolat.obj,
    newMTF.obj,
    newUniteMonaitaire?.obj,
  ]);

  useEffect(() => {
    if (!isEmpty(showMenu.obj)) {
      const compt = document.getElementById(showMenu.obj);
      const handleClickOutside = (e) => {
        if (e.target.id !== compt) {
          setShowMenu(() => () => ({
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

  const handleChangeMTF = (newValue) => {
    setNewMTF((prev) => ({
      ...prev,
      obj: prev?.obj !== newValue ? newValue : null,
    }));
  };

  const handleChangeBenevolat = (newValue) => {
    setNewBenevolat((prev) => ({
      ...prev,
      obj: prev?.obj !== newValue ? newValue : null,
    }));
  };

  return (
    <ClientOnly>
      <div
        className={
          isSubmit.is ? `${styles.container} pen` : `${styles.container}`
        }
      >
        {/* disponibilite */}
        <div>
          <div className={styles.l}>
            <label htmlFor="projectDuration" className="usn">
              Disponibilités
            </label>
            <p>Veuillez indiquer les disponibilités recherchées</p>
            <div>
              <span className={styles.green} />
              <label htmlFor="">Disponible</label>
            </div>
            <div>
              <span className={styles.red} />
              <label htmlFor="">Indisponible</label>
            </div>
          </div>
          <div className={styles.r}>
            <div ref={refCalendar} style={{ width: "210px" }} id="calendar">
              <h1
                className={
                  isSubmit.value && isEmpty(newProjet.disponibilite)
                    ? `${styles.rh1}`
                    : null
                }
              >
                {isSubmit.value && isEmpty(newProjet.disponibilite) && (
                  <i className={`${styles.errI} ${styles.iT}`}>
                    <PiWarningCircleFill size={"1.25rem"} />
                    <span className={styles.badge}>* Champ obligatoire</span>
                  </i>
                )}
                <span className="usn">Disponibilités</span>
              </h1>
              <Calendar
                newDisp={newDisp}
                setNewDisp={setNewDisp}
                setInfosToUpdate={setInfosToUpdate}
                canUpdate={canUpdate}
                isLoading={isLoading}
                isValidDisp={isValidDisp}
                setIsValidDisp={setIsValidDisp}
                newProjet={newProjet}
                setNewProjet={setNewProjet}
                setCanUpdate={setCanUpdate}
                isProject
                blue
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>

        {/* délai */}
        <div>
          <div className={`${styles.l} ${styles.max}`}>
            <label htmlFor="delai" className="usn">
              <i>
                <GoStopwatch size={"1.5rem"} />
              </i>
              <span>
                Délai donné à l{"'"}adjointe virtuelle pour manifester son
                intérêt.
              </span>
            </label>
          </div>
          <div className={`${styles.r}  ${styles.min}`}>
            <div
              style={{ width: size.width }}
              className={`${styles.inputR} ${styles.width} `}
            >
              <i
                onClick={() => {
                  if (readOnly) return;
                  setShowMenu((prev) => ({
                    obj: "delai",
                    value: prev.obj === "delai" ? !prev.value : true,
                  }));
                }}
              >
                <GoTriangleDown size={"1.25rem"} className="try1" />
              </i>
              <input
                type="text"
                id="delai"
                className="c-pointer"
                value={!isEmpty(newDelai.obj) ? newDelai.obj + " h" : "Aucun"}
                readOnly
                onClick={() => {
                  if (readOnly) return;
                  setShowMenu((prev) => ({
                    obj: "delai",
                    value: prev.obj === "delai" ? !prev.value : true,
                  }));
                }}
                placeholder="h"
              />

              {showMenu.obj === "delai" && showMenu.value && (
                <div className={`${styles.menuDeroulant} scr`}>
                  <div className={styles.sim}>
                    {delai.map((p) => {
                      return (
                        <div
                          key={p}
                          className={
                            newDelai.obj === p ? `${styles.active}` : null
                          }
                          onClick={() =>
                            setNewDelai((prev) => ({
                              ...prev,
                              obj: prev.obj === p ? null : p,
                            }))
                          }
                        >
                          <label
                            style={{
                              color: newDelai.obj !== p && "rgba(0, 0, 0, 0.7)",
                              minHeight: "14px",
                            }}
                            className="usn"
                          >
                            {p} h
                          </label>
                        </div>
                      );
                    })}
                    <div
                      className={
                        newDelai.obj === null ? `${styles.active}` : null
                      }
                      onClick={() =>
                        setNewDelai((prev) => ({
                          ...prev,
                          obj: null,
                        }))
                      }
                    >
                      <label className="usn">Aucun</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* tarif */}
        <div className={styles.tarif}>
          <div className={styles.l}>
            <label htmlFor="tarif" className="usn">
              Tarifications
            </label>
          </div>
          <div className="tarification-container">
            <div className={` ${styles.min} ${styles.r}`}>
              <section className={styles.grid}>
                <div className={styles.tht}>
                  <label htmlFor="tarif">Taux horaires</label>
                </div>
                {!isMobile ? (
                  <div className={`${styles.inputR} scr`}>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <input
                        style={{
                          width: "100px",
                          padding: "6px",
                        }}
                        value={newTh.obj}
                        onChange={(e) => {
                          if (e.target.value > 0) {
                            setNewTh({ value: true, obj: e.target.value });
                          } else {
                            setNewTh({ value: true, obj: 0 });
                          }
                        }}
                        type="number"
                        placeholder="Montant"
                        min={0}
                        id="tarif"
                        readOnly={readOnly}
                      />
                      {/* <select
                      onChange={(e) =>
                        setNewUniteMonaitaire({
                          obj: e.target.value,
                          value: true,
                        })
                      }
                      className="c-pointer"
                      style={{
                        width: "65px",
                      }}
                      name="money"
                      disabled={readOnly}
                    >
                      <option value="Ariary">Ariary</option>
                      <option value="Dollar">Dollar</option>
                      <option selected value="Euro">
                        Euro
                      </option>
                    </select> */}
                    </div>
                  </div>
                ) : (
                  <div className={`${styles.inputR} scr`}>
                    {isSubmit.value && isEmpty(newTh.obj) ? (
                      <i className={styles.errI}>
                        <PiWarningCircleFill size={"1.25rem"} />
                        <span className={styles.badge}>
                          * Champ obligatoire
                        </span>
                      </i>
                    ) : (
                      <i
                        onClick={() => {
                          if (readOnly) return;
                          setShowMenu((prev) => ({
                            obj: "tarif",
                            value: prev.obj === "tarif" ? !prev.value : true,
                          }));
                        }}
                      >
                        <GoTriangleDown size={"1.25rem"} className="try1" />
                      </i>
                    )}

                    <input
                      type="text"
                      id="tarif"
                      value={!isEmpty(newTh.obj) ? newTh.obj : ""}
                      readOnly
                      onClick={() => {
                        if (readOnly) return;
                        setShowMenu((prev) => ({
                          obj: "tarif",
                          value: prev.obj === "tarif" ? !prev.value : true,
                        }));
                      }}
                      placeholder="Montant"
                      className={
                        isSubmit.value && isEmpty(newTh.obj)
                          ? `${styles.red} ${styles.red}`
                          : null
                      }
                    />

                    {showMenu.obj === "tarif" && showMenu.value && (
                      <div
                        className={`${styles.menuDeroulant} ${styles.hidden} scr`}
                      >
                        <div className={styles.sim}>
                          {tarifications.map((p) => {
                            return (
                              <div
                                key={p}
                                className={
                                  newTh.obj === p ? `${styles.active}` : null
                                }
                                onClick={() =>
                                  setNewTh((prev) => ({
                                    ...prev,
                                    obj: prev.obj === p ? null : p,
                                  }))
                                }
                              >
                                <label
                                  style={{
                                    minHeight: "10px",
                                  }}
                                >
                                  {p}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
              <section className={styles.grid}>
                <div>
                  <div className={styles.lftl}>
                    <label htmlFor="my">Montant forfaitaire</label>
                  </div>
                </div>
                <div className={styles.chrt}>
                  <div>
                    <input
                      type="checkbox"
                      onChange={() => {
                        if (readOnly) return;
                        handleChangeMTF(true);
                      }}
                      checked={newMTF?.obj === true}
                      name="mn"
                      id="my"
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              </section>
              <section className={styles.grid}>
                <div>
                  <div className={styles.lftl}>
                    <label htmlFor="by">Bénévolat</label>
                  </div>
                </div>
                <div className={styles.chrt}>
                  <div>
                    <input
                      type="checkbox"
                      onChange={() => {
                        if (readOnly) return;
                        handleChangeBenevolat(true);
                      }}
                      checked={newBenevolat?.obj === true}
                      name="bn"
                      id="by"
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        {/* <div>
          <div className={styles.l}>
            <label htmlFor="tarif" className="usn">
              Tarifications
            </label>
          </div>
          <div className={`${styles.grid} ${styles.min} ${styles.r}`}>
            <div className={styles.tht}>
              <label htmlFor="tarif">Taux horaires</label>
            </div>
            <div className={`${styles.inputR} scr`}>
              {isSubmit.value && isEmpty(newTh.obj) ? (
                <i className={styles.errI}>
                  <PiWarningCircleFill size={"1.25rem"} />
                  <span className={styles.badge}>* Champ obligatoire</span>
                </i>
              ) : (
                <i
                  onClick={() =>
                    setShowMenu((prev) => ({
                      obj: "tarif",
                      value: prev.obj === "tarif" ? !prev.value : true,
                    }))
                  }
                >
                  <GoTriangleDown size={"1.25rem"} className="try1" />
                </i>
              )}

              <input
                type="text"
                id="tarif"
                value={!isEmpty(newTh.obj) ? newTh.obj + "$ / h" : ""}
                readOnly
                onClick={() =>
                  setShowMenu((prev) => ({
                    obj: "tarif",
                    value: prev.obj === "tarif" ? !prev.value : true,
                  }))
                }
                placeholder="$ / h"
                className={
                  isSubmit.value && isEmpty(newTh.obj)
                    ? `${styles.red} ${styles.red}`
                    : null
                }
              />

              {showMenu.obj === "tarif" && showMenu.value && (
                <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                  <div className={styles.sim}>
                    {tarifications.map((p) => {
                      return (
                        <div
                          key={p}
                          className={
                            newTh.obj === p ? `${styles.active}` : null
                          }
                          onClick={() =>
                            setNewTh((prev) => ({
                              ...prev,
                              obj: prev.obj === p ? null : p,
                            }))
                          }
                        >
                          <span>{p}$</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div />
            <div />
            <div>
              <div className={styles.lftl}>
                <label htmlFor="my">Montant forfaitaire</label>
              </div>
            </div>
            <div className={styles.chrt}>
              <div>
                <input
                  type="checkbox"
                  onChange={() => handleChangeMTF(true)}
                  checked={newMTF?.obj === true}
                  name="mn"
                  id="my"
                />
              </div>
            </div>
            <div>
              <div className={styles.lftl}>
                <label htmlFor="by">Bénévolat</label>
              </div>
            </div>
            <div className={styles.chrt}>
              <div>
                <input
                  type="checkbox"
                  onChange={() => handleChangeBenevolat(true)}
                  checked={newBenevolat?.obj === true}
                  name="bn"
                  id="by"
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </ClientOnly>
  );
}
