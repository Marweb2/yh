import React, { useState } from "react";
import styles from "@/styles/topInfoHub/topInfoHub.module.css";
import Button from "./Button";
import SearchBar from "./SearchBar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaFilter } from "react-icons/fa6";
import { MdArticle, MdFeed } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import { HiPencilAlt } from "react-icons/hi";
import { RiFileCheckLine, RiFileEditLine } from "react-icons/ri";

const list = [
  {
    title: "FILTRES",
    icon: <FaFilter size={"0.9rem"} />,
  },
  {
    title: "MES ARTICLES",
    icon: <RiFileCheckLine size={"0.9rem"} />,
  },
  {
    title: "FIL D'ACTUALITES",
    icon: <RiFileEditLine size={"0.9rem"} />,
  },
];
export default function TopInfoHub({
  activeBtnIndex,
  setActiveBtnIndex,
  setPublication,
}) {
  const searchParams = useSearchParams();
  const articles = searchParams.get("articles");
  return (
    <section className={styles.container}>
      {/* <div className={styles.btnContainer}> */}
      {articles !== "true" ? (
        list.map((val, i) => (
          <Button
            key={i}
            activeBtnIndex={activeBtnIndex}
            setActiveBtnIndex={setActiveBtnIndex}
            index={i}
            name={val.title}
            icon={val.icon}
            setPublication={setPublication}
          />
        ))
      ) : (
        // <div className={styles.btnContainer}>
        <>
          <Link href="/accueil" className={styles.btn}>
            <TiArrowBack size={"0.9rem"} />
            INFO PROJET
          </Link>
          <button
            style={{
              width: "28rem",
              background: "white",
              color: "var(--blue)",
              border: "1px solid var(--blue)",
            }}
            className={styles.btn}
          >
            <HiPencilAlt />
            SES ARTICLES
          </button>
        </>
        // </div>
      )}
      {/* </div> */}
      <SearchBar setPublication={setPublication} />
      {/* </div> */}
    </section>
  );
}
