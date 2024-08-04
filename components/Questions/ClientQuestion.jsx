/** @format */

"use client";

// styles
import styles from "@/styles/home/infohub/Question.module.css";

// react
import { useContext, useEffect, useState } from "react";
import { UidContext } from "@/context/UidContext";
import { Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";

// components

// redux
import { useSelector, useDispatch } from "react-redux";
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";
import { updateRightAvis } from "@/redux/slices/rightAvisSlice";
import { updateConversationRightAvis } from "@/redux/slices/conversationRightSlice";
// icons
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { getAssistantResponses2 } from "@/lib/controllers/projet.controller";
import { determineTooltip } from "@/lib/function";

const ClientQuestions = ({
  assistantIndex,
  setAssistantIndex,
  infosStatus,
}) => {
  const { actualProject, actualProjetId } = useSelector(
    (state) => state.projets
  );
  const {
    avis,
    pageActuelle,
    indexAvisSelectionee,
    userInfos,
    taillePage,
    lastIndex,
  } = useSelector((state) => state.clientAvis);
  const { setIsActive, isActive } = useContext(UidContext);
  const [tooltip, setTooltip] = useState();
  const pathname = usePathname();

  useEffect(() => {
    setTooltip(determineTooltip(isActive.obj));
  }, [isActive.obj]);

  const {
    avis: rightAvis,
    actualAvis,
    index,
    length,
  } = useSelector((state) => state.rightAvis);

  const {
    conversationAvis,
    actualConversationAvis,
    conversationAvisLength,
    conversationAvisIndex,
  } = useSelector((state) => state.conversationAvis);

  const { setLoadingBar, userId } = useContext(UidContext);
  const [responses, setResponses] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getResponses() {
      setLoadingBar(50);
      const data = await getAssistantResponses2(
        actualProjetId,
        userInfos?._id,
        userId
      );

      setLoadingBar(80);
      if (data?.response?.response) {
        setResponses(data?.response?.response);
        setLoadingBar(100);
      } else {
        setResponses([]);
        setLoadingBar(100);
      }
      setLoadingBar(0);
    }

    getResponses();
  }, [userInfos]);
  return (
    <div className={`${styles.container} scr`}>
      <div className={styles.grid}>
        {actualProject?.questions.map((q, i) => (
          <div key={i} className={styles.cntq}>
            <label htmlFor="">{q}</label>
            <textarea
              className="scr"
              rows={5}
              readOnly
              onChange={() => {}}
              value={
                responses?.length
                  ? responses[i]?.length > 160
                    ? responses[i].slice(0, 160)
                    : responses[i]
                  : ""
              }
            />
          </div>
        ))}
      </div>
      <div className={styles.bot}>
        {pathname !== "/mes-projets" ? (
          <>
            <i
              className={
                (pageActuelle === 1 && indexAvisSelectionee === 0) ||
                ((infosStatus === "rightFavourite" || infosStatus === "fav") &&
                  index === 0) ||
                (infosStatus === "conversationFavourite" &&
                  conversationAvisIndex === 0)
                  ? `${styles.disable}`
                  : null
              }
              onClick={() => {
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
                        conversationAvis[conversationAvisIndex - 1].assistantId,
                    })
                  );
                }
              }}
            >
              <BiSolidLeftArrow size={"1.5rem"} />
            </i>
            <i
              className={
                (pageActuelle === taillePage &&
                  indexAvisSelectionee === lastIndex) ||
                ((infosStatus === "rightFavourite" || infosStatus === "fav") &&
                  index === length - 1) ||
                (infosStatus === "conversationFavourite" &&
                  conversationAvisIndex === conversationAvisLength - 1)
                  ? `${styles.disable}`
                  : null
              }
              onClick={() => {
                if (infosStatus === "middle") {
                  dispatch(
                    updateClientAvisInfos({
                      userInfos: avis[indexAvisSelectionee + 1]?.assistantId,
                      indexAvisSelectionee:
                        pageActuelle < taillePage && indexAvisSelectionee === 3
                          ? 0
                          : indexAvisSelectionee + 1,
                      pageActuelle:
                        pageActuelle < taillePage && indexAvisSelectionee === 3
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
                        conversationAvis[conversationAvisIndex + 1].assistantId,
                    })
                  );
                }
              }}
            >
              <BiSolidRightArrow size={"1.5rem"} />
            </i>
          </>
        ) : (
          <>
            <Tooltip title={tooltip?.left} placement="top-end">
              <i onClick={() => setIsActive({ obj: tooltip?.lAbr })}>
                <BiSolidLeftArrow size={"1.5rem"} />
              </i>
            </Tooltip>
            <Tooltip title={tooltip?.right} placement="top-end">
              <i onClick={() => setIsActive({ obj: tooltip?.rAbr })}>
                <BiSolidRightArrow size={"1.5rem"} />
              </i>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientQuestions;
