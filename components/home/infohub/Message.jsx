/** @format */

"use client";

//redux
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";
import Tooltip from "@mui/material/Tooltip";

// styles
import styles from "../../../styles/home/infohub/Message.module.css";
import style from "@/styles/projet/Projet.module.css";

import ClientOnly from "@/components/ClientOnly";
import { useContext, useEffect, useRef, useState } from "react";

// icons
import { FiSend } from "react-icons/fi";
import { TiAttachment } from "react-icons/ti";
import { MdNotInterested } from "react-icons/md";
import { AiFillPlusCircle } from "react-icons/ai";
import { HiOutlineFaceSmile } from "react-icons/hi2";
import { IoIosHeart, IoMdImages } from "react-icons/io";
import { BsCheck2All } from "react-icons/bs";
import {
  BiDotsVerticalRounded,
  BiSolidLeftArrow,
  BiSolidRightArrow,
} from "react-icons/bi";

import { IoIosArrowRoundBack } from "react-icons/io";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { updateConversationRightAvis } from "@/redux/slices/conversationRightSlice";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  updateProjets,
  fetchClientProjets,
} from "@/redux/slices/clientProjectSlice";
import {
  updateIsActive,
  updatePopUpStatut,
  updateDeleteFavouriteAssistant,
  updateDeleteAvisAssistant,
} from "@/redux/slices/popUpSlice";

import { UidContext } from "@/context/UidContext";
import { isEmpty } from "@/lib/utils/isEmpty";
import LeftMessage from "@/components/Message-Item/LeftMessage";
import RightMessage from "@/components/Message-Item/RightMessage";
import { updateMessages, updateMessage } from "@/redux/slices/messageSlice";
import {
  getMessages,
  searchUserBlocked,
} from "@/lib/controllers/projet.controller";
import InputEmoji from "react-input-emoji";
import dynamic from "next/dynamic";
import TypingAnimation from "@/components/Animation/Typing";

const Recorder = dynamic(() => import("@/components/Audio/Audio"), {
  ssr: false,
});

import {
  updateAvisStatut,
  addClientFavorite,
  searchClientFavorite,
  deleteClientFavorite,
  deleteAvis,
  updateAssistantChoice,
  addAssistantFavorite,
  searchAssistantFavorite,
  deleteAssistantFavorite,
} from "@/lib/controllers/projet.controller";
import { updateRightAvis } from "@/redux/slices/rightAvisSlice";
import { usePathname } from "next/navigation";
import { determineTooltip } from "@/lib/function";

