"use client";

import FilterComponent from "@/components/FilterComponent/FilterComponent";
import styles from "./infos.module.css";
import InfoHub from "@/components/InfoHub/InfoHub";
import ActionComponent from "@/components/ActionComponent/ActionComponent";
import Publication from "@/components/Publication/Publication";
import PublicationCreatorComponent from "@/components/PublicationCreatorComponent/PublicationCreatorComponent";
import PublicationForm from "@/components/PublicationForm/PublicatonForm";
import { useEffect, useState, useContext, useRef } from "react";
import InfoSection from "@/components/InfoSection/InfoSection";
import TopInfoHub from "@/components/TopInfoHub/TopInfoHub";
import {
  addFilters,
  getPublication,
} from "@/lib/controllers/projet.controller";
import { UidContext } from "@/context/UidContext";
import { CSSTransition } from "react-transition-group";
import { CgClose } from "react-icons/cg";
import style from "@/styles/projet/Projet.module.css";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

export default function Settings() {
  const [isActive, setIsActive] = useState(false);
  const { userId } = useContext(UidContext);
  const [publication, setPublication] = useState([]);
  const { setLoadingBar, widthProgressBar } = useContext(UidContext);

  const [activeBtnIndex, setActiveBtnIndex] = useState({
    filter: "news_feed",
    index: 2,
  });
  const [isActiveP, setIsActiveP] = useState(false);
  const [comp, setComp] = useState([]);
  const [checked, setChecked] = useState(true);

  const searchParams = useSearchParams();
  const articles = searchParams.get("articles");
  const { userInfos } = useSelector((state) => state.clientAvis);

  const ref = useRef();

  useEffect(() => {
    setLoadingBar(0);
  }, []);

  useEffect(() => {
    if (activeBtnIndex.index != 0) {
      async function fetchPubs() {
        setLoadingBar(30);
        setLoadingBar(40);
        setLoadingBar(50);
        const data = await getPublication(
          articles === "true" ? userInfos._id : userId,
          articles === "true" ? "my_articles" : activeBtnIndex.filter
        );
        setLoadingBar(70);
        setLoadingBar(90);
        if (data) {
          setPublication(data);
        }
        setLoadingBar(100);
        setLoadingBar(0);
      }
      fetchPubs();
    }
  }, [activeBtnIndex]);
  const crearFilter = async () => {
    const data = await addFilters(userId, { noFilter: checked, filter: comp });
    if (data.updated) {
      setComp([]);
      setIsActiveP(false);
      setActiveBtnIndex((prev) => ({
        filter: "news_feed",
        index: 2,
      }));
    }
  };
  return (
    <div
      style={{
        background: activeBtnIndex.index === 0 ? "white" : "var(--gris-v-4)",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <CSSTransition
        in={isActiveP}
        timeout={350}
        classNames={"pcf"}
        unmountOnExit
        nodeRef={ref}
      >
        <div ref={ref} className={style.popupContainer}>
          <div className={`${style.popupMsg} cft`}>
            <div className={style.popupClose}>
              <i onClick={() => setIsActiveP(false)}>
                <CgClose />
              </i>
            </div>
            <div className={style.hr} />
            <div className={style.popupMiddle}>
              <div className={style.popupContenu}>
                <p>Voulez-vous sauvegarder les modifications?</p>
              </div>
              <div className={style.popupButton}>
                <button
                  style={{
                    background: "#badf5b",
                  }}
                  onClick={crearFilter}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
      {activeBtnIndex.index === 0 ? (
        <div className={styles.container}>
          <InfoHub />
          <FilterComponent
            checked={checked}
            setChecked={setChecked}
            comp={comp}
            setComp={setComp}
          />
          <ActionComponent
            isActive={isActiveP}
            setIsActive={setIsActiveP}
            setActiveBtnIndex={setActiveBtnIndex}
            setComp={setComp}
          />
        </div>
      ) : (
        <>
          <PublicationForm
            setPublication={setPublication}
            isActive={isActive}
            setIsActive={setIsActive}
            activeBtnIndex={activeBtnIndex}
          />
          <section className={styles.main}>
            <TopInfoHub
              activeBtnIndex={activeBtnIndex}
              setActiveBtnIndex={setActiveBtnIndex}
              setPublication={setPublication}
            />
            {/* <section className={styles.content}> */}
            {articles !== "true" && (
              <PublicationCreatorComponent setIsActive={setIsActive} />
            )}
            <section className={styles.publications}>
              {/* <div className={styles.publicationContainer}> */}
              {publication?.map((value, i) => (
                <Publication index={activeBtnIndex.index} {...value} key={i} />
              ))}
              {publication.length === 0 &&
                activeBtnIndex.index === 1 &&
                widthProgressBar === 0 && (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--gris-text)",
                    }}
                  >
                    Vous n&apos;avez aucune publication pour le moment, Veuillez
                    ajouter une nouvelle publication
                  </div>
                )}
              {/* </div> */}
            </section>
            {/* </section> */}
            {articles !== "true" && (
              <InfoSection index={activeBtnIndex.index} />
            )}
          </section>
        </>
      )}
    </div>
  );
}
