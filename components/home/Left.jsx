/** @format */

"use client";

//styles
import styles from "../../styles/home/Left.module.css";

import Image from "next/image";
import Calendar from "./Calendar";
import ClientOnly from "../ClientOnly";
import Link from "next/link";

import { isEmpty } from "@/lib/utils/isEmpty";
import { useEffect, useState, useRef, useContext } from "react";

// icons
import { HiPencilAlt } from "react-icons/hi";
import { BsShare } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineStar } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoNewspaperOutline } from "react-icons/io5";

// controllers
import { removeHTTPPrefixController } from "@/lib/controllers/http.controller";
import { updateDispController } from "@/lib/controllers/user.controller";

// redux
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfos } from "@/redux/slices/userSlice";
import { UidContext } from "@/context/UidContext";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Left({
  // userInfos?,
  isCollapse,
  setIsCollapse,
  isEditProfil,
  setIsEditProfil,
  isOwn,
  isHome,
}) {
  const { user } = useSelector((state) => state.user);
  const { userId, setIsLoadingBar } = useContext(UidContext);

  const dispatch = useDispatch();
  const ref = useRef();

  const [canUpdate, setCanUpdate] = useState(false);
  const [active, setActive] = useState({ obj: "bio" });
  const [infosToUpdate, setInfosToUpdate] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [newNote, setNewNote] = useState({
    obj: "",
    value: false,
  });
  const [newDisp, setNewDisp] = useState({
    obj: [],
    value: false,
  });
  const { userInfos } = useSelector((state) => state.clientAvis);
  const path = usePathname();
  const searchParams = useSearchParams();

  const articles = searchParams.get("articles");

  useEffect(() => {
    if (articles === "true") {
      setIsCollapse(() => ({ obj: "", value: true }));
    }
  }, [articles]);

  useEffect(() => {
    if (userInfos) {
      setNewDisp((prev) => ({ ...prev, obj: userInfos?.disponibilite }));
      setNewNote((prev) => ({ ...prev, obj: userInfos?.note }));
    }
  }, [userInfos]);

  useEffect(() => {
    //note
    if (newNote.obj?.trim() !== user?.note) {
      if (!newNote.value) {
        setNewNote((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({ ...prev, note: newNote.obj }));
    } else if (newNote.obj?.trim() === user?.note) {
      if (!newNote.value) {
        setNewNote((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { note, ...nwe } = prev;
        return nwe;
      });
    }
  }, [newNote.obj]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!isEmpty(infosToUpdate)) {
      setIsLoading(true);
      const res = await updateDispController({
        ...infosToUpdate,
        id: userId,
      });
      setCanUpdate(false);
      setIsLoading(false);
      if (!isEmpty(res?.user)) {
        dispatch(updateUserInfos({ user: res.user }));
        setInfosToUpdate({});
        setCanUpdate(false);
      }
    } else {
      setCanUpdate(false);
      setInfosToUpdate({});
    }
  };

  return (
    <ClientOnly pr>
      <div
        ref={ref}
        className={
          isCollapse.obj === "profil"
            ? `${styles.container} ${styles.col}`
            : `${styles.container}`
        }
      >
        <div className={styles.top}>
          <div
            onClick={() => {
              setIsCollapse((prev) => ({ ...prev, obj: "profil" }));
            }}
            className={styles.lg}
          >
            <span>
              <RxAvatar size={"1.75rem"} className="try1" />
            </span>
            <label>Profil</label>
          </div>
          <i onClick={() => setIsCollapse(() => ({ obj: "", value: true }))}>
            <IoIosArrowRoundBack size="2rem" />
          </i>
        </div>

        <div className={`${styles.contenu} scr`}>
          <div className={styles.profil}>
            <div className={styles.left}>
              <Image
                src={
                  !isEmpty(userInfos?.image)
                    ? userInfos?.image[0]
                    : "/default_avatar.jpg"
                }
                alt=""
                className={styles.profilImg}
                width={100}
                height={100}
              />
            </div>
            <div className={styles.right}>
              <h1>
                {userInfos?.username}, {userInfos?.name}
              </h1>
              {(!isEmpty(userInfos?.statutProfessionnelle) ||
                !isEmpty(userInfos?.ville) ||
                !isEmpty(userInfos?.pays)) && (
                <div className={styles.ils}>
                  {!isEmpty(userInfos?.statutProfessionnelle) && (
                    <p>{userInfos?.statutProfessionnelle}</p>
                  )}
                  {(!isEmpty(userInfos?.ville) ||
                    !isEmpty(userInfos?.pays)) && (
                    <p>
                      {!isEmpty(userInfos?.ville) &&
                      !isEmpty(userInfos?.province) ? (
                        <>
                          {userInfos?.ville} - {userInfos?.province}
                          {", "}
                        </>
                      ) : (
                        !isEmpty(userInfos?.ville) && (
                          <>
                            {userInfos?.ville}
                            {", "}
                          </>
                        )
                      )}
                      {userInfos?.pays}
                    </p>
                  )}
                </div>
              )}
              <div className={styles.stars}>
                <div className={styles.icons}>
                  <AiOutlineStar size={"1.1rem"} />
                  <AiOutlineStar size={"1.1rem"} />
                  <AiOutlineStar size={"1.1rem"} />
                  <AiOutlineStar size={"1.1rem"} />
                  <AiOutlineStar size={"1.1rem"} />
                </div>
                <span>
                  {!isEmpty(user) && userInfos?.avis?.length === 0 ? (
                    <>aucun avis</>
                  ) : (
                    <>{userInfos?.avis?.length} avis</>
                  )}
                </span>
              </div>
              <div className={styles.shr}>
                <input
                  readOnly
                  id="portfolio"
                  className={styles.shrInput}
                  value={
                    removeHTTPPrefixController(
                      userInfos?.lienProfessionnelle
                    ) || "Lien professionnel"
                  }
                />
                {!isEmpty(userInfos?.lienProfessionnelle) ? (
                  <Link
                    target={"_blank"}
                    href={userInfos?.lienProfessionnelle}
                    className={styles.sh}
                  >
                    <BsShare size={".8rem"} className="try1" />
                  </Link>
                ) : (
                  <p className={`${styles.sh} ${styles.pdis}`}>
                    <BsShare size={".8rem"} className="try1" />
                  </p>
                )}
              </div>
            </div>
          </div>
          {userInfos?.userType === "assistant" ||
          userInfos?.userType === undefined ? (
            <div className={`${styles.middle}`}>
              <div className={styles.more}>
                <div className={styles.btn}>
                  <div
                    className={active.obj === "bio" ? `${styles.active}` : null}
                    onClick={() => setActive({ obj: "bio" })}
                  >
                    <label
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      Biographie
                    </label>
                  </div>
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    className={
                      active.obj === "disp" ? `${styles.active}` : null
                    }
                    onClick={() => setActive({ obj: "disp" })}
                  >
                    <label>Disponibilités</label>
                  </div>
                </div>
                <div
                  className={
                    active.obj === "disp"
                      ? `${styles.add} ${styles.addnt}`
                      : `${styles.add}`
                  }
                >
                  {active.obj === "bio" || active.obj === "" ? (
                    <textarea
                      readOnly
                      value={userInfos?.bio || ""}
                      onChange={() => {}}
                      className={`${styles.textarea} ${styles.btx} scr`}
                    />
                  ) : (
                    active.obj === "disp" && (
                      <form onSubmit={handlesubmit}>
                        <Calendar
                          isLeft={isOwn}
                          newDisp={newDisp}
                          setNewDisp={setNewDisp}
                          canUpdate={canUpdate}
                          setCanUpdate={setCanUpdate}
                          handlesubmit={handlesubmit}
                          isLoading={isLoading}
                          setIsCollapse={setIsCollapse}
                          setInfosToUpdate={setInfosToUpdate}
                          readOnly={!isOwn}
                        />
                        <div className={styles.note}>
                          <div>
                            <label htmlFor="note" className={styles.ntlab}>
                              Note :
                            </label>
                            <div>
                              <textarea
                                rows={3}
                                readOnly={!canUpdate}
                                value={newNote.obj}
                                id="note"
                                onChange={(e) =>
                                  setNewNote((prev) => {
                                    let nwn = { ...prev };
                                    nwn.obj = e.target.value;
                                    return nwn;
                                  })
                                }
                                className={
                                  canUpdate
                                    ? `${styles.textarea} ${styles.crt} scr`
                                    : `${styles.textarea} scr`
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    )
                  )}
                </div>
              </div>
              <div className={styles.moreInfos}>
                <div className={styles.op}>
                  <div>
                    <label htmlFor="cp" className={styles.lab}>
                      <span>Compéténces virtuelles</span>
                    </label>
                    <textarea
                      readOnly
                      id="cp"
                      className={`${styles.textarea} ${styles.def} scr`}
                      value={
                        userInfos?.competenceVirtuelle
                          ?.map((c, index, array) =>
                            index === array?.length - 1 ? c : c + "\n"
                          )
                          .join("") || ""
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="tar" className={styles.lab}>
                      <span>Tarifications</span>
                    </label>
                    <textarea
                      readOnly
                      id="tar"
                      value={`${
                        !isEmpty(userInfos?.tarif)
                          ? userInfos?.tarif + "$/h" + "\n"
                          : ""
                      }${
                        userInfos?.montantForfaitaire
                          ? "Montant forfaitaire" + "\n"
                          : ""
                      }${userInfos?.benevolat ? "Bénévolat" : ""}`}
                      className={`${styles.textarea} ${styles.def} scr`}
                    />
                  </div>
                </div>
                <div className={styles.op}>
                  <div>
                    <label htmlFor="web" className={styles.lab}>
                      <span>Application web</span>
                    </label>
                    <input
                      readOnly
                      id="web"
                      value={userInfos?.applicationWeb || ""}
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <label htmlFor="exp" className={styles.lab}>
                      <span>Expérience professionnelle</span>
                    </label>
                    <input
                      readOnly
                      id="exp"
                      value={userInfos?.experiencePro || ""}
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div className={styles.op}>
                  <div>
                    <label htmlFor="portfolio" className={styles.lab}>
                      <span>Portfolio</span>
                    </label>
                    <div className={styles.shr}>
                      <input
                        readOnly
                        id="portfolio"
                        className={styles.shrInput}
                        value={
                          removeHTTPPrefixController(userInfos?.portfolio) || ""
                        }
                      />
                      {!isEmpty(userInfos?.portfolio) ? (
                        <Link
                          target={"_blank"}
                          href={userInfos?.portfolio}
                          className={styles.sh}
                        >
                          <BsShare size={".8rem"} className="try1" />
                        </Link>
                      ) : (
                        <p className={`${styles.sh} ${styles.pdis}`}>
                          <BsShare size={".8rem"} className="try1" />
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="offre" className={styles.lab}>
                      <span>Offres de service</span>
                    </label>
                    <div className={styles.shr}>
                      <input
                        readOnly
                        id="offre"
                        value={
                          removeHTTPPrefixController(
                            userInfos?.offresDeService
                          ) || ""
                        }
                        className={styles.shrInput}
                      />
                      {!isEmpty(userInfos?.offresDeService) ? (
                        <Link
                          target={"_blank"}
                          href={userInfos?.offresDeService}
                          className={styles.sh}
                        >
                          <BsShare size={".8rem"} className="try1" />
                        </Link>
                      ) : (
                        <p className={`${styles.sh} ${styles.pdis}`}>
                          <BsShare size={".8rem"} className="try1" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.edit}>
                {userInfos?._id === user?._id ? (
                  <div
                    className={
                      isEditProfil
                        ? `${styles.profilLink} ${styles.disable}`
                        : `${styles.profilLink}`
                    }
                  >
                    <label
                      onClick={() => {
                        setIsCollapse((prev) => ({ ...prev, value: false }));
                        setIsEditProfil(true);
                      }}
                    >
                      <span>
                        <HiPencilAlt size={"1.25rem"} />
                      </span>
                      <span>Mettre à jour le profil</span>
                    </label>
                  </div>
                ) : (
                  <div
                    className={
                      // isInfos
                      //   ? `${styles.profilLink} ${styles.disable}`
                      //   :
                      `${styles.profilLink}`
                    }
                  >
                    {path === "/info-hub" ? (
                      <div>
                        <label
                          style={{
                            background: "#b9b9b9",
                            pointerEvents: "none",
                          }}
                          onClick={() => {}}
                        >
                          <span>
                            <IoNewspaperOutline size={"1.25rem"} />
                          </span>
                          <span className="upp">
                            Info
                            <span className={styles.linkStyle}>hub</span>
                          </span>
                        </label>
                      </div>
                    ) : (
                      <Link href={`/info-hub?articles=true`}>
                        <label onClick={() => {}}>
                          <span>
                            <IoNewspaperOutline size={"1.25rem"} />
                          </span>
                          <span className="upp">
                            Info
                            <span className={styles.linkStyle}>hub</span>
                          </span>
                        </label>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`${styles.middle} ${styles.middleCli}`}>
              <div className={styles.more}>
                <div className={styles.bcl}>
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    className={styles.btn}
                  >
                    <div className={styles.btnTop}>
                      <div className={`${styles.activeCli}`}>
                        <label>Biographie</label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.add}>
                    <textarea
                      readOnly
                      value={userInfos?.bio || ""}
                      className={`${styles.textarea} ${styles.btx} scr`}
                    />
                  </div>
                </div>
                <div className={styles.ccli}>
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    className={styles.btn}
                  >
                    <div className={styles.btnTop}>
                      <div className={`${styles.activeCli}`}>
                        <label>Disponibilités</label>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handlesubmit}>
                    <Calendar
                      isLeft={isOwn}
                      newDisp={newDisp}
                      setNewDisp={setNewDisp}
                      canUpdate={canUpdate}
                      setCanUpdate={setCanUpdate}
                      handlesubmit={handlesubmit}
                      isLoading={isLoading}
                      setIsCollapse={setIsCollapse}
                      setInfosToUpdate={setInfosToUpdate}
                      readOnly={!(userInfos?._id === user?._id)}
                    />
                    <div className={styles.note}>
                      <div>
                        <label htmlFor="note" className={styles.ntlab}>
                          Note :
                        </label>
                        <div>
                          <div className={styles.note}>
                            <div>
                              <label htmlFor="note" className={styles.ntlab}>
                                Note :
                              </label>
                              <div>
                                <textarea
                                  rows={3}
                                  readOnly={!canUpdate}
                                  value={newNote.obj}
                                  id="note"
                                  onChange={(e) =>
                                    setNewNote((prev) => {
                                      let nwn = { ...prev };
                                      nwn.obj = e.target.value;
                                      return nwn;
                                    })
                                  }
                                  className={
                                    canUpdate
                                      ? `${styles.textarea} ${styles.crt} scr`
                                      : `${styles.textarea} scr`
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className={`${styles.moreInfos} ${styles.mrf} `}>
                <div className={styles.op}>
                  <div>
                    <div className={styles.lab}>
                      <label htmlFor="portfolio">
                        <span>Portfolio</span>
                      </label>
                    </div>
                    <div className={styles.shr}>
                      <input
                        readOnly
                        id="portfolio"
                        className={styles.shrInput}
                        value={
                          removeHTTPPrefixController(userInfos?.portfolio) || ""
                        }
                      />
                      {!isEmpty(userInfos?.portfolio) ? (
                        <Link
                          target={"_blank"}
                          href={userInfos?.portfolio}
                          className={styles.sh}
                        >
                          <BsShare size={".8rem"} className="try1" />
                        </Link>
                      ) : (
                        <p className={`${styles.sh} ${styles.pdis}`}>
                          <BsShare size={".8rem"} className="try1" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.edit}>
                {isOwn ? (
                  <div
                    className={
                      isEditProfil
                        ? `${styles.profilLink} ${styles.disable}`
                        : `${styles.profilLink}`
                    }
                  >
                    <label
                      onClick={() => {
                        setIsCollapse((prev) => ({ ...prev, value: false }));
                        setIsEditProfil(true);
                      }}
                    >
                      <span>
                        <HiPencilAlt size={"1.25rem"} />
                      </span>
                      <span>Mettre à jour le profil</span>
                    </label>
                  </div>
                ) : (
                  <div
                    className={
                      // isInfos
                      //   ? `${styles.profilLink} ${styles.disable}`
                      //   :
                      `${styles.profilLink}`
                    }
                  >
                    {path === "/info-hub" ? (
                      <div
                        style={{
                          background: "#b9b9b9",
                          pointerEvents: "none",
                        }}
                      >
                        <label
                          onClick={() => {
                            setIsLoadingBar(50);
                          }}
                        >
                          <span>
                            <IoNewspaperOutline size={"1.25rem"} />
                          </span>
                          <span className="upp">
                            Info
                            <span className={styles.linkStyle}>hub</span>
                          </span>
                        </label>
                      </div>
                    ) : (
                      <Link href={`/info-hub?articles=true`}>
                        <label
                          onClick={() => {
                            setIsLoadingBar(50);
                          }}
                        >
                          <span>
                            <IoNewspaperOutline size={"1.25rem"} />
                          </span>
                          <span className="upp">
                            Info
                            <span className={styles.linkStyle}>hub</span>
                          </span>
                        </label>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
