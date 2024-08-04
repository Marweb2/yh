/** @format */

"use client";
import ClientOnly from "@/components/ClientOnly";
import { CSSTransition } from "react-transition-group";
import { CgClose } from "react-icons/cg";
import style from "@/styles/projet/Projet.module.css";
import {
  getPhotosController,
  updateUserInfosController,
} from "@/lib/controllers/user.controller";
import { isEmpty } from "@/lib/utils/isEmpty";
import { clientPays, nbCmp, pays } from "@/lib/menuDeroulant";
import { updateUserInfos } from "@/redux/slices/userSlice";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/home/profil/EditProfil.module.css";
import ProfilMiddle from "./ProfilMiddle";
import ProfilRight from "./ProfilRight";
import { UidContext } from "@/context/UidContext";
export default function EditProfil({ setIsCollapse, setIsEditProfil }) {
  const { user } = useSelector((state) => state.user);
  const { userType } = useSelector((state) => state.persistInfos);
  const { setLoadingBar, userId } = useContext(UidContext);
  const dispatch = useDispatch();
  const [infosToUpdate, setInfosToUpdate] = useState({});
  const [isFinish, setIsFinish] = useState(false);
  const [isPhoto, setIsPhoto] = useState(false);
  const [appValue, setAppValue] = useState("");
  const [newUsername, setNewUsername] = useState({
    obj: user.username,
    value: false,
  });
  const [newName, setNewName] = useState({ obj: user.name, value: false });
  const [newPays, setNewPays] = useState({ obj: user.pays, value: false });
  const [newVille, setNewVille] = useState({ obj: user.ville, value: false });
  const [newProvince, setNewProvince] = useState({
    obj: user.province,
    value: false,
  });
  const [residence, setResidence] = useState({
    pays: user.pays,
    ville:
      userType === "client"
        ? clientPays?.find((p) => p.pays === user?.pays)?.ville
        : pays?.find((p) => p.pays === user?.pays)?.ville || [],
    province: user?.province,
  });
  const [newLang, setNewLang] = useState({
    obj: user.lang,
    sgl: user.lang === "en" ? "Anglais" : "Français",
    value: false,
  });
  const [newStatutPro, setNewStatutPro] = useState({
    obj: user.statutProfessionnelle,
    value: false,
  });
  const [newLienProfessionnelle, setNewLienProfessionnelle] = useState({
    obj: user.lienProfessionnelle,
    value: false,
  });
  const [newPortfolio, setNewPortfolio] = useState({
    obj: user.portfolio,
    value: false,
  });
  const [newCmp, setNewCmp] = useState(() => {
    const cmpFromDB = user.competenceVirtuelle?.map((u) => ({
      obj: u,
      value: false,
    }));
    const initialCmp = [
      ...cmpFromDB,
      ...Array.from(
        { length: nbCmp - user.competenceVirtuelle?.length },
        () => ({
          obj: "",
          value: false,
        })
      ),
    ];
    return initialCmp;
  });
  const [newExpPro, setNewExpPro] = useState({
    obj: user.experiencePro,
    value: false,
  });
  const [newApp, setNewApp] = useState({
    obj: user.applicationWeb,
    value: false,
  });
  const [newOffres, setNewOffres] = useState({
    obj: user.offresDeService,
    value: false,
  });
  const [newTh, setNewTh] = useState({ obj: user?.tarif, value: false });
  const [newDevise, setNewDevise] = useState({
    obj: user.devise ? user.devise : "Euro",
    value: false,
  });
  const [newBenevolat, setNewBenevolat] = useState({
    obj: user?.benevolat,
    value: false,
  });
  const [newMTF, setNewMTF] = useState({
    obj: user?.montantForfaitaire,
    value: false,
  });
  const [newBio, setNewBio] = useState({ obj: user.bio, value: false });
  const [newImage, setNewImage] = useState({ obj: user.image, value: false });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [initialPhotos, setInitialPhotos] = useState(user.image);
  const [showPopup, setShowPopUp] = useState({
    status: false,
    label: "",
    number: 0,
  });
  const [paysValue, setPaysValue] = useState("");
  const [compValue, setCompValue] = useState("");
  useEffect(() => {
    (async () => {
      setIsLoadingPhotos(true);
      const res = await getPhotosController(userId);
      setIsLoadingPhotos(false);
      if (res?.image) {
        setInitialPhotos(res.image);
        setNewImage((prev) => ({ ...prev, obj: res.image }));
      }
    })();
  }, []);

  useEffect(() => {
    if (isFinish) {
      setTimeout(() => {
        setLoadingBar(0);
      }, 500);
    }
  }, [isFinish, setLoadingBar]);

  const handleReset = async () => {
    setNewUsername({ obj: user.username, value: false });
    setNewName({ obj: user.name, value: false });
    setNewPays({ obj: user.pays, value: false });
    setNewVille({ obj: user.ville, value: false });
    setNewProvince({ obj: user.province, value: false });
    setNewLang({ obj: user.lang, value: false });
    setNewStatutPro({ obj: user.statutProfessionnelle, value: false });
    setNewLienProfessionnelle({
      obj: user.statutProfessionnelle,
      value: false,
    });
    setNewPortfolio({ obj: user.statutProfessionnelle, value: false });
    setNewCmp(() => {
      return user.competenceVirtuelle.map((u) => ({
        obj: u,
        value: false,
      }));
    });
    setNewExpPro({ obj: user.experiencePro, value: false });
    setNewApp({ obj: user.applicationWeb, value: false });
    setNewOffres({ obj: user.offresDeService, value: false });
    setNewTh({ obj: user.tarif, value: false });
    setNewDevise({ obj: user.devise ? user.devise : "Euro", value: false });
    setNewBenevolat({ obj: user.benevolat, value: false });
    setNewMTF({ obj: user.montantForfaitaire, value: false });
    setNewBio({ obj: user.bio, value: false });
    setNewImage({
      obj: user.image,
      value: false,
    });
    setIsEditProfil(false);
    setIsCollapse({ obj: "", value: true });
  };

  const handleSubmit = async (e) => {
    console.log("okok");
    e.preventDefault();
    setIsSubmit(true);
    if (!isEmpty(infosToUpdate)) {
      console.log(infosToUpdate);
      setLoadingBar(60);
      const res = await updateUserInfosController({
        ...infosToUpdate,
        id: userId,
      }).catch((error) => console.log(error));
      // await fetch(`/api/avis/${userId}`, {
      //   method: "PUT",
      // });
      console.log(res, "salut");
      setIsEditProfil(false);
      setIsCollapse({ obj: "profil", value: true });

      if (!isEmpty(res?.user)) {
        setLoadingBar(100);
        dispatch(updateUserInfos({ user: res.user }));
        setIsFinish(true);
      }
    } else {
      handleReset();
    }
  };

  return (
    <ClientOnly>
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={styles.container}
      >
        <div className={styles.editProfilMiddle}>
          <ProfilMiddle
            handleSubmit={handleSubmit}
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
            newStatutPro={newStatutPro}
            setNewStatutPro={setNewStatutPro}
            newLienProfessionnelle={newLienProfessionnelle}
            setNewLienProfessionnelle={setNewLienProfessionnelle}
            newPortfolio={newPortfolio}
            setNewPortfolio={setNewPortfolio}
            newCmp={newCmp}
            setNewCmp={setNewCmp}
            newApp={newApp}
            setNewApp={setNewApp}
            newExpPro={newExpPro}
            setNewExpPro={setNewExpPro}
            newOffres={newOffres}
            setNewOffres={setNewOffres}
            newTh={newTh}
            setNewTh={setNewTh}
            newBenevolat={newBenevolat}
            setNewBenevolat={setNewBenevolat}
            newMTF={newMTF}
            setNewMTF={setNewMTF}
            handleReset={handleReset}
            isSubmit={isSubmit}
            infosToUpdate={infosToUpdate}
            setInfosToUpdate={setInfosToUpdate}
            setNewDevise={setNewDevise}
            newDevise={newDevise}
            setShowPopUp={setShowPopUp}
          />
        </div>
        <div
          className={
            isPhoto
              ? `${styles.editProfilRight} ${styles.isph}`
              : `${styles.editProfilRight}`
          }
        >
          <div className={styles.ri}>
            <ProfilRight
              newImage={newImage}
              setNewImage={setNewImage}
              newBio={newBio}
              setNewBio={setNewBio}
              isSubmit={isSubmit}
              isLoadingPhotos={isLoadingPhotos}
              initialPhotos={initialPhotos}
              infosToUpdate={infosToUpdate}
              setInfosToUpdate={setInfosToUpdate}
              isPhoto={isPhoto}
              setIsPhoto={setIsPhoto}
            />
          </div>
        </div>
      </form>
      <CSSTransition
        in={showPopup.status}
        timeout={350}
        classNames={"pcf"}
        unmountOnExit
        // nodeRef={ref}
      >
        <div className={style.popupContainer}>
          <div className={`${style.popupMsg} cft`}>
            <div className={style.popupClose}>
              <i
                onClick={() => {
                  setShowPopUp({ status: false });
                }}
              >
                <CgClose />
              </i>
            </div>
            <div className={style.hr} />

            {showPopup.label === "pays" ? (
              <div className={style.popupMiddle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                  className={style.popupContenu}
                >
                  <p>Entrez votre pays</p>
                  <input
                    value={paysValue}
                    placeholder="pays"
                    className="paysInput"
                    type="text"
                    onChange={(e) => {
                      setPaysValue(e.target.value);
                    }}
                  />
                </div>
                <div className={style.popupButton}>
                  <button
                    style={{
                      background: "#badf5b",
                    }}
                    onClick={(e) => {
                      setNewPays((prev) => ({
                        ...prev,
                        obj: prev.obj === paysValue ? "" : paysValue,
                      }));
                      setShowPopUp({ status: false, number: 0, label: "" });
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : showPopup.label === "comp" ? (
              <div className={style.popupMiddle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                  className={style.popupContenu}
                >
                  <p>Entrez votre Compétence</p>
                  <input
                    value={compValue}
                    placeholder="compétence"
                    className="paysInput"
                    type="text"
                    onChange={(e) => {
                      setCompValue(e.target.value);
                    }}
                  />
                </div>
                <div className={style.popupButton}>
                  <button
                    style={{
                      background: "#badf5b",
                    }}
                    onClick={(e) => {
                      setNewCmp((prev) => {
                        let newCmp = [...prev];
                        newCmp[showPopup.number] = {
                          obj:
                            newCmp[showPopup.number].obj === compValue
                              ? ""
                              : compValue,
                          value: true,
                        };
                        return newCmp;
                      });
                      setCompValue("");
                      setShowPopUp({ status: false, number: 0, label: "" });
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              <div className={style.popupMiddle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                  className={style.popupContenu}
                >
                  <p>Entrez une application</p>
                  <input
                    value={appValue}
                    placeholder="Application"
                    className="paysInput"
                    type="text"
                    onChange={(e) => {
                      setAppValue(e.target.value);
                    }}
                  />
                </div>
                <div className={style.popupButton}>
                  <button
                    style={{
                      background: "#badf5b",
                    }}
                    onClick={(e) => {
                      setNewApp({ obj: appValue, value: true });
                      setAppValue("");
                      setShowPopUp({ status: false, label: "" });
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CSSTransition>
    </ClientOnly>
  );
}
