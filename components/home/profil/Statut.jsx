/** @format */

"use client";
import styles from "../../../styles/home/profil/Statut.module.css";
import { statut, statutCli } from "@/lib/menuDeroulant";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";
import { useSelector } from "react-redux";
import { isValidLinkController } from "@/lib/controllers/http.controller";
import { BsShare } from "react-icons/bs";
import { GoTriangleDown } from "react-icons/go";
import { isEmpty } from "@/lib/utils/isEmpty";

export default function Statut({
  newStatutPro,
  setNewStatutPro,
  newLienProfessionnelle,
  setNewLienProfessionnelle,
  setNewPortfolio,
  newPortfolio,
  isSubmit,
  setInfosToUpdate,
}) {
  const { user } = useSelector((state) => state.user);
  const { userType } = useSelector((state) => state.persistInfos);
  const ref = useRef();
  const [showMenu, setShowMenu] = useState({
    obj: "",
    value: false,
  });
  useEffect(() => {
    // statut pro
    if (user.statutProfessionnelle !== newStatutPro.obj) {
      if (!newStatutPro.value) {
        setNewStatutPro((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({
        ...prev,
        statutProfessionnelle: newStatutPro.obj,
      }));
    } else if (user.statutProfessionnelle === newStatutPro.obj) {
      if (newStatutPro.value) {
        setNewStatutPro((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { statutProfessionnelle, ...nwe } = prev;
        return nwe;
      });
    }

    // portfolio
    if (
      newPortfolio.obj !== user.portfolio &&
      (isEmpty(newPortfolio.obj?.trim()) ||
        isValidLinkController(newPortfolio.obj))
    ) {
      if (!newPortfolio.value) {
        setNewPortfolio((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({ ...prev, portfolio: newPortfolio.obj }));
    } else if (
      newPortfolio.obj === user.portfolio ||
      !isValidLinkController(newPortfolio.obj)
    ) {
      if (newPortfolio.value) {
        setNewPortfolio((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { portfolio, ...nwe } = prev;
        return nwe;
      });
    }

    // lien pro
    if (
      newLienProfessionnelle.obj !== user.lienProfessionnelle &&
      (isValidLinkController(newLienProfessionnelle.obj) ||
        isEmpty(newLienProfessionnelle.obj?.trim()))
    ) {
      if (!newLienProfessionnelle.value) {
        setNewLienProfessionnelle((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({
        ...prev,
        lienProfessionnelle: newLienProfessionnelle.obj,
      }));
    } else if (
      newLienProfessionnelle.obj === user.lienProfessionnelle ||
      !isValidLinkController(newLienProfessionnelle.obj)
    ) {
      if (newLienProfessionnelle.value) {
        setNewLienProfessionnelle((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { lienProfessionnelle, ...nwe } = prev;
        return nwe;
      });
    }
  }, [newStatutPro.obj, newPortfolio.obj, newLienProfessionnelle.obj]);

  useEffect(() => {
    if (!isEmpty(showMenu.obj)) {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
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

  const handleChangeLinkPro = (e) => {
    setNewLienProfessionnelle((prev) => {
      let nwe = { ...prev };
      nwe.obj = e.target.value;
      return nwe;
    });
  };

  const handleChangePortfolio = (e) => {
    setNewPortfolio((prev) => {
      let nwe = { ...prev };
      nwe.obj = e.target.value;
      return nwe;
    });
  };

  return (
    <ClientOnly>
      <div
        className={isSubmit ? `${styles.container} pen` : `${styles.container}`}
      >
        <div>
          <div
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
            className={styles.l}
          >
            <label htmlFor="statutPro" className="usn c-pointer">
              Statut professionnel
            </label>
            <p>Choisissez votre statut professionnel actuel.</p>
          </div>
          <div className={styles.r}>
            <div className={styles.inputR} ref={ref}>
              <input
                type="text"
                id="statutPro"
                value={newStatutPro.obj}
                readOnly
                onClick={() =>
                  setShowMenu((prev) => ({
                    obj: "statutPro",
                    value: prev.obj === "statutPro" ? !prev.value : true,
                  }))
                }
                placeholder="Statut"
                className={styles.ina}
              />
              <i
                onClick={() =>
                  setShowMenu((prev) => ({
                    obj: "statutPro",
                    value: prev.obj === "statutPro" ? !prev.value : true,
                  }))
                }
              >
                <GoTriangleDown size={"1.25rem"} className="try1" />
              </i>
              {showMenu.obj === "statutPro" && showMenu.value && (
                <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                  <div
                    style={{
                      color: "rgba(0, 0, 0, 0.7)",
                    }}
                    className={styles.stat}
                  >
                    {userType === "client"
                      ? statutCli.map((p) => {
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
                              <span>{p}</span>
                            </div>
                          );
                        })
                      : statut.map((p) => {
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

        {/* lienPro */}
        <div>
          <div
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
            className={styles.l}
          >
            <label htmlFor="lienPro" className="usn c-pointer">
              Lien professionnel
            </label>
            <p>Ajoutez un lien d{"'"}un réseau social professionnel.</p>
          </div>
          <div className={styles.r}>
            <input
              type="text"
              id="lienPro"
              onChange={handleChangeLinkPro}
              value={newLienProfessionnelle?.obj || ""}
              placeholder="https://..."
            />
            {isValidLinkController(newLienProfessionnelle.obj) ? (
              <Link
                target={"_blank"}
                href={newLienProfessionnelle.obj}
                className={styles.sh}
              >
                <BsShare className="try1" />
              </Link>
            ) : (
              <p className={`${styles.sh} ${styles.pdis}`}>
                <BsShare className="try1" />
              </p>
            )}
          </div>
        </div>

        {/* portfolio */}
        <div>
          <div
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
            className={styles.l}
          >
            <label htmlFor="prf" className="usn c-pointer">
              Lien portfolio
            </label>
            <p>
              Insérez un lien de vos projets sur lesquels vous avez récemment
              travaillé.
            </p>
          </div>
          <div className={styles.r}>
            <input
              type="text"
              id="prf"
              onChange={handleChangePortfolio}
              value={newPortfolio?.obj || ""}
              placeholder="https://..."
            />
            {isValidLinkController(newPortfolio.obj) ? (
              <Link
                target={"_blank"}
                href={newPortfolio.obj}
                className={styles.sh}
              >
                <BsShare className="try1" />
              </Link>
            ) : (
              <p className={`${styles.sh} ${styles.pdis}`}>
                <BsShare className="try1" />
              </p>
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
