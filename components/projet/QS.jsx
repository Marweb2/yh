/** @format */

"use client";

// styles
import styles from "../../styles/projet/QS.module.css";

// icons
import { PiWarningCircleFill } from "react-icons/pi";

// react
import { useEffect } from "react";

// components
import ClientOnly from "@/components/ClientOnly";
import { isEmpty } from "@/lib/utils/isEmpty";

export default function QS({
  newProjet,
  setNewProjet,
  projetQS,
  setProjetQS,
  isSubmit,
}) {
  useEffect(() => {
    const tab = projetQS
      .filter((item) => !isEmpty(item.obj) && item.obj?.length > 5)
      .map((item) => item.obj);
    setNewProjet((prev) => ({ ...prev, questions: tab }));
  }, [projetQS]);

  return (
    <ClientOnly>
      <div
        className={
          isSubmit.is ? `${styles.container} pen` : `${styles.container}`
        }
      >
        <div>
          <div className={styles.l}>
            <label htmlFor="projetQS">
              Veuillez indiquer un maximum de 6 questions que vous souhaitez
              posez à vos futur(e)s canditat(e)s.
            </label>
          </div>
        </div>
        <div className={styles.grid}>
          {projetQS.map((p, i) => (
            <div key={i}>
              {(i === 0 &&
                isSubmit.value &&
                newProjet.errorQS &&
                projetQS[i].obj?.trim()?.length < 5) ||
                (newProjet.errorQS &&
                  isSubmit.value &&
                  !isEmpty(projetQS[i].obj?.trim()) &&
                  projetQS[i].obj?.trim()?.length < 5 && (
                    <i>
                      <PiWarningCircleFill size={"1.25rem"} />
                      <span className={styles.badge}>* Champ obligatoire</span>
                    </i>
                  ))}

              <textarea
                value={p.obj}
                type="text"
                id={i === 0 ? "projetQS" : ""}
                className={
                  (i === 0 &&
                    isSubmit.value &&
                    newProjet.errorQS &&
                    projetQS[i].obj?.trim()?.length < 5) ||
                  (newProjet.errorQS &&
                    isSubmit.value &&
                    !isEmpty(projetQS[i].obj?.trim()) &&
                    projetQS[i].obj?.trim()?.length < 5)
                    ? `${styles.red} scr`
                    : "scr"
                }
                onChange={(e) =>
                  setProjetQS((prev) => {
                    const newArray = [...prev];
                    newArray[i] = { ...newArray[i], obj: e.target.value };
                    return newArray;
                  })
                }
                placeholder={`Question ${i + 1}...`}
              />
            </div>
          ))}
        </div>
      </div>
    </ClientOnly>
  );
}
