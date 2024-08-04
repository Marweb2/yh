"use client";
import { UidContext } from "@/context/UidContext";

import React, { useRef, useState, useContext, useEffect } from "react";
import { GoTriangleDown } from "react-icons/go";
import styles from "@/styles/publicationForm/publicationForm.module.css";
import { CSSTransition } from "react-transition-group";
import { CgClose } from "react-icons/cg";
import { competVirt } from "@/lib/menuDeroulant";
import { FiSend } from "react-icons/fi";
import { TiAttachment } from "react-icons/ti";
import { AiFillPlusCircle } from "react-icons/ai";
import { IoMdImages } from "react-icons/io";
import { GoSmiley } from "react-icons/go";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  createPublication,
  getFilters,
} from "@/lib/controllers/projet.controller";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function PublicationForm({
  isActive,
  setIsActive,
  setPublication,
  activeBtnIndex,
}) {
  const ref = useRef();
  const ref2 = useRef();
  const [showComp, setShwowComp] = useState(false);
  const [docType, setDocType] = useState("");
  const [filter, setFilter] = useState([]);
  const { userId } = useContext(UidContext);
  const { user } = useSelector((state) => state.user);
  const { userType } = useSelector((state) => state.persistInfos);
  const [comp, setComp] = useState([]);
  const [error, setError] = useState({
    compError: false,
    titleError: false,
    descError: false,
    error: false,
    first: true,
  });
  const [showEmojy, setShowEmojy] = useState(false);
  const [lastFocus, setLasFocus] = useState("");
  const { setLoadingBar } = useContext(UidContext);

  useEffect(() => {
    async function fetchData() {
      const data = await getFilters(userId);
      console.log(data, userId);

      if (userType === "assistant" && data) {
        setFilter(
          [...data.filter, ...user.competenceVirtuelle].sort((a, b) =>
            a.localeCompare(b)
          )
        );
      } else if (data) {
        setFilter(data?.filter?.sort((a, b) => a.localeCompare(b)));
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setComp([
      ...filter,
      ...competVirt.filter((val) => !filter.find((e) => e === val)),
    ]);
  }, [filter]);

  const [form, setForm] = useState({
    competence: "",
    title: "",
    description: "",
    attachment: "",
    attachmentType: "",
    attachmentName: "",
  });

  const handleChangeFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64String = event.target.result;
        setForm((prev) => ({
          ...prev,
          attachment: base64String,
          attachmentType: docType,
          attachmentName: e.target.files[0].name,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleChange = (e) => {
    if (e.target.value.length <= 800) {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const insertEmojy = (e) => {
    setForm((prev) => ({
      ...prev,
      [lastFocus]: `${prev[lastFocus]}${e.native}`,
    }));
  };

  useEffect(() => {
    if (!form.competence) {
      setError((prev) => ({ ...prev, compError: true, error: true }));
    } else {
      setError((prev) => ({ ...prev, compError: false }));
    }
    if (!form.title) {
      setError((prev) => ({ ...prev, titleError: true, error: true }));
    } else {
      setError((prev) => ({ ...prev, titleError: false }));
    }
    if (!form.description) {
      setError((prev) => ({ ...prev, descError: true, error: true }));
    } else {
      setError((prev) => ({ ...prev, descError: false }));
    }
  }, [form]);

  const handleSubmit = async () => {
    if (!error.compError && !error.titleError && !error.descError) {
      setLoadingBar(50);
      setLoadingBar(60);
      setLoadingBar(70);
      setLoadingBar(80);
      const data = await createPublication(userId, {
        ...form,
        place: activeBtnIndex.index === 1 ? "my_articles" : "news_feed",
      });
      setLoadingBar(90);
      setLoadingBar(100);
      if (data) {
        setForm({
          competence: "",
          title: "",
          description: "",
          attachment: "",
          attachmentType: "",
          attachmentName: "",
        });
      }
      setForm({
        competence: "",
        title: "",
        description: "",
        attachment: "",
        attachmentType: "",
        attachmentName: "",
      });
      setError({
        compError: false,
        titleError: false,
        descError: false,
        error: false,
        first: true,
      });

      setPublication((prev) => [{ ...form, user }, ...prev]);
      setLoadingBar(0);
      setIsActive(false);

      return;
    } else {
      setError((prev) => ({ ...prev, error: true, first: false }));
    }
  };
  const handleFocus = (e) => {
    setLasFocus(e.target.name);
  };
  return (
    <CSSTransition
      in={isActive}
      timeout={350}
      classNames={"pcf"}
      unmountOnExit
      nodeRef={ref}
    >
      <div className={styles.popup}>
        <section ref={ref} className={styles.container}>
          <div className={styles.title}>
            <div className={styles.txt}>
              <h4>Créer une publication</h4>
            </div>
            <button
              onClick={() => {
                setForm({
                  competence: "",
                  title: "",
                  description: "",
                  attachment: "",
                  attachmentType: "",
                  attachmentName: "",
                });
                setError({
                  compError: false,
                  titleError: false,
                  descError: false,
                  error: false,
                  first: true,
                });
                setIsActive(false);
              }}
              className={styles.btn}
            >
              <CgClose />
            </button>
          </div>
          <div className={styles.user}>
            <div className={styles.photo}>
              <Image
                src={user.image[0] ? user.image[0] : "/default_avatar.jpg"}
                fill
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div className={styles.info}>
              <h4>
                {user.username} {user.name}
              </h4>
              <p>{user.statutProfessionnelle}</p>
            </div>
          </div>
          <section className={styles.form}>
            <div className={styles.comp}>
              <label htmlFor="down">Compétence:</label>
              <div
                style={{
                  borderColor: !error.first && error.compError && "#ff5757",
                }}
                className={styles.fakeInput}
              >
                <input
                  onClick={() => setShwowComp((prev) => !prev)}
                  value={form.competence}
                  type="text"
                  placeholder="Compétence"
                  readOnly
                />
                <i
                  onClick={() => setShwowComp((prev) => !prev)}
                  id="down"
                  className="c-pointer"
                >
                  <GoTriangleDown />
                </i>
                <CSSTransition
                  in={showComp}
                  timeout={350}
                  classNames={"pcf"}
                  unmountOnExit
                  nodeRef={ref2}
                >
                  <div ref={ref2} className={styles.drop}>
                    {comp
                      .filter((e) => e !== "")
                      .map((value, i) => (
                        <p
                          key={i}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              competence: value,
                            }));
                            setShwowComp(false);
                          }}
                          className={styles.item}
                        >
                          {value}
                        </p>
                      ))}
                  </div>
                </CSSTransition>
              </div>
            </div>
            <div className={styles.inputs}>
              <input
                name="title"
                onChange={handleChange}
                value={form.title}
                placeholder="Titre"
                type="text"
                style={{
                  borderColor: !error.first && error.titleError && "#ff5757",
                }}
                onFocus={handleFocus}
              />
              <textarea
                placeholder="Description"
                rows={7}
                id=""
                name="description"
                onChange={handleChange}
                value={form.description}
                style={{
                  borderColor: !error.first && error.descError && "#ff5757",
                }}
                onFocus={handleFocus}
              ></textarea>
            </div>
          </section>
          <section className={styles.bottom}>
            {/* <i>
              <AiFillPlusCircle size={"1.3rem"} />
            </i> */}
            <p>{form.attachmentName && form.attachmentName}</p>
            <i onClick={() => setDocType("document")}>
              <input
                style={{ width: "0px", display: "none" }}
                type="file"
                accept=".pdf, .doc, .docx, .odt, .txt"
                id="doc"
                onChange={handleChangeFile}
              />
              <label style={{ cursor: "pointer" }} htmlFor="doc">
                <TiAttachment size={"1.5rem"} />
              </label>
            </i>
            <i onClick={() => setDocType("image")}>
              <input
                style={{ width: "0px", display: "none" }}
                type="file"
                accept=".jpg, .jpeg, .png, .svg"
                id="do"
                onChange={handleChangeFile}
              />
              <label style={{ cursor: "pointer" }} htmlFor="do">
                <IoMdImages size={"1.35rem"} />
              </label>
            </i>
            <i
              onClick={() => {
                if (!lastFocus) {
                  setShowEmojy(false);
                } else {
                  setShowEmojy(true);
                }
              }}
            >
              <label style={{ cursor: "pointer" }}>
                <GoSmiley size={"1.35rem"} />
              </label>
            </i>
            <i
              style={{
                background: "#036eff",
                color: "white",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
              }}
              onClick={handleSubmit}
            >
              <FiSend size={"1.35rem"} />
            </i>
          </section>
        </section>
        {showEmojy && lastFocus !== "" && (
          <div
            style={{
              position: "absolute",
              right: "0",
            }}
          >
            <Picker
              locale="fr"
              previewPosition="none"
              onEmojiSelect={insertEmojy}
              data={data}
              emojiSize={20}
              emojiButtonSize={28}
              onClickOutside={() => {
                setLasFocus("");
                setShowEmojy(false);
              }}
              theme="light"
            />
          </div>
        )}
      </div>
    </CSSTransition>
  );
}
