/** @format */

"use client";

// styles
import styles from "../../../styles/home/profil/ProfilMiddle.module.css";

// components
import CV from "./CV";
import Infos from "./Infos";
import Offres from "./Offres";
import Statut from "./Statut";
import ClientOnly from "@/components/ClientOnly";

// react
import { useState } from "react";

// icons
import { HiPencilAlt } from "react-icons/hi";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

// redux
import { useSelector } from "react-redux";

const MENU = {
  INFOS: 0,
  STATUT: 1,
  CP: 2,
  OFFRES: 3,
};

export default function ProfilMiddle({
  handleSubmit,
  handleReset,
  newUsername,
  setNewUsername,
  newName,
  setNewName,
  newPays,
  setNewPays,
  newVille,
  setNewVille,
  newProvince,
  setNewProvince,
  residence,
  setResidence,
  newLang,
  setNewLang,
  newStatutPro,
  setNewStatutPro,
  newLienProfessionnelle,
  setNewLienProfessionnelle,
  newPortfolio,
  setNewPortfolio,
  newCmp,
  setNewCmp,
  newApp,
  setNewApp,
  newExpPro,
  setNewExpPro,
  newOffres,
  setNewOffres,
  newTh,
  setNewTh,
  newBenevolat,
  setNewBenevolat,
  newMTF,
  setNewMTF,
  isSubmit,
  infosToUpdate,
  setInfosToUpdate,
  setNewDevise,
  newDevise,
  setShowPopUp,
}) {
  const { userType } = useSelector((state) => state.persistInfos);
  const [active, setActive] = useState(MENU.INFOS);
  const onBack = () => {
    setActive((value) => value - 1);
  };

  const onNext = () => {
    setActive((value) => value + 1);
  };

  return (
    <ClientOnly>
      <div className={styles.container}>
        <div className={styles.top}>
          <span>
            <HiPencilAlt size={"1.5rem"} />
          </span>
          <label>Mettre à jour le profil</label>
        </div>
        <div className={styles.menu}>
          <div
            onClick={() => setActive(0)}
            className={active === MENU.INFOS ? `${styles.active}` : null}
          >
            <label
              style={{
                cursor: "pointer",
              }}
            >
              Informations personnelles
            </label>
          </div>
          <div
            onClick={() => setActive(1)}
            className={active === MENU.STATUT ? `${styles.active}` : null}
          >
            {/* 
            <Link
            href={{
              pathname: '/about',
              query: { name: 'test' },
            }}
          >
            About us
        </Link>
            */}
            <label
              style={{
                cursor: "pointer",
              }}
            >
              Statut professionnel
            </label>
          </div>
          {userType === "assistant" && (
            <>
              <div
                onClick={() => setActive(2)}
                className={active === MENU.CP ? `${styles.active}` : null}
              >
                <label
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Compétences virtuelles
                </label>
              </div>
              <div
                onClick={() => setActive(3)}
                className={active === MENU.OFFRES ? `${styles.active}` : null}
              >
                <label
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Offres de services & tarifications
                </label>
              </div>
            </>
          )}
        </div>
        <div className={`${styles.contenu} scr`}>
          {active === MENU.INFOS && (
            <>
              <div className={styles.op}>
                <Infos
                  newUsername={newUsername}
                  setNewUsername={setNewUsername}
                  newName={newName}
                  setNewName={setNewName}
                  newPays={newPays}
                  setNewPays={setNewPays}
                  newVille={newVille}
                  setNewVille={setNewVille}
                  newProvince={newProvince}
                  setNewProvince={setNewProvince}
                  residence={residence}
                  setResidence={setResidence}
                  newLang={newLang}
                  setNewLang={setNewLang}
                  isSubmit={isSubmit}
                  infosToUpdate={infosToUpdate}
                  setInfosToUpdate={setInfosToUpdate}
                  setShowPopUp={setShowPopUp}
                />
              </div>
            </>
          )}
          {active === MENU.STATUT && (
            <>
              <div className={styles.op}>
                <Statut
                  newStatutPro={newStatutPro}
                  setNewStatutPro={setNewStatutPro}
                  newLienProfessionnelle={newLienProfessionnelle}
                  setNewLienProfessionnelle={setNewLienProfessionnelle}
                  setNewPortfolio={setNewPortfolio}
                  newPortfolio={newPortfolio}
                  isSubmit={isSubmit}
                  infosToUpdate={infosToUpdate}
                  setInfosToUpdate={setInfosToUpdate}
                />
              </div>
            </>
          )}
          {active === MENU.CP && (
            <>
              <div className={styles.op}>
                <CV
                  newCmp={newCmp}
                  setNewCmp={setNewCmp}
                  newApp={newApp}
                  setNewApp={setNewApp}
                  newExpPro={newExpPro}
                  setNewExpPro={setNewExpPro}
                  isSubmit={isSubmit}
                  infosToUpdate={infosToUpdate}
                  setInfosToUpdate={setInfosToUpdate}
                  setShowPopUp={setShowPopUp}
                />
              </div>
            </>
          )}
          {active === MENU.OFFRES && (
            <>
              <div className={styles.op}>
                <Offres
                  newOffres={newOffres}
                  setNewOffres={setNewOffres}
                  newTh={newTh}
                  setNewTh={setNewTh}
                  newBenevolat={newBenevolat}
                  setNewBenevolat={setNewBenevolat}
                  newMTF={newMTF}
                  setNewMTF={setNewMTF}
                  isSubmit={isSubmit}
                  infosToUpdate={infosToUpdate}
                  setInfosToUpdate={setInfosToUpdate}
                  setNewDevise={setNewDevise}
                  newDevise={newDevise}
                />
              </div>
            </>
          )}
        </div>
        <div className={styles.bottom}>
          <div>
            <button
              disabled={isSubmit}
              className={isSubmit ? "pen" : null}
              type="reset"
              onClick={handleReset}
            >
              <label>Annuler</label>
            </button>
            <div className={styles.switch}>
              <i
                onClick={onBack}
                className={active === MENU.INFOS ? `${styles.disbl}` : null}
              >
                <FaCircleArrowLeft size={"1.8rem"} />
              </i>
              <i
                onClick={onNext}
                className={
                  userType === "client"
                    ? active === MENU.STATUT
                      ? `${styles.disbl}`
                      : null
                    : active === MENU.OFFRES
                    ? `${styles.disbl}`
                    : null
                }
              >
                <FaCircleArrowRight size={"1.8rem"} />
              </i>
            </div>
            <button
              className={isSubmit ? `${styles.dis} ` : null}
              disabled={isSubmit}
              onClick={handleSubmit}
              type="submit"
            >
              <label>Soumettre</label>
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
