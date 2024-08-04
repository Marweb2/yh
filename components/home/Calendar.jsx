/** @format */

"use client";

// styles
import styles from "../../styles/home/Calendar.module.css";

import ClientOnly from "../ClientOnly";
import { HiPencil } from "react-icons/hi";
import { MdOutlineCheck } from "react-icons/md";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "@/lib/utils/isEmpty";

const day = [
  { short: "L", long: "Lundi" },
  { short: "M", long: "Mardi" },
  { short: "M", long: "Mercredi" },
  { short: "J", long: "Jeudi" },
  { short: "V", long: "Vendredi" },
  { short: "S", long: "Samedi" },
  { short: "D", long: "Dimanche" },
];

const hour = ["AM", "PM", "SOIR"];

export default function Calendar({
  handlesubmit,
  setCanUpdate,
  canUpdate,
  newDisp,
  setNewDisp,
  isValidDisp,
  setIsValidDisp,
  isLoading,
  newProjet,
  setNewProjet,
  setIsCollapse,
  setInfosToUpdate,
  isLeft,
  isProject,
  blue,
  readOnly,
}) {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // disponibilite
    if (isProject && !readOnly) {
      if (
        isValidDisp &&
        JSON.stringify(newDisp.obj) !== JSON.stringify(newProjet.disponibilite)
      ) {
        if (!newDisp.value) {
          setNewDisp((prev) => ({ ...prev, value: true }));
        }
        setNewProjet((prev) => ({ ...prev, disponibilite: newDisp.obj }));
        setIsValidDisp(false);
      }
    } else if (!readOnly) {
      if (JSON.stringify(newDisp.obj) !== JSON.stringify(user.disponibilite)) {
        if (!newDisp.value) {
          setNewDisp((prev) => ({ ...prev, value: true }));
        }
        setInfosToUpdate((prev) => ({ ...prev, disponibilite: newDisp.obj }));
      } else if (
        JSON.stringify(newDisp.obj) === JSON.stringify(user.disponibilite)
      ) {
        if (newDisp.value) {
          setNewDisp((prev) => ({ ...prev, value: false }));
        }
        setInfosToUpdate((prev) => {
          const { disponibilite, ...nwe } = prev;
          return nwe;
        });
      }
    }
  }, [newDisp.obj, isValidDisp]);

  const handleOptionClick = (dIndex, hIndex) => {
    setNewDisp((prev) => {
      const newNumber = Number(`${dIndex}${hIndex}`);
      const arrayOfUniqNumber = new Set(prev.obj); // Utiliser prev.obj au lieu de prev
      if (arrayOfUniqNumber.has(newNumber)) {
        arrayOfUniqNumber.delete(newNumber);
      } else {
        arrayOfUniqNumber.add(newNumber);
      }
      return {
        ...prev,
        obj: Array.from(arrayOfUniqNumber).sort((a, b) => a - b),
      };
    });
  };

  const verifyDisp = (dIndex, hIndex) => {
    const disp = Number(`${dIndex}${hIndex}`);
    return newDisp.obj?.includes(disp);
  };

  return (
    <ClientOnly>
      <div
        className={
          blue
            ? isLoading
              ? `${styles.container}  ${styles.blue} pen`
              : `${styles.container} ${styles.blue} `
            : isLoading
            ? `${styles.container} pen`
            : `${styles.container}`
        }
      >
        <div className={styles.left}>
          {readOnly ? (
            <div className={`${styles.clt} usn`}>D</div>
          ) : (
            <div>
              {canUpdate ? (
                <button
                  type={isProject ? "button" : "submit"}
                  className={
                    isLoading
                      ? `${styles.submit} ${styles.submitLoading}`
                      : `${styles.submit}`
                  }
                  onClick={(e) => {
                    setCanUpdate(false);
                    if (isLeft) {
                      setIsCollapse((prev) => ({ ...prev, obj: "profil" }));
                    }
                    if (isProject) {
                      setIsValidDisp(true);
                    } else {
                      handlesubmit(e);
                    }
                  }}
                >
                  <i>
                    <MdOutlineCheck />
                  </i>
                </button>
              ) : (
                <label
                  className={styles.edit}
                  onClick={() => {
                    if (isLeft) {
                      setIsCollapse((prev) => ({ ...prev, obj: "profil" }));
                    }
                    if (isProject) {
                      setIsValidDisp(false);
                    }
                    setCanUpdate(true);
                  }}
                >
                  <i>
                    <HiPencil />
                  </i>
                </label>
              )}
            </div>
          )}
          <div className={styles.ht}>
            {hour.map((h, i) => (
              <div key={i}>
                <span className="usn">{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          {day.map((d, dIndex) => (
            <div key={d.long}>
              <div className={styles.dt}>
                <label className="usn">{d.short}</label>
              </div>
              <div className={styles.d}>
                {Array.from({ length: hour?.length }).map((_, hIndex) => (
                  <div
                    key={hIndex}
                    onClick={() => {
                      if (canUpdate && !readOnly) {
                        handleOptionClick(dIndex, hIndex);
                      }
                    }}
                  >
                    <span
                      className={
                        verifyDisp(dIndex, hIndex)
                          ? `${styles.jca} pen`
                          : isEmpty(user.disponibilite) && !canUpdate
                          ? isProject
                            ? `${styles.jcd} pen`
                            : "pen"
                          : canUpdate
                          ? `${styles.jcd}`
                          : `${styles.jcd} pen`
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientOnly>
  );
}