export default function Message({
  assistantIndex,
  setAssistantIndex,
  assistants,
  setRender,
  render,
  infosStatus,
}) {
  const { actualProject } = useSelector((state) => state.projets);
  const { messages } = useSelector((state) => state.messages);
  const { io } = useSelector((state) => state.socket);
  const { userType } = useSelector((state) => state.persistInfos);
  const {
    avis,
    pageActuelle,
    indexAvisSelectionee,
    userInfos,
    taillePage,
    lastIndex,
  } = useSelector((state) => state.clientAvis);

  const {
    conversationAvis,
    actualConversationAvis,
    conversationAvisLength,
    conversationAvisIndex,
  } = useSelector((state) => state.conversationAvis);

  const {
    actualAvis,
    avis: rightAvis,
    index,
    length,
  } = useSelector((state) => state.rightAvis);

  const [popUp, setPopUp] = useState(false);
  const dispatch = useDispatch();
  const { setLoadingBar, userId } = useContext(UidContext);
  const [status, setStatus] = useState({
    isOnline: true,
    message: "",
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const textarea = useRef();
  const msgEnd = useRef();

  const {
    clientProjets,
    lastClientIndex,
    pageLength,
    currentPage,
    actualClientIndex,
    actualClientProjet,
  } = useSelector((state) => state.clientProject);
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState(false);
  const [isVisible, setIsVisible] = useState({ obj: false, index: null });
  const [isFlexEnd, setIsFlexEnd] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [blocageType, setBlocageType] = useState("");
  const [lastMessageSentBy, setLastMessageSentBy] = useState();
  const [isLastMessageViewed, setIsLastMessageViewed] = useState();
  const [comp, setComp] = useState({});
  const pathname = usePathname();
  const { setIsActive, isActive } = useContext(UidContext);
  const [tooltip, setTooltip] = useState();
  const [blocStatus, setBlocStatus] = useState("normal");
  const { noConversation } = useSelector((state) => state.conversationAvis);

  useEffect(() => {
    setTooltip(determineTooltip(isActive.obj));
  }, [isActive.obj]);

  useEffect(() => {
    if (userType === "client") {
      if (infosStatus === "middle" || infosStatus === "messageIcon") {
        setComp(avis?.find((e) => e.assistantId?._id === userInfos._id));
      } else if (infosStatus === "rightFavourite" || infosStatus === "fav") {
        setComp(actualAvis);
      } else {
        setComp(actualConversationAvis);
      }
    } else {
      if (infosStatus === "middle" || infosStatus === "messageIcon") {
        setComp(
          clientProjets?.find(
            (e) =>
              e.assistantId === userId &&
              e.projectId?._id === actualClientProjet._id
          )
        );
      } else if (infosStatus === "rightFavourite" || infosStatus === "fav") {
        setComp(actualAvis);
      } else {
        setComp(actualConversationAvis);
      }
    }
  }, [avis, actualAvis, actualConversationAvis, clientProjets]);

  let client, projectAssistant, projectClient;
  if (userType === "assistant") {
    client =
      infosStatus === "middle" || infosStatus === "messageIcon"
        ? actualClientProjet.clientId?._id
        : infosStatus === "rightFavourite" || infosStatus === "fav"
        ? actualAvis.projectId.clientId._id
        : actualConversationAvis.projectId.clientId._id;

    projectAssistant =
      infosStatus === "middle" || infosStatus === "messageIcon"
        ? actualClientProjet?._id
        : infosStatus === "rightFavourite" || infosStatus === "fav"
        ? actualAvis.projectId._id
        : actualConversationAvis.projectId._id;
  } else {
    projectClient =
      infosStatus === "middle" || infosStatus === "messageIcon"
        ? actualProject._id
        : infosStatus === "rightFavourite" || infosStatus === "fav"
        ? actualAvis.projectId._id
        : actualConversationAvis.projectId._id;
  }

  const handleChangeFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // let res = URL.createObjectURL(e.target.files[0]);
      const reader = new FileReader();
      // Événement déclenché lorsque la lecture du fichier est terminée

      reader.onload = function (event) {
        const base64String = event.target.result;
        dispatch(
          updatePopUpStatut({
            popUpStatut: "image",
            data: base64String,
            avisId: comp._id,
          })
        );
        dispatch(
          updateIsActive({
            isActive: true,
          })
        );
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleChangeFile2 = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // let res = URL.createObjectURL(e.target.files[0]);
      const file = e.target.files[0];
      const reader = new FileReader();
      // Événement déclenché lorsque la lecture du fichier est terminée

      reader.onload = function (event) {
        const base64String = event.target.result;
        dispatch(
          updatePopUpStatut({
            popUpStatut: "doc",
            data: base64String,
            avisId: comp._id,
            name: file.name,
          })
        );
        dispatch(
          updateIsActive({
            isActive: true,
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!userInfos) return;
    setLoadingBar(40);

    setLoadingBar(80);
    async function searchIfFavorite() {
      let data;

      if (userType === "client") {
        data = await searchClientFavorite(comp?._id, user._id);
        //(data);
        //.log(data);
      } else {
        data = await searchAssistantFavorite(comp?._id, user._id);
        //.log(data);
      }
      if (data.found) {
        setIsFavourite(true);
      } else {
        setIsFavourite(false);
      }
    }
    async function searchIfBlocked() {
      let data, data2;

      if (userType === "client") {
        // data = await searchClientFavorite(comp?._id, user._id);
        data = await searchUserBlocked(userInfos._id, user._id);
        //(data, "blocked", userInfos._id, user._id);
        if (data.found) {
          //(data);
          setIsBlocked(true);
          setBlocageType(data.block.type);
        }
      } else {
        data = await searchAssistantFavorite(comp?._id, user._id);
        data = await searchUserBlocked(
          user._id,
          infosStatus === "middle" || infosStatus === "messageIcon"
            ? actualClientProjet.clientId._id
            : infosStatus === "rightFavourite" || infosStatus === "fav"
            ? actualAvis.projectId.clientId._id
            : actualConversationAvis.projectId.clientId._id
        );
        //.log(data);
      }
      if (data.found) {
        //(data);
        setIsBlocked(true);
        setBlocageType(data.block.type);
      } else {
        setIsBlocked(false);
      }
    }
    searchIfFavorite();
    searchIfBlocked();
    setLoadingBar(100);
    setLoadingBar(0);
  }, [userInfos, avis, render]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const ms = document.getElementById("ms" + isVisible.index);

      if (!isEmpty(ms) && ms?.id !== e.target?.id) {
        setIsVisible(() => ({
          obj: false,
          index: null,
        }));
      }
    };
    if (userType === "client") {
      io.emit("conversationViewed", {
        client: user._id,
        assistant: userInfos._id,
        projectId: projectClient,
        userType,
      });
    } else {
      io.emit("conversationViewed", {
        assistant: user._id,
        client: userInfos._id,
        projectId: projectAssistant,
        userType,
      });
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [
    actualClientProjet,
    actualProject,
    comp?._id,
    messages,
    userInfos,
    projectClient,
    projectAssistant,
  ]);

  useEffect(() => {
    io.on("message", (data) => {
      //"tonga", data.avisId, comp._id);
      //(data.sender, "tonga");
      if (data.avisId === comp._id) {
        dispatch(updateMessage({ message: data.message }));
        //userType);
        if (userType === "client") {
          io.emit("conversationViewed", {
            client: user._id,
            assistant: userInfos._id,
            projectId: projectClient,
            userType,
          });
        } else {
          io.emit("conversationViewed", {
            assistant: user._id,
            client: userInfos._id,
            projectId: projectAssistant,
            userType,
          });
        }
        setLastMessageSentBy(data.sender);
        if (userType === "client") {
          io.emit("conversationViewed", {
            client: user._id,
            assistant: userInfos._id,
            projectId: projectClient,
            userType,
          });
        } else {
          io.emit("conversationViewed", {
            assistant: user._id,
            client: userInfos._id,
            projectId: projectAssistant,
            userType,
          });
        }
      }
    });
    io.on("viewed", (data) => {
      //(data);
      if (
        userType === "client" &&
        user._id === data.client &&
        data.assistant === userInfos._id &&
        data.projectId === projectClient
      ) {
        setIsLastMessageViewed(true);
      } else if (
        userType === "assistant" &&
        user._id === data.assistant &&
        data.client === userInfos._id &&
        data.projectId === projectAssistant
      ) {
        setIsLastMessageViewed(true);
      }
    });
    io.on("writting", (data) => {
      if (userType === "client") {
        setIsTyping(
          projectClient === data.projectId && data.avisId === comp._id
        );
      } else {
        setIsTyping(projectAssistant === data.projectId);
      }
    });
    io.on("notWritting", (data) => {
      if (userType === "client") {
        setIsTyping(
          !(data.projectId === projectClient && data.avisId === comp._id)
        );
      } else {
        setIsTyping(!(data.projectId === projectAssistant));
      }
    });
    io.on("userBlocked", (data) => {
      //.log(data);
      if (userType === "client") {
        //("tonga");
        if (
          (data.by === user._id && data.user === userInfos._id) ||
          (data.by === userInfos._id && data.user === user._id)
        ) {
          //("tonga2");
          setIsBlocked(true);
          setBlocageType(data.type);
        }
      } else {
        if (
          (data.by === user._id && data.user === userInfos._id) ||
          (data.by === userInfos._id && data.user === user._id)
        ) {
          setIsBlocked(true);
          setBlocageType(data.type);
        }
      }
      setRender((a) => a + 1);
      setIsFavourite(false);
      setBlocStatus("normal");
    });
    io.on("blockDeleted", (data) => {
      if (userType === "client") {
        if (
          (data.by === user._id && data.user === userInfos._id) ||
          (data.by === userInfos._id && data.user === user._id)
        ) {
          setIsBlocked(false);
        }
      } else {
        if (
          (data.by === user._id && data.user === userInfos._id) ||
          (data.by === userInfos._id && data.user === user._id)
        ) {
          setIsBlocked(false);
        }
      }
      setBlocageType("");
      setBlocStatus("normal");
    });
    io.on("deleted", (data) => {
      //(data, messages);
      dispatch(
        updateMessages({
          messages: messages.filter((a) => a._id !== data.messageId),
        })
      );
    });

    return () => {
      io.off("message");
      io.off("writting");

      io.off("notWritting");
      io.off("userBlocked");
      io.off("blockDeleted");
      io.off("deleted");
    };
  }, [
    actualClientProjet,
    actualProject,
    comp?._id,
    messages,
    userInfos,
    projectClient,
    projectAssistant,
  ]);

  useEffect(() => {
    async function getConversation() {
      if (userType === "client") {
        const conversation = await getMessages(
          userInfos._id,
          userId,
          // actualProject._id,
          projectClient,
          userType
        );
        //(conversation, projectClient);

        setLastMessageSentBy(conversation.conversation?.lastMesssageSentBy);
        setIsLastMessageViewed(conversation.conversation?.viewedByAssistant);
        if (conversation) {
          dispatch(updateMessages({ messages: conversation.messages }));
          setStatus({
            isOnline: conversation.isOnline,
            message: conversation.statut,
          });
        }
      } else {
        const conversation = await getMessages(
          userId,
          infosStatus === "middle" || infosStatus === "messageIcon"
            ? actualClientProjet?.clientId?._id
            : infosStatus === "rightFavourite" || infosStatus === "fav"
            ? actualAvis.projectId.clientId._id
            : actualConversationAvis.projectId.clientId._id,
          infosStatus === "middle" || infosStatus === "messageIcon"
            ? actualClientProjet._id
            : infosStatus === "rightFavourite" || infosStatus === "fav"
            ? actualAvis.projectId._id
            : actualConversationAvis.projectId._id,
          userType
        );
        //.log(conversation);
        //(conversation);

        if (conversation) {
          dispatch(updateMessages({ messages: conversation.messages }));
          setStatus({
            isOnline: conversation.isOnline,
            message: conversation.statut,
          });
          setLastMessageSentBy(conversation.conversation?.lastMesssageSentBy);
          setIsLastMessageViewed(conversation.conversation?.viewedByClient);
        }
      }
    }
    getConversation();
  }, [userInfos, currentPage, actualClientIndex]);

  const handleFocus = () => {
    if (userType === "client") {
      io.emit("typing", {
        to: userInfos._id,
        projectId: actualProject._id,
        avisId: comp._id,
      });
    } else {
      io.emit("typing", {
        to: userInfos._id,
        projectId: projectAssistant,
        avisId: comp._id,
      });
    }
  };
  const handleBlur = () => {
    if (userType === "client") {
      io.emit("notTyping", {
        to: userInfos._id,
        projectId: projectClient,
        avisId: comp._id,
      });
    } else {
      io.emit("notTyping", {
        to: userInfos._id,
        projectId: projectAssistant,
        avisId: comp._id,
      });
    }
  };

  useEffect(() => {
    if (isSubmit) {
      if (userType === "client") {
        //.log(userType);
        io.emit("sendMessage", {
          client: userId,
          assistant: userInfos._id,
          content: message?.trim(),
          sender: "client",
          projectId: projectClient,
          avisId: comp._id,
          contentType: "text",
        });
        setIsSubmit(false);
      } else {
        io.emit("sendMessage", {
          assistant: userId,
          // client: actualClientProjet?.clientId._id,
          client: client,
          content: message?.trim(),
          sender: "assistant",
          projectId: projectAssistant,
          avisId: comp._id,
          contentType: "text",
        });
        setIsSubmit(false);
        setLastMessageSentBy(userType);
        setIsLastMessageViewed(false);
        setMessage("");
      }

      setIsLastMessageViewed(false);
      setLastMessageSentBy(userType);
      textarea.current.focus();
      textarea.current.value = "";
    }
  }, [isSubmit]);

  useEffect(() => {
    if (msgEnd?.current) {
      msgEnd.current.scrollIntoView();
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message?.trim()?.length > 0) {
      setIsSubmit(true);
    }
  };

  const handleEnter = (e) => {
    setMessage(e);
    if (message?.trim()?.length > 0) {
      if (userType === "client") {
        io.emit("sendMessage", {
          client: userId,
          assistant: userInfos._id,
          content: e?.trim(),
          sender: "client",
          projectId: projectClient,
          avisId: comp._id,
          contentType: "text",
        });
        setIsSubmit(false);
      } else {
        io.emit("sendMessage", {
          assistant: userId,
          client: client,
          content: e?.trim(),
          sender: "assistant",
          projectId: projectAssistant,
          avisId: comp._id,
          contentType: "text",
        });
        setIsSubmit(false);
        setMessage("");
      }
      setLastMessageSentBy(userType);
      setIsLastMessageViewed(false);
    }
  };

  const addFavorite = async () => {
    setLoadingBar(50);
    if (userType === "client") {
      const data = await addClientFavorite(comp?._id, user._id);
      if (data.created) {
        setIsFavourite(data.created);
      }
    } else {
      //.log(comp?._id, user._id);
      const data = await addAssistantFavorite(comp?._id, user._id);
      //.log(data);
    }

    setLoadingBar(100);
    setLoadingBar(0);
    setRender((a) => a + 1);
  };

  const deleteFavorite = async () => {
    setLoadingBar(50);
    let data;

    if (userType === "client") {
      data = await deleteClientFavorite(comp?._id, user._id);
    } else {
      data = await deleteAssistantFavorite(comp?._id, user._id);
    }
    if (data.deleted) {
      setIsFavourite(!data.deleted);
    }

    setLoadingBar(100);
    setLoadingBar(0);
    setRender((a) => a + 1);
  };
  //.log(blocageType, userType);
  const deleteBlock = () => {
    if (blocageType === userType && isBlocked) {
      setBlocStatus("pending");

      if (userType === "client") {
        io.emit("deleteBlock", {
          by: user._id,
          avisId: comp?._id,
          user: userInfos._id,
        });
      } else {
        io.emit("deleteBlock", {
          by: user._id,
          avisId: comp?._id,
          user: userInfos._id,
        });
      }
      // setBlocStatus("normal");
    }
  };

  const AddBlock = () => {
    if (!blocageType && !isBlocked) {
      setBlocStatus("pending");

      if (userType === "client") {
        //("lasa");
        io.emit("block", {
          by: user._id,
          avisId: comp?._id,
          user: userInfos._id,
          type: "client",
        });
      } else {
        io.emit("block", {
          by: user._id,
          avisId: comp?._id,
          user: userInfos._id,
          type: "assistant",
        });
      }
      // setBlocStatus("normal");
    }
  };
  const path = usePathname();

  return !noConversation && path === "/mes-projets" && userType === "client" ? (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "#b9b9b9",
      }}
    >
      <h4>Aucun message</h4>
      <p style={{ textAlign: "center" }}>
        Vous n&apos;avez pas encore envoyé de message à un(e) assistant(e)
        virtuel(le) sur ce projet
      </p>
    </div>
  ) : (
    <ClientOnly>
      <div className={styles.container}>
        <div className={styles.fl}>
          {pathname !== "/mes-projets" && pathname !== "/mes-avis" ? (
            <i
              className={
                (pageActuelle === 1 && indexAvisSelectionee === 0) ||
                (actualClientIndex === 0 &&
                  currentPage === 1 &&
                  infosStatus === "middle") ||
                ((infosStatus === "rightFavourite" || infosStatus === "fav") &&
                  index === 0) ||
                (infosStatus === "conversationFavourite" &&
                  conversationAvisIndex === 0)
                  ? `${styles.disable}`
                  : null
              }
              onClick={() => {
                if (userType === "client") {
                  if (infosStatus === "middle") {
                    dispatch(
                      updateClientAvisInfos({
                        userInfos:
                          pageActuelle > 1 && indexAvisSelectionee === 0
                            ? avis[indexAvisSelectionee].assistantId
                            : avis[indexAvisSelectionee - 1].assistantId,
                        indexAvisSelectionee:
                          pageActuelle > 1 && indexAvisSelectionee === 0
                            ? 3
                            : indexAvisSelectionee - 1,
                        pageActuelle:
                          pageActuelle > 1 && indexAvisSelectionee === 0
                            ? pageActuelle - 1
                            : pageActuelle,
                      })
                    );
                  } else if (
                    infosStatus === "rightFavourite" ||
                    infosStatus === "fav"
                  ) {
                    dispatch(
                      updateRightAvis({
                        actualAvis: rightAvis[index - 1],
                        index: index - 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: rightAvis[index - 1].assistantId,
                      })
                    );
                  } else {
                    dispatch(
                      updateConversationRightAvis({
                        actualConversationAvis:
                          conversationAvis[conversationAvisIndex - 1],
                        conversationAvisIndex: conversationAvisIndex - 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos:
                          conversationAvis[conversationAvisIndex - 1]
                            .assistantId,
                      })
                    );
                  }
                } else if (userType === "assistant") {
                  if (
                    infosStatus === "middle" ||
                    infosStatus === "messageIcon"
                  ) {
                    let page =
                      currentPage > 1 && actualClientIndex === 0
                        ? currentPage - 1
                        : currentPage;
                    let index =
                      currentPage > 1 && actualClientIndex === 0
                        ? 3
                        : actualClientIndex - 1;

                    dispatch(
                      updateProjets({
                        actualClientIndex: index,
                        currentPage: page,
                        prev: page < currentPage ? true : false,
                      })
                    );
                    if (page === currentPage && actualClientIndex >= 1) {
                      dispatch(
                        fetchClientProjets({
                          actualClientProjet:
                            clientProjets[actualClientIndex - 1].projectId,
                          correspondance:
                            clientProjets[actualClientIndex - 1].correspondance,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos:
                            clientProjets[actualClientIndex - 1].projectId
                              .clientId,
                        })
                      );
                    }
                  } else if (
                    infosStatus === "rightFavourite" ||
                    infosStatus === "fav"
                  ) {
                    dispatch(
                      updateRightAvis({
                        actualAvis: rightAvis[index - 1],
                        index: index - 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: rightAvis[index - 1]?.projectId?.clientId,
                      })
                    );
                  } else {
                    dispatch(
                      updateConversationRightAvis({
                        actualConversationAvis:
                          conversationAvis[conversationAvisIndex - 1],
                        conversationAvisIndex: conversationAvisIndex - 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos:
                          conversationAvis[conversationAvisIndex - 1].projectId
                            .clientId,
                      })
                    );
                  }
                }
              }}
            >
              <BiSolidLeftArrow size={"1.5rem"} />
            </i>
          ) : (
            <Tooltip title={tooltip?.left} placement="top-end">
              <i onClick={() => setIsActive({ obj: tooltip?.lAbr })}>
                <BiSolidLeftArrow size={"1.5rem"} />
              </i>
            </Tooltip>
          )}
        </div>
        <div className={styles.mesCnt}>
          <div className={styles.top}>
            <div className={styles.cnt}>
              <div className={styles.tl}>
                <div>
                  <span className={`${styles.bld} usn`}>Destinataire :</span>
                  <span>{status.isOnline ? "En ligne" : "Hors ligne"}</span>
                  <span
                    className={status.isOnline ? styles.mark : styles.offline}
                  ></span>
                  {!status.isOnline && <span>{status.message}</span>}
                </div>
                <div>
                  <span className={`${styles.bld} usn`}>Objet :</span>
                  <span>
                    {userType === "client" &&
                    (infosStatus === "middle" || infosStatus === "messageIcon")
                      ? actualProject.name
                      : userType === "assistant" &&
                        (infosStatus === "middle" ||
                          infosStatus === "messageIcon")
                      ? actualClientProjet.name
                      : infosStatus === "conversationFavourite"
                      ? actualConversationAvis?.projectId?.name
                      : actualAvis?.projectId?.name}
                  </span>
                </div>
              </div>
              <div className={styles.tr}>
                <i
                  style={{
                    color: isFavourite && "#036eff",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (isFavourite) {
                      deleteFavorite();
                    } else {
                      addFavorite();
                    }
                  }}
                >
                  <IoIosHeart size={"1.5rem"} />
                </i>
                <i
                  style={{
                    color: isBlocked && "#036eff",
                    cursor: "pointer",
                    pointerEvents: blocStatus === "pending" && "none",
                  }}
                  onClick={() => {
                    //(isBlocked, "salut");
                    if (isBlocked) {
                      deleteBlock();
                    } else {
                      AddBlock();
                    }
                  }}
                >
                  <MdNotInterested size={"1.5rem"} />
                </i>
              </div>
            </div>
            <div className={styles.hr} />
          </div>

          <div className={styles.mid}>
            <div className={styles.cmd}>
              <div className={`${styles.dti} scr`}>
                <div
                  style={{
                    height: "100%",
                  }}
                  className={styles.lti}
                >
                  {messages?.map((m, i) => {
                    if (m.from === userId) {
                      return (
                        <RightMessage
                          key={i}
                          time={m.time}
                          message={m.content}
                          date={m?.date}
                          contentType={m.contentType}
                          _id={m._id}
                        />
                      );
                    } else {
                      return (
                        <LeftMessage
                          key={i}
                          time={m.time}
                          date={m?.date}
                          message={m.content}
                          contentType={m.contentType}
                          _id={m._id}
                        />
                      );
                    }
                  })}
                  {!messages?.length && (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Aucun message
                    </div>
                  )}
                  <div
                    style={{
                      height: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                    ref={msgEnd}
                  >
                    {isTyping ? <TypingAnimation /> : <span></span>}{" "}
                    {lastMessageSentBy === userType && (
                      <span
                        style={{
                          color: "black",
                        }}
                      >
                        {isLastMessageViewed ? (
                          <BsCheck2All size={"1.5rem"} color="#036eff" />
                        ) : (
                          <BsCheck2All size={"1.5rem"} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {isBlocked ? (
              <div>
                {" "}
                {blocageType === userType
                  ? "Vous avez bloqué cet utilisateur"
                  : "vous êtes bloqué par cet utilisateur"}{" "}
              </div>
            ) : !voiceMessage ? (
              <form onSubmit={handleSubmit} className={styles.bot}>
                <div className={styles.hr} />
                <div
                  className={
                    isFlexEnd ? `${styles.cnb} ${styles.fe}` : `${styles.cnb}`
                  }
                >
                  <div className={styles.btl}>
                    <i onClick={() => setVoiceMessage(true)}>
                      <AiFillPlusCircle size={"1.3rem"} />
                    </i>
                    <i>
                      <input
                        style={{ width: "0px", display: "none" }}
                        type="file"
                        accept=".pdf, .doc, .docx, .odt, .txt"
                        id="doc"
                        onChange={handleChangeFile2}
                      />
                      <label style={{ cursor: "pointer" }} htmlFor="doc">
                        <TiAttachment size={"1.5rem"} />
                      </label>
                    </i>
                    <i>
                      {/* <input
                      style={{ width: "0px" }}
                      type="file"
                      accept=".jpg, .jpeg, .png, .svg"
                      id="file"
                      onChange={handleChangeFile}
                    /> */}
                      <input
                        style={{ width: "0px", display: "none" }}
                        type="file"
                        accept=".jpg, .jpeg, .png, .svg"
                        id="do"
                        onChange={handleChangeFile}
                      />
                      {/* <label
                      htmlFor="file"
                    >
                      <IoMdImages
                        style={{ cursor: "pointer" }}
                        size={"1.35rem"}
                      />
                    </label> */}
                      <label style={{ cursor: "pointer" }} htmlFor="do">
                        <IoMdImages size={"1.35rem"} />
                      </label>
                    </i>
                  </div>
                  {/* <div
                className={
                  isFlexEnd ? `${styles.txt} ${styles.fe}` : `${styles.txt}`
                }
              >
                <div className={styles.contTxt}>
                  <textarea
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    ref={textarea}
                    placeholder="Aa"
                    onKeyDown={handleEnter}
                    rows={1}
                  />
                </div>
                <i>
                  <HiOutlineFaceSmile size={"1.35rem"} />
                </i>
                
              </div> */}
                  <InputEmoji
                    value={message}
                    ref={textarea}
                    onChange={(e) => {
                      setMessage(e);
                    }}
                    cleanOnEnter
                    onEnter={handleEnter}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Aa"
                    language="fr"
                    keepOpened={true}
                    buttonElement={
                      <i>
                        <HiOutlineFaceSmile size={"1.35rem"} />
                      </i>
                    }
                  />
                  <button
                    type="submit"
                    style={{
                      background: message?.length > 0 ? "#036eff" : "#d9d9d9",
                    }}
                    className={styles.submit}
                  >
                    <i>
                      <FiSend size={"1.25rem"} />
                    </i>
                  </button>
                </div>
              </form>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <div
                  className={styles.tr}
                  style={{
                    fontWeight: "bold",
                    background: "#036eff",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "2px",
                  }}
                  onClick={() => setVoiceMessage(false)}
                >
                  <i
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <MdOutlineArrowBackIosNew
                      style={{
                        fontSize: "28px",
                        width: "1.4rem",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    />
                  </i>
                </div>
                <Recorder
                  avisId={comp._id}
                  setPopUp={setPopUp}
                  setVoiceMessage={setVoiceMessage}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.fl}>
          {pathname !== "/mes-projets" && pathname !== "/mes-avis" ? (
            <i
              className={
                (pageActuelle === taillePage &&
                  indexAvisSelectionee === lastIndex) ||
                (currentPage === pageLength &&
                  lastClientIndex === actualClientIndex) ||
                ((infosStatus === "rightFavourite" || infosStatus === "fav") &&
                  index === length - 1) ||
                (infosStatus === "conversationFavourite" &&
                  conversationAvisIndex === conversationAvisLength - 1)
                  ? `${styles.disable}`
                  : null
              }
              onClick={() => {
                if (userType === "client") {
                  if (
                    infosStatus === "middle" ||
                    infosStatus === "messageIcon"
                  ) {
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: avis[indexAvisSelectionee + 1]?.assistantId,
                        indexAvisSelectionee:
                          pageActuelle < taillePage &&
                          indexAvisSelectionee === 3
                            ? 0
                            : indexAvisSelectionee + 1,
                        pageActuelle:
                          pageActuelle < taillePage &&
                          indexAvisSelectionee === 3
                            ? pageActuelle + 1
                            : pageActuelle,
                      })
                    );
                  } else if (
                    infosStatus === "rightFavourite" ||
                    infosStatus === "fav"
                  ) {
                    dispatch(
                      updateRightAvis({
                        actualAvis: rightAvis[index + 1],
                        index: index + 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: rightAvis[index + 1].assistantId,
                      })
                    );
                  } else {
                    dispatch(
                      updateConversationRightAvis({
                        actualConversationAvis:
                          conversationAvis[conversationAvisIndex + 1],
                        conversationAvisIndex: conversationAvisIndex + 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos:
                          conversationAvis[conversationAvisIndex + 1]
                            ?.assistantId,
                      })
                    );
                  }
                } else if (userType === "assistant") {
                  if (
                    infosStatus === "middle" ||
                    infosStatus === "messageIcon"
                  ) {
                    let page =
                      currentPage < pageLength && actualClientIndex === 3
                        ? currentPage + 1
                        : currentPage;
                    let index =
                      currentPage <= pageLength && actualClientIndex < 3
                        ? actualClientIndex + 1
                        : 0;
                    dispatch(
                      updateProjets({
                        actualClientIndex: index,
                        currentPage: page,
                        next: page > currentPage ? true : false,
                      })
                    );
                    if (page === currentPage && actualClientIndex < 3) {
                      dispatch(
                        fetchClientProjets({
                          actualClientProjet:
                            clientProjets[actualClientIndex + 1].projectId,
                          correspondance:
                            clientProjets[actualClientIndex + 1].correspondance,
                        })
                      );
                      dispatch(
                        updateClientAvisInfos({
                          userInfos:
                            clientProjets[actualClientIndex + 1].projectId
                              .clientId,
                        })
                      );
                    }
                  } else if (
                    infosStatus === "rightFavourite" ||
                    infosStatus === "fav"
                  ) {
                    dispatch(
                      updateRightAvis({
                        actualAvis: rightAvis[index + 1],
                        index: index + 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: rightAvis[index + 1]?.projectId?.clientId,
                      })
                    );
                  } else {
                    dispatch(
                      updateConversationRightAvis({
                        actualConversationAvis:
                          conversationAvis[conversationAvisIndex + 1],
                        conversationAvisIndex: conversationAvisIndex + 1,
                      })
                    );
                    dispatch(
                      updateClientAvisInfos({
                        userInfos:
                          conversationAvis[conversationAvisIndex + 1].projectId
                            .clientId,
                      })
                    );
                  }
                }
              }}
            >
              <BiSolidRightArrow size={"1.5rem"} />
            </i>
          ) : (
            <Tooltip title={tooltip?.right} placement="top-end">
              <i onClick={() => setIsActive({ obj: tooltip?.rAbr })}>
                <BiSolidRightArrow size={"1.5rem"} />
              </i>
            </Tooltip>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
