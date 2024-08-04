/** @format */
"use client";

import styles from "@/styles/home/profil/Offres.module.css";
import { GoTriangleDown } from "react-icons/go";

const App = () => {
  return (
    <div>
      <div className={styles.l}>
        <label htmlFor="tarif" className="usn">
          Tarifications
        </label>
        <p>
          Indiquez vos préférences de tarifications et si vous acceptez des
          contrats forfaitaires ou bénévolats.
        </p>
      </div>
      <div className={styles.grid} /*ref={ref}*/>
        <div className={styles.tht}>
          <label htmlFor="tarif">Taux horaires</label>
        </div>
        <div className={`${styles.inputR} scr`}>
          <input
            type="text"
            id="tarif"
            value={/*!isEmpty(newTh.obj) ? newTh.obj + */ "$ / h"}
            readOnly
            onClick={() =>
              setShowMenu((prev) => ({
                obj: "tarif",
                value: prev.obj === "tarif" ? !prev.value : true,
              }))
            }
            placeholder="$ / h"
            className={styles.ina}
          />
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
          {
            /*showMenu.obj === "tarif" && showMenu.value*/ false && (
              <div className={`${styles.menuDeroulant} ${styles.hidden} scr`}>
                <div className={styles.stat}>
                  {[0, 1, 2, 3, 4, 5, 6].map((p) => {
                    return (
                      <div
                        key={p}
                        className={newTh.obj === p ? `${styles.active}` : null}
                        onClick={() => {
                          setNewTh((prev) => ({
                            ...prev,
                            obj: prev.obj === p ? null : p,
                          }));
                          setShowMenu(() => ({
                            obj: "",
                            value: false,
                          }));
                        }}
                      >
                        <span>{p}$</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default App;
