/** @format */

"use client";

// styles
import styles from "../../../styles/home/infohub/Question.module.css";

// react
import { useContext } from "react";
import { UidContext } from "@/context/UidContext";

// components
import ClientOnly from "@/components/ClientOnly";

// redux
import { useSelector } from "react-redux";

// icons
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import ClientQuestions from "@/components/Questions/ClientQuestion";
import AssistantQuestions from "@/components/Questions/AssistantQuestions";

export default function Questions({
  assistantIndex,
  setAssistantIndex,
  userInfos,
  infosStatus,
}) {
  const { userType } = useSelector((state) => state.persistInfos);

  return (
    <ClientOnly>
      {userType === "client" ? (
        <ClientQuestions
          assistantIndex={assistantIndex}
          setAssistantIndex={setAssistantIndex}
          infosStatus={infosStatus}
        />
      ) : (
        <AssistantQuestions infosStatus={infosStatus} />
      )}
    </ClientOnly>
  );
}
