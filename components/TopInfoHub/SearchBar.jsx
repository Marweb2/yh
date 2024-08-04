import React, { useState, useContext } from "react";
import styles from "@/styles/topInfoHub/topInfoHub.module.css";
import { IoSearch } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { getPublication, searchPub } from "@/lib/controllers/projet.controller";
import { UidContext } from "@/context/UidContext";

export default function SearchBar({ setPublication }) {
  const searchParams = useSearchParams();
  const { userInfos } = useSelector((state) => state.clientAvis);
  const { userId } = useContext(UidContext);
  const { setLoadingBar } = useContext(UidContext);

  const articles = searchParams.get("articles");
  const [searchValue, setSearchValue] = useState("");
  const handleSubmit = async (e) => {
    if (!searchValue) return;
    e.preventDefault();
    if (!articles) {
      const data = await searchPub(userId, searchValue);
      setPublication(data.publications);
    } else {
      const data = await searchPub(userId, searchValue, userInfos._id);
      setPublication(data.publications);
    }
  };

  return (
    <section
      style={{
        Minwidth: articles === "true" && "180px",
        Maxwidth: articles === "true" && "180px",
      }}
      className={styles.SearchBarContainer}
    >
      <i
        style={{
          background: "none",
        }}
      >
        <IoSearch />
      </i>
      <input
        // value={searchValue}

        onChange={async (e) => {
          if (!e.target.value) {
            const data = await getPublication(
              articles === "true" ? userInfos._id : userId,
              "news_feed"
            );
            setPublication(data);
            return;
          }
          // e.preventDefault();
          setLoadingBar(40);
          setLoadingBar(50);
          setLoadingBar(80);
          if (!articles) {
            const data = await searchPub(userId, e.target.value);
            setPublication(data.publications);
            setLoadingBar(100);
          } else {
            const data = await searchPub(userId, e.target.value, userInfos._id);
            setPublication(data.publications);
            setLoadingBar(100);
          }
          setLoadingBar(0);
        }}
        type="text"
        placeholder={
          !articles ? "Rechercher dans le fil" : "Rechercher dans ses articles"
        }
      />
    </section>
  );
}
