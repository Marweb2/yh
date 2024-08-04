/** @format */

"use client";

// styles
import styles from "../../styles/projet/Desc.module.css";
import dtStyles from "../../styles/projet/DT.module.css";

import { GoTriangleDown } from "react-icons/go";
import { HiChevronDown } from "react-icons/hi";
import { PiWarningCircleFill } from "react-icons/pi";
const statut = ["1,2,3"];
import select from "../../styles/projet/ProjectInfos.module.css";
import { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getDuree } from "../home/infohub/InfoProjet";

// react
import { useEffect } from "react";
import { isEmpty } from "@/lib/utils/isEmpty";
import { usePathname } from "next/navigation";

// components
import ClientOnly from "@/components/ClientOnly";

export const duree = [
  {
    txt: "Moins d'un mois",
    value: "-1",
  },
  {
    txt: "1 à 6 mois",
    value: "1-6",
  },
  {
    txt: "Plus de 6 mois",
    value: "+6",
  },
];

export default function Desc({
  projetctName,
  setProjectName,
  projectDesc,
  setProjectDesc,
  projectBudget,
  setProjectBudget,
  projectDuration,
  setProjectDuration,
  newProjet,
  setNewProjet,
  isSubmit,
  projectStatut,
  setProjectStatut,
  readOnly,
}) {
  const isNumber = (chaine) => {
    const nombre = Number(chaine);
    return !isNaN(nombre) && isFinite(nombre);
  };
  const [showDuree, setShowDuree] = useState(false);
  const [showStatut, setShowStatut] = useState(false);
  const [dureeLabel, setDureeLabel] = useState("");

  const statutRef = useRef();

  useEffect(() => {
    // projet name
    if (
      !isEmpty(projetctName.obj?.trim() && projetctName.obj?.trim()?.length > 2)
    ) {
      setNewProjet((prev) => ({ ...prev, name: projetctName.obj }));
    } else {
      setNewProjet((prev) => ({ ...prev, name: "" }));
    }
    // projet desc
    if (
      !isEmpty(projectDesc.obj?.trim()) &&
      projectDesc.obj?.trim()?.length > 5
    ) {
      setNewProjet((prev) => ({ ...prev, desc: projectDesc.obj }));
    } else {
      setNewProjet((prev) => ({ ...prev, desc: "" }));
    }

    // projet duree
    if (projectDuration.obj) {
      setNewProjet((prev) => ({
        ...prev,
        duree: projectDuration.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, duree: "" }));
    }

    // projet statut
    if (projectStatut?.obj) {
      setNewProjet((prev) => ({
        ...prev,
        statut: projectStatut?.obj,
      }));
    } else {
      setNewProjet((prev) => ({ ...prev, statut: "" }));
    }
    if (projectDuration.obj) {
      setDureeLabel(getDuree(duree, projectDuration.obj));
    }
  }, [
    projetctName.obj,
    projectDesc.obj,
    projectDuration.obj,
    projectStatut?.obj,
  ]);

  const [showMenu, setShowMenu] = useState({
    obj: "",
    value: false,
  });

  const statut = ["Temps plein", "Temps partiel"];

  const pathname = usePathname();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (showDuree || showStatut) {
        console.log(
          "cc2",
          e.target.className,
          e.target.className !== "c-pointer" || e.target.className !== "item"
        );
        if (
          e.target.className !== "c-pointer" &&
          e.target.className !== "item"
        ) {
          setShowDuree(false);
          setShowStatut(false);
        }
      }

      return window.removeEventListener("click", () => console.log(""));
    });
  }, [showDuree, showStatut]);

  return (
    <ClientOnly>
      <div
        className={
          isSubmit.is ? `${styles.container} pen` : `${styles.container}`
        }
      >
        <div>
          <div className={styles.l}>
            <label htmlFor="projectName" className="usn">
              Nom du projet
            </label>
          </div>
          <div className={styles.r}>
            {isSubmit.value && isEmpty(newProjet.name) && (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            )}
            <input
              type="text"
              id="projectName"
              onChange={(e) =>
                setProjectName((prev) => ({ ...prev, obj: e.target.value }))
              }
              value={projetctName.obj}
              className={
                isSubmit.value && isEmpty(newProjet.name)
                  ? `${styles.red}`
                  : null
              }
              placeholder="Mon projet"
              readOnly={pathname === "/mes-projets"}
            />
          </div>
        </div>
        <div>
          <div className={styles.l}>
            <label htmlFor="desc" className="usn">
              Description
            </label>
          </div>
          <div className={`${styles.r} ${styles.contTxt}`}>
            {isSubmit.value && isEmpty(newProjet.desc) && (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            )}
            <textarea
              type="text"
              id="desc"
              onChange={(e) =>
                setProjectDesc((prev) => ({ ...prev, obj: e.target.value }))
              }
              className={
                isSubmit.value && isEmpty(newProjet.desc)
                  ? `${styles.red} scr`
                  : "scr"
              }
              value={projectDesc.obj}
              placeholder="Description ..."
              rows={5}
              readOnly={readOnly}
            />
          </div>
        </div>
        <div>
          <div className={styles.l}>
            <label htmlFor="projectBudget" className="usn">
              Durée du projet
            </label>
          </div>
          <div className={`${styles.r} rel ${styles.min}`}>
            {isSubmit.value && isEmpty(newProjet.duree) ? (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            ) : (
              <i
                style={{ color: "#d9d9d9" }}
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  setShowStatut(false);
                  setShowDuree((a) => !a);
                }}
                className={`usn c-pointer`}
              >
                <GoTriangleDown size={"1.4rem"} />
              </i>
            )}
            <input
              className={
                isSubmit.value && isEmpty(newProjet.duree)
                  ? `${styles.red}`
                  : "c-pointer"
              }
              onClick={() => {
                if (readOnly) {
                  return;
                }
                setShowStatut(false);
                setShowDuree((a) => !a);
              }}
              // onChange={(e) => {
              //   setProjectDuration((prev) => ({
              //     ...prev,
              //     obj: e.target.value,
              //   }));
              // }}
              readOnly
              value={dureeLabel || ""}
              type="text"
              id="projectBudget"
              placeholder="Durée"
            />
            {
              <div ref={statutRef} className={showDuree ? "drop" : "h0"}>
                {showDuree &&
                  duree.map((a, i) => {
                    return (
                      <div
                        onClick={() => {
                          setProjectDuration({ obj: a.value });
                          setDureeLabel(a.txt);
                          setShowDuree(false);
                        }}
                        className="item"
                        key={i}
                      >
                        {a.txt}
                      </div>
                    );
                  })}
              </div>
            }
          </div>
        </div>
        {/* <div>
          <div className={styles.l}>
            <label htmlFor="projectDuration" className="usn">
              Nombre d{"'"}heure estimé
            </label>
          </div>
          <div className={`${styles.r} ${styles.min}`}>
            {isSubmit.value && isEmpty(newProjet.duree) ? (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            ) : (
              <i className={`${styles.sym} usn`}>h</i>
            )}
            <input
              className={
                isSubmit.value && isEmpty(newProjet.duree)
                  ? `${styles.red}`
                  : null
              }
              onChange={(e) =>
                setProjectDuration((prev) => ({ ...prev, obj: e.target.value }))
              }
              value={projectDuration.obj || ""}
              type="text"
              id="projectDuration"
              placeholder="0"
            />
          </div>
        </div> */}
        <div>
          <div className={styles.l}>
            <label htmlFor="projectStatut" className="usn">
              Statut
            </label>
          </div>
          <div className={`${styles.r} rel ${styles.min}`}>
            {isSubmit.value && isEmpty(newProjet.statut) ? (
              <i>
                <PiWarningCircleFill size={"1.25rem"} />
                <span className={styles.badge}>* Champ obligatoire</span>
              </i>
            ) : (
              <i
                style={{ color: "#d9d9d9" }}
                onClick={() => {
                  if (readOnly) {
                    return;
                  }
                  setShowDuree(false);
                  setShowStatut((a) => !a);
                }}
                className={`usn c-pointer`}
              >
                <GoTriangleDown size={"1.4rem"} />
              </i>
            )}
            <input
              className={
                isSubmit.value && isEmpty(newProjet.statut)
                  ? `${styles.red}`
                  : "c-pointer"
              }
              onClick={() => {
                if (readOnly) {
                  return;
                }
                setShowDuree(false);
                setShowStatut((a) => !a);
              }}
              onChange={(e) => {
                setProjectBudget((prev) => ({
                  ...prev,
                  obj: e.target.value,
                }));
              }}
              readOnly
              value={projectStatut?.obj || ""}
              type="text"
              id="projectStatut"
              placeholder="Statut"
            />
            {
              <div ref={statutRef} className={showStatut ? "drop" : "h0"}>
                {showStatut &&
                  statut.map((a, i) => {
                    return (
                      <div
                        onClick={() => {
                          setProjectStatut({ obj: a });
                          setShowStatut(false);
                        }}
                        className="item"
                        key={i}
                      >
                        {a}
                      </div>
                    );
                  })}
              </div>
            }
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
