"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/infohub/FilterComponent.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import {
  pays,
  lang,
  competVirt,
  statut,
  appWeb,
  expPro,
} from "@/lib/menuDeroulant";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { getFilters } from "@/lib/controllers/projet.controller";

export default function FilterComponent({
  comp,
  setComp,
  checked,
  setChecked,
}) {
  const { userType } = useSelector((state) => state.persistInfos);
  const { user } = useSelector((state) => state.user);
  const firstRender = useRef(true);

  useEffect(() => {
    const compLength = userType === "client" ? 6 : 3;
    if (firstRender.current) {
      Array.from({ length: compLength }, (_, index) =>
        setComp((prev) => [...prev, ""])
      );
      firstRender.current = false;
    }
    async function fetchData() {
      const data = await getFilters(user._id);
      if (data) {
        setChecked(data.noFilter);
        setComp([]);
        Array.from({ length: compLength }, (_, index) =>
          setComp((prev) => [
            ...prev,
            data.filter[index] ? data.filter[index] : "",
          ])
        );
      }
    }

    fetchData();
  }, []);

  return (
    <section
      style={{
        width: "100%",
        height: "100%",
        padding: "12px 8px 8px 8px",
      }}
    >
      {userType === "client" ? (
        <div className={styles.comp}>
          <div className={styles.left}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "300px",
              }}
            >
              <h4>Compétences virtuelles</h4>
              <p>
                Sélectionnez les compétences que vous souhaitez suivre sur votre
                fil d&apos;actualité
              </p>
            </div>
          </div>
          <div className={styles.right}>
            {comp.map((val, i) => (
              <Autocomplete
                key={i}
                disablePortal
                id="combo-box-demo"
                options={competVirt.filter(
                  (val) => !comp.find((value) => value === val)
                )}
                onInputChange={(e, value) => {
                  setComp((prev) => {
                    return prev.map((e, index) => (i === index ? value : e));
                  });
                }}
                value={comp[i]}
                sx={{ width: "100%", maxWidth: "350px" }}
                renderInput={(params) => (
                  <TextField {...params} label={`Compétence ${i + 1}`} />
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.comp}>
            <div className={styles.left}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxWidth: "300px",
                }}
              >
                <h4>Compétences par defaut</h4>
                <p>
                  Vos compétences préséléctionées lors de la mise à jour de
                  votre profil
                </p>
              </div>
            </div>
            <div style={{ paddingTop: "28px" }} className={styles.right}>
              {user?.competenceVirtuelle?.map((val, i) => (
                <Autocomplete
                  key={i}
                  disablePortal
                  id="combo-box-demo"
                  options={competVirt}
                  sx={{ width: "100%", maxWidth: "350px" }}
                  readOnly
                  value={val}
                  renderInput={(params) => (
                    <TextField {...params} label={`compétence ${i + 1}`} />
                  )}
                />
              ))}
            </div>
          </div>

          <div style={{ marginTop: "12px" }} className={styles.comp}>
            <div className={styles.left}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxWidth: "300px",
                }}
              >
                <h4>Compétences pour mon fil d&apos;actualité</h4>
                <p>
                  Vous pouvez sélectionner d&apos;autres compétences que vous
                  souhaitez voir apparaitre sur votre fil d&apos;actualité
                </p>
              </div>
            </div>
            <div style={{ paddingTop: "28px" }} className={styles.right}>
              {comp.map((val, i) => (
                <Autocomplete
                  key={i}
                  disablePortal
                  id="combo-box-demo"
                  options={competVirt.filter(
                    (val) =>
                      !comp.find((value) => value === val) &&
                      !user?.competenceVirtuelle?.find((value) => value === val)
                  )}
                  onInputChange={(e, value) => {
                    setComp((prev) => {
                      return prev.map((e, index) => (i === index ? value : e));
                    });
                  }}
                  value={comp[i]}
                  sx={{ width: "100%", maxWidth: "350px" }}
                  renderInput={(params) => (
                    <TextField {...params} label={`Compétence ${i + 1}`} />
                  )}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "15px",
        }}
        className={styles.comp}
      >
        <div className={styles.left}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "300px",
            }}
          >
            <h4>Tous</h4>
            <p>Choisissez cette option pour suivre toutes les Compétences </p>
          </div>
        </div>
        <div className={`${styles.right} ${styles.select}`}>
          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>
    </section>
  );
}
