/** @format */

"use client";
import { useState } from "react";
import styles from "../../styles/home/Right.module.css";
import ClientOnly from "../ClientOnly";
import { IoIosHeart } from "react-icons/io";
import { HiUserGroup } from "react-icons/hi";
import { TfiEmail } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { VscTriangleRight, VscTriangleLeft } from "react-icons/vsc";
import { TfiMore } from "react-icons/tfi";
import { useContext, useEffect } from "react";
import { UidContext } from "@/context/UidContext";
import Image from "next/image";
import { TiDeleteOutline } from "react-icons/ti";
import FavoriteAssistant from "./FavoriteAssistant/FavoriteAssistant";
import { GoMail } from "react-icons/go";
import { usePathname } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { BiX } from "react-icons/bi";
import {
  getClientFavorites,
  getAssistantFavorites,
  getConversation,
  getNotViewedConversation,
  getConversationsInProject,
} from "@/lib/controllers/projet.controller";
import { updateRightAvis } from "@/redux/slices/rightAvisSlice";
import Conversation from "./FavoriteAssistant/Conversation";
import Badge from "@mui/material/Badge";
import { UseDispatch } from "react-redux";
import { updateConversationRightAvis } from "@/redux/slices/conversationRightSlice";
import {
  updateClientAvis,
  updateClientAvisInfos,
} from "@/redux/slices/clientAvisPotentielSlice";

export default function Right({
  isCollapse,
  setIsCollapse,
  render,
  setRender,
  setInfosStatus,
  setIsInfos,
  infosStatus,
  isInfos,
}) {
  const { userType } = useSelector((state) => state.persistInfos);
  const { avis, actualAvis } = useSelector((state) => state.rightAvis);
  const { conversationAvis, actualConversationAvi, noConversation } =
    useSelector((state) => state.conversationAvis);
  const [active, setActive] = useState({ obj: "heart", value: true });
  const [assistant, setAssistant] = useState([]);
  const [searchForAssistant, setSearchForAssistant] = useState("");
  const [rigthMenu, setRightMenu] = useState("favoris");
  const [conversation, setConversation] = useState([]);
  const [renderRight, setRenderRight] = useState(0);
  const { setLoadingBar, userId } = useContext(UidContext);
  const [convNotViewed, setConvNotViewed] = useState(0);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const { io } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.user);

  const { actualProject } = useSelector((state) => state.projets);

  const path = usePathname();
  useEffect(() => {
    let index = 0;
    const project = conversation?.find((a) => {
      index++;
      return a.projectId._id === actualProject?._id;
    });
    if (isInfos && path === "/mes-projets") {
      if (conversationAvis.length > 0) {
        dispatch(
          updateConversationRightAvis({
            actualConversationAvis: conversationAvis[0],
            conversationAvisIndex: 0,
          })
        );
        dispatch(
          updateConversationRightAvis({
            noConversation: true,
          })
        );
        dispatch(
          updateClientAvisInfos({
            userInfos: conversationAvis[0].assistantId,
          })
        );
      } else {
        dispatch(
          updateConversationRightAvis({
            noConversation: false,
          })
        );
        dispatch(
          updateClientAvisInfos({
            userInfos: user,
          })
        );
      }
    } else if (path === "/mes-avis" && project && isInfos) {
      dispatch(
        updateConversationRightAvis({
          actualConversationAvis: project,
          conversationAvisIndex: index,
        })
      );
      dispatch(
        updateClientAvisInfos({
          userInfos: project.projectId?.clientId,
        })
      );
    } else if (!isInfos && path === "/mes-projets") {
      dispatch(
        updateClientAvisInfos({
          userInfos: user,
        })
      );

      dispatch(
        updateConversationRightAvis({
          noConversation: true,
        })
      );
    }
  }, [actualProject?._id, conversation]);

  useEffect(() => {
    setLoadingBar(40);
    if (path === "/mes-projets" || path === "/mes-avis") {
      const fetchFavorite = async () => {
        if (userType === "client") {
          const data = await getConversationsInProject(
            userId,
            userType,
            actualProject?._id
          );
          setConversation(
            data?.conversation?.map((a, i) => ({
              index: i,
              ...a.avisId,
              viewedByAssistant: a.viewedByAssistant,
              viewedByClient: a.viewedByClient,
              notViewedByAssistant: a.notViewedByAssistant,
              notViewedByClient: a.notViewedByClient,
              _id: a._id,
              date: a?.date,
            }))
          );
          dispatch(
            updateConversationRightAvis({
              conversationAvis: data?.conversation?.map((a, i) => ({
                index: i,
                ...a.avisId,
                viewedByAssistant: a.viewedByAssistant,
                viewedByClient: a.viewedByClient,
                notViewedByAssistant: a.notViewedByAssistant,
                notViewedByClient: a.notViewedByClient,
                date: a?.date,
              })),
              conversationAvisLength: data?.conversation?.length,
            })
          );
          // setSearchForAssistant(data?.favoris);
          setConvNotViewed(data?.notViewedConversation);
        } else {
          // const data = await getConversation(userId, userType);
          const data = await getConversationsInProject(userId, userType, "");
          dispatch(
            updateConversationRightAvis({
              conversationAvis: data?.conversation?.map((a, i) => ({
                index: i,
                ...a.avisId,
                viewedByAssistant: a.viewedByAssistant,
                viewedByClient: a.viewedByClient,
                notViewedByAssistant: a.notViewedByAssistant,
                notViewedByClient: a.notViewedByClient,
                date: a?.date,
              })),
              conversationAvisLength: data?.conversation?.length,
            })
          );
          setConversation(
            data?.conversation?.map((a, i) => {
              return {
                index: i,
                ...a.avisId,
                viewedByAssistant: a.viewedByAssistant,
                viewedByClient: a.viewedByClient,
                notViewedByAssistant: a.notViewedByAssistant,
                notViewedByClient: a.notViewedByClient,
                convId: a._id,
                date: a?.date,
              };
            })
          );
          setConvNotViewed(data?.notViewedConversation);
        }
      };
      fetchFavorite();
    } else {
      if (rigthMenu === "favoris") {
        const fetchFavorite = async () => {
          if (userType === "client") {
            const data = await getClientFavorites(userId);
            const number = await getNotViewedConversation(userId, userType);
            setConvNotViewed(number.notViewedConversation);
            //.log(count);
            setAssistant(
              data?.favoris?.map((a, i) => ({
                index: i,
                ...a.avisId,
                conversation: a.conv,
              }))
            );
            dispatch(
              updateRightAvis({
                avis: data?.favoris?.map((a, i) => ({ index: i, ...a.avisId })),
                length: data?.favoris?.length,
              })
            );
            // setSearchForAssistant(
            //   data?.favoris.map((a, i) => ({ index: i, ...a }))
            // );
          } else {
            //.log("salut");
            const data = await getAssistantFavorites(userId, userType);
            dispatch(
              updateRightAvis({
                avis: data?.favoris?.map((a, i) => ({ index: i, ...a.avisId })),
                length: data?.favoris?.length,
              })
            );
            const number = await getNotViewedConversation(userId, userType);
            setConvNotViewed(number.notViewedConversation);
            setAssistant(
              data?.favoris?.map((a, i) => ({
                index: i,
                ...a.avisId,
                conversation: a.conv,
              }))
            );
            //.log(data);
          }
        };
        fetchFavorite();
      } else {
        const fetchFavorite = async () => {
          if (userType === "client") {
            const data = await getConversation(userId, userType);
            setConversation(
              data?.conversation?.map((a, i) => ({
                index: i,
                ...a.avisId,
                viewedByAssistant: a.viewedByAssistant,
                viewedByClient: a.viewedByClient,
                _id: a._id,
                date: a?.date,
                notViewedByAssistant: a.notViewedByAssistant,
                notViewedByClient: a.notViewedByClient,
              }))
            );
            dispatch(
              updateConversationRightAvis({
                conversationAvis: data?.conversation?.map((a, i) => ({
                  index: i,
                  ...a.avisId,
                  viewedByAssistant: a.viewedByAssistant,
                  viewedByClient: a.viewedByClient,
                  date: a?.date,
                  notViewedByAssistant: a.notViewedByAssistant,
                  notViewedByClient: a.notViewedByClient,
                })),
                conversationAvisLength: data?.conversation?.length,
              })
            );
            // setSearchForAssistant(data?.favoris);
            setConvNotViewed(data?.notViewedConversation);
          } else {
            const data = await getConversation(userId, userType);
            dispatch(
              updateConversationRightAvis({
                conversationAvis: data?.conversation?.map((a, i) => ({
                  index: i,
                  ...a.avisId,
                  viewedByAssistant: a.viewedByAssistant,
                  viewedByClient: a.viewedByClient,
                  notViewedByAssistant: a.notViewedByAssistant,
                  notViewedByClient: a.notViewedByClient,
                  date: a?.date,
                })),
                conversationAvisLength: data?.conversation?.length,
              })
            );
            setConversation(
              data?.conversation?.map((a, i) => {
                return {
                  index: i,
                  ...a.avisId,
                  viewedByAssistant: a.viewedByAssistant,
                  viewedByClient: a.viewedByClient,
                  convId: a._id,
                  date: a?.date,
                  notViewedByAssistant: a.notViewedByAssistant,
                  notViewedByClient: a.notViewedByClient,
                };
              })
            );
            setConvNotViewed(data?.notViewedConversation);
          }
        };
        fetchFavorite();
      }
    }

    setLoadingBar(100);
    setLoadingBar(0);
  }, [render, renderRight, userId, rigthMenu, actualProject]);

  useEffect(() => {
    io.on("message", async (data) => {
      const number = await getNotViewedConversation(userId, userType);
      setConvNotViewed(number.notViewedConversation);
      if (rigthMenu === "conversation") {
        const data = await getConversation(userId, userType);
        setConversation(data?.conversation);
      }
    });
  }, []);

  useEffect(() => {
    setRightMenu(
      path === "/mes-projets" || path === "/mes-avis"
        ? "conversation"
        : "favoris"
    );
  }, [path]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    if (rigthMenu === "favoris") {
      if (userType === "client") {
        setAssistant(
          avis.filter(
            (a) =>
              a.assistantId?.name.toLowerCase().includes(value) ||
              a.assistantId?.username.toLowerCase().includes(value)
          )
        );
      } else {
        setAssistant(
          avis.filter(
            (a) =>
              a.projectId.clientId.name.toLowerCase().includes(value) ||
              a.projectId.clientId.username.toLowerCase().includes(value)
          )
        );
      }
    } else {
      if (userType === "client") {
        setConversation(
          conversationAvis.filter(
            (a) =>
              a.assistantId?.name.toLowerCase().includes(value) ||
              a.assistantId?.username.toLowerCase().includes(value)
          )
        );
      } else {
        setConversation(
          conversationAvis.filter(
            (a) =>
              a.projectId.clientId.name.toLowerCase().includes(value) ||
              a.projectId.clientId.username.toLowerCase().includes(value)
          )
        );
      }
    }
  };

  return (
    <ClientOnly pr>
      <div
        className={
          isCollapse.obj === "right"
            ? `${styles.container} ${styles.col}`
            : `${styles.container}`
        }
      >
        <div
          className={
            isCollapse.obj === "right" ? styles.topCollapse : styles.top
          }
        >
          {path !== "/mes-projets" && path !== "/mes-avis" && (
            <label
              className={
                active.obj === "heart" && active.value
                  ? `${styles.active}`
                  : null
              }
              // onClick={() => {
              //   setIsCollapse((prev) => ({ ...prev, obj: "right" }));
              //   setActive({ obj: "heart", value: true });
              // }}
            >
              <span
                style={{ display: "flex", justifyContent: "center" }}
                className={styles.ih}
              >
                <IoIosHeart
                  style={{
                    color: rigthMenu === "favoris" && "#ff5757",
                  }}
                  size={"1.4rem"}
                  onClick={() => setRightMenu("favoris")}
                />
              </span>
            </label>
          )}
          {/* {userType === "assistant" && path !== "/mes-projets" && (
            <label
              className={
                active.obj === "account" && active.value
                  ? `${styles.active}`
                  : null
              }
              onClick={() => setActive({ obj: "account", value: true })}
            >
              <span>
                <HiUserGroup size={"1.4rem"} />
              </span>
            </label>
          )} */}
          {path !== "/mes-projets" && path !== "/mes-avis" && (
            <label
              className={
                active.obj === "message" && active.value
                  ? `${styles.active}`
                  : null
              }
              onClick={() => setActive({ obj: "message", value: true })}
            >
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TfiEmail
                  style={{ color: rigthMenu === "conversation" && "#036eff" }}
                  size={"1.4rem"}
                  onClick={() => {
                    setRightMenu("conversation");
                    io.emit("lastConversationViewed", { user: user._id });
                    setConvNotViewed(0);
                  }}
                />
                {convNotViewed > 0 && (
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      background: "red",
                      color: "white",
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {convNotViewed}
                  </div>
                )}
                {/* </Badge> */}
              </span>
            </label>
          )}
          {(path === "/mes-projets" || path === "/mes-avis") && (
            <label
              className={
                active.obj === "account" && active.value
                  ? `${styles.active}`
                  : null
              }
            >
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
                className="historique"
              >
                <GoMail size={"1.4rem"} />{" "}
                {convNotViewed > 0 && (
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      background: "red",
                      color: "white",
                      position: "absolute",
                      top: "-4px",
                      left: "-4px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {convNotViewed}
                  </div>
                )}
                {isCollapse.obj === "right" ? "Historique" : "Historique"}
              </span>
            </label>
          )}
          <i
            onClick={() =>
              setIsCollapse((prev) => ({
                ...prev,
                obj: prev.obj === "right" ? "" : "right",
              }))
            }
          >
            {isCollapse.obj === "right" ? (
              <BiX size={"2rem"} className={"try1"} />
            ) : (
              <TfiMore size={"2rem"} className={"try1"} />
            )}
          </i>
        </div>
        <div
          className={`${
            isCollapse.obj === "right" ? styles.contenuCollapse : styles.contenu
          } scr`}
        >
          <div className={styles.favoris}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {path !== "/mes-projets" && path !== "/mes-avis" ? (
                <>
                  <i
                    onClick={() => {
                      setRightMenu("favoris");
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <VscTriangleLeft size={"1.25rem"} />
                  </i>
                  {userType === "client" ? (
                    <span className="usn">
                      {rigthMenu === "favoris"
                        ? "Assistant(e)s Favori(te)s"
                        : "BOITE DE RECEPTION "}
                    </span>
                  ) : (
                    <span className="usn">
                      {rigthMenu === "favoris"
                        ? "Clients favoris"
                        : "BOITE DE RECEPTION"}
                    </span>
                  )}
                  <i
                    onClick={() => {
                      setRightMenu("conversation");
                      io.emit("lastConversationViewed", { user: user._id });
                      setConvNotViewed(0);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <VscTriangleRight size={"1.25rem"} />
                  </i>
                </>
              ) : (
                <div>&nbsp;</div>
              )}
            </div>
            <div className={styles.nt}>
              {rigthMenu === "favoris" && path !== "/mes-projets" ? (
                assistant?.length > 0 ? (
                  assistant.map((a, i) => {
                    return (
                      <FavoriteAssistant
                        setIsCollapse={setIsCollapse}
                        setRenderRight={setRenderRight}
                        assistant={assistant}
                        setIsInfos={setIsInfos}
                        setInfosStatus={setInfosStatus}
                        infosStatus={infosStatus}
                        {...a}
                        viewedByAssistant={a.viewedByAssistant}
                        viewedByClient={a.viewedByClient}
                        setRender={setRender}
                        i={a.index}
                        key={i}
                      />
                    );
                  })
                ) : (
                  <label>
                    <span>Aucun(e) favori(te) sélectionné(e)</span>
                  </label>
                )
              ) : (
                conversation?.map((e, i) => {
                  return (
                    <Conversation
                      key={i}
                      setIsInfos={setIsInfos}
                      setInfosStatus={setInfosStatus}
                      i={i}
                      avisId={e}
                      viewedByAssistant={e.viewedByAssistant}
                      viewedByClient={e.viewedByClient}
                      infosStatus={infosStatus}
                      notViewedByAssistant={e.notViewedByAssistant}
                      notViewedByClient={e.notViewedByClient}
                      _id={e._id}
                      convId={e.convId}
                      date={e.date}
                      setIsCollapse={setIsCollapse}
                    />
                  );
                })
              )}
            </div>
            <div className={`${styles.searchContainer}`}>
              <div className={styles.icon}>
                <IoSearch color="#b9b9b9" />
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="Recherche"
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className={styles.content}>
            {/* <div className={styles.nt}>
              {rigthMenu === "favoris" && path !== "/mes-projets" ? (
                assistant?.length > 0 ? (
                  assistant.map((a, i) => {
                    return (
                      <FavoriteAssistant
                        setIsCollapse={setIsCollapse}
                        setRenderRight={setRenderRight}
                        assistant={assistant}
                        setIsInfos={setIsInfos}
                        setInfosStatus={setInfosStatus}
                        infosStatus={infosStatus}
                        {...a}
                        viewedByAssistant={a.viewedByAssistant}
                        viewedByClient={a.viewedByClient}
                        setRender={setRender}
                        i={a.index}
                        key={i}
                      />
                    );
                  })
                ) : (
                  <label>
                    <span>Aucun(e) favori(te) sélectionné(e)</span>
                  </label>
                )
              ) : (
                conversation?.map((e, i) => {
                  return (
                    <Conversation
                      key={i}
                      setIsInfos={setIsInfos}
                      setInfosStatus={setInfosStatus}
                      i={i}
                      avisId={e}
                      viewedByAssistant={e.viewedByAssistant}
                      viewedByClient={e.viewedByClient}
                      infosStatus={infosStatus}
                      notViewedByAssistant={e.notViewedByAssistant}
                      notViewedByClient={e.notViewedByClient}
                      _id={e._id}
                      convId={e.convId}
                      date={e.date}
                      setIsCollapse={setIsCollapse}
                    />
                  );
                })
              )}
            </div> */}
            {/* <div className={`${styles.searchContainer}`}>
              <div className={styles.icon}>
                <IoSearch color="#b9b9b9" />
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="Recherche"
                onChange={handleSearch}
              />
            </div> */}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
