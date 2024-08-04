/** @format */

"use client";

// styles
import styles from "../../styles/menu/Menu.module.css";

// react
import { usePathname } from "next/navigation";
import { UidContext } from "@/context/UidContext";
import { useContext, useRef, useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import ClientOnly from "../ClientOnly";

// controllers
import { logoutController } from "@/lib/controllers/auth.controller";

// icons
import { FaHome } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { GoBellFill } from "react-icons/go";
import { IoMdInformationCircle, IoMdSettings } from "react-icons/io";
import { AiFillPlusCircle } from "react-icons/ai";
import { TbBulb } from "react-icons/tb";
import { CgClose, CgMenuRightAlt } from "react-icons/cg";

// redux
import { useDispatch, useSelector } from "react-redux";
import { removeUserInfos } from "@/redux/slices/userSlice";
import { updatePersistInfos } from "@/redux/slices/persistSlice";
import { removeProjets } from "@/redux/slices/projetSlice";

// hooks
import useLogout from "@/lib/hooks/useLogout";
import useConfetti from "@/lib/hooks/useConfetti";
import { MdPhoneInTalk } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { FaCopyright } from "react-icons/fa6";
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";

export default function Menu({
  isInfos,
  setIsInfos,
  setUserInfos,
  isEditProfil,
  setIsEditProfil,
}) {
  const ref = useRef();
  const { setLoadingBar } = useContext(UidContext);
  const { authToken, userType } = useSelector((state) => state.persistInfos);
  const path = usePathname();
  const dispatch = useDispatch();
  const isLogout = useLogout();
  const confetti = useConfetti();
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (isActiveMenu) {
      const act = document.getElementById("menu");
      const handleClickOutside = (e) => {
        if (
          !e.target.id !== act &&
          ref.current &&
          !ref.current.contains(e.target)
        ) {
          setIsActiveMenu(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isActiveMenu]);
  const { render, setRender, infosStatus, setInfosStatus } =
    useContext(UidContext);

  const handleLogout = async () => {
    setLoadingBar(65);
    if (!isLogout.isActive) {
      isLogout.onActive();
    }
    if (confetti.isActive) {
      confetti.onDisable();
    }
    await logoutController(authToken).catch((err) => console.log(err.message));
    dispatch(updatePersistInfos({ authToken: null }));
    dispatch(removeProjets());
    dispatch(removeUserInfos());
    setLoadingBar(98);

    window.location = "/login";
  };
  const handleHome = () => {
    // if (isEditProfil) {
    //   setIsEditProfil(false);
    //   return;
    // }
    setInfosStatus("middle");
    setIsEditProfil(false);
    setIsInfos(false);
    dispatch(
      updateClientAvisInfos({
        userInfos: user,
      })
    );
    // setUserInfos(user);
  };

  return (
    <ClientOnly>
      <div
        className={
          isLogout.isActive ? `${styles.container} pen` : `${styles.container}`
        }
      >
        <div className={styles.top}>
          <div className={styles.left}>
            <Link href="/accueil">
              <Image
                src={"/logo.png"}
                alt=""
                priority={true}
                width={258}
                height={70}
                className={styles.logoImg}
              />
            </Link>
          </div>

          <div
            className={
              isActiveMenu
                ? `${styles.lgm} ${styles.activeMenu}`
                : `${styles.lgm}`
            }
          >
            <div id="menu" ref={ref} className={styles.cdm}>
              <div className={styles.menu}>
                {/* lg only */}

                {/* home */}
                <div
                  onClick={handleHome}
                  className={
                    path === "/accueil"
                      ? `${styles.active} ${styles.lgOnly} ${styles.div}`
                      : `${styles.div} ${styles.lgOnly}`
                  }
                >
                  <Link
                    href={"/accueil"}
                    className={
                      path === "/accueil"
                        ? `${styles.link} ${styles.active}  ${styles.mih}`
                        : `${styles.link} ${styles.mih}`
                    }
                    onClick={() => setLoadingBar(65)}
                  >
                    <span>
                      <FaHome size={"1.25rem"} />
                    </span>
                    <label>Accueil</label>
                  </Link>
                </div>

                {userType === "client" ? (
                  <>
                    <div
                      className={
                        path === "/nouveau-projet"
                          ? `${styles.active} ${styles.div} ${styles.lgOnly}`
                          : `${styles.div} ${styles.lgOnly}`
                      }
                    >
                      <Link
                        onClick={() => {
                          setLoadingBar(65);
                          handleHome();
                        }}
                        href={"/nouveau-projet"}
                        className={
                          path === "/nouveau-projet"
                            ? `${styles.link} ${styles.active} ${styles.projet} ${styles.mi}`
                            : `${styles.link} ${styles.mi} ${styles.projet}`
                        }
                      >
                        <span>
                          <AiFillPlusCircle size={"1.25rem"} />
                        </span>
                        <label>Nouveau projet</label>
                      </Link>
                    </div>
                    <div
                      className={
                        path === "/mes-projets"
                          ? `${styles.active} ${styles.div} ${styles.lgOnly}`
                          : `${styles.div} ${styles.lgOnly}`
                      }
                      onClick={() => {
                        handleHome();
                      }}
                    >
                      <Link
                        href={"/mes-projets"}
                        className={
                          path === "/mes-projets"
                            ? `${styles.link} ${styles.active}  ${styles.mi}`
                            : `${styles.link} ${styles.mi}`
                        }
                      >
                        <span>
                          <TbBulb size={"1.5rem"} />{" "}
                        </span>

                        <label>Mes projets</label>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div
                    className={
                      path === "/mes-avis"
                        ? `${styles.active} ${styles.div} ${styles.lgOnly}`
                        : `${styles.div} ${styles.lgOnly}`
                    }
                    onClick={() => {
                      handleHome();
                    }}
                  >
                    <Link
                      // onClick={() => setLoadingBar(65)}
                      href={"/mes-avis"}
                      className={
                        path === "/mes-avis"
                          ? `${styles.link} ${styles.active}  ${styles.mi}`
                          : `${styles.link} ${styles.mi}`
                      }
                    >
                      <span>
                        <GoBellFill size={"1.35rem"} />{" "}
                      </span>

                      <label>Mes avis</label>
                    </Link>
                  </div>
                )}
                {/* info hub */}
                <div
                  onClick={() => {
                    dispatch(
                      updateClientAvisInfos({
                        userInfos: user,
                      })
                    );
                  }}
                  className={
                    path === "/info-hub"
                      ? `${styles.active} ${styles.div} ${styles.lgOnly}`
                      : `${styles.div} ${styles.lgOnly}`
                  }
                >
                  <Link
                    // onClick={() => setLoadingBar(65)}
                    href={"/info-hub"}
                    className={
                      path === "/info-hub"
                        ? `${styles.link} ${styles.active} ${styles.mi}`
                        : `${styles.link} ${styles.mi}`
                    }
                  >
                    <span>
                      <IoNewspaperOutline size="1.4rem" />
                    </span>
                    <label>
                      Info
                      <span className={styles.linkStyle}>hub</span>
                    </label>
                  </Link>
                </div>

                {/* md only */}

                {/* nous joindre */}
                <div
                  className={
                    path === "/nous-joindre"
                      ? `${styles.active} ${styles.mdOnly} ${styles.div}`
                      : `${styles.div} ${styles.mdOnly}`
                  }
                >
                  <Link
                    href={"/nous-joindre"}
                    className={
                      path === "/nous-joindre"
                        ? `${styles.link} ${styles.active}  ${styles.mih}`
                        : `${styles.link} ${styles.mih}`
                    }
                    onClick={() => setLoadingBar(65)}
                  >
                    <span>
                      <MdPhoneInTalk size={"1.25rem"} />
                    </span>
                    <label>Nous joindre</label>
                  </Link>
                </div>

                {/* a propos */}
                <div
                  className={
                    path === "/a-propos"
                      ? `${styles.active} ${styles.mdOnly} ${styles.div}`
                      : `${styles.div} ${styles.mdOnly}`
                  }
                >
                  <Link
                    href={"/a-propos"}
                    className={
                      path === "/a-propos"
                        ? `${styles.link} ${styles.active}  ${styles.mih}`
                        : `${styles.link} ${styles.mih}`
                    }
                    onClick={() => setLoadingBar(65)}
                  >
                    <span>
                      <IoMdInformationCircle size={"1.25rem"} />
                    </span>
                    <label>A propos</label>
                  </Link>
                </div>

                {/* politiques */}
                <div
                  className={
                    path === "/politiques"
                      ? `${styles.active} ${styles.mdOnly} ${styles.div}`
                      : `${styles.div} ${styles.mdOnly}`
                  }
                >
                  <Link
                    href={"/politiques"}
                    className={
                      path === "/politiques"
                        ? `${styles.link} ${styles.active}  ${styles.mih}`
                        : `${styles.link} ${styles.mih}`
                    }
                    onClick={() => setLoadingBar(65)}
                  >
                    <span>
                      <ImBooks size={"1.25rem"} />
                    </span>
                    <label>Politiques</label>
                  </Link>
                </div>

                {/* copyright */}
                <div
                  className={
                    path === "/copyright"
                      ? `${styles.active} ${styles.mdOnly} ${styles.div}`
                      : `${styles.div} ${styles.mdOnly}`
                  }
                >
                  <Link
                    href={"/copyright"}
                    className={
                      path === "/copyright"
                        ? `${styles.link} ${styles.active}  ${styles.mih}`
                        : `${styles.link} ${styles.mih}`
                    }
                    onClick={() => setLoadingBar(65)}
                  >
                    <span>
                      <FaCopyright size={"1.25rem"} />
                    </span>
                    <label>Copyright</label>
                  </Link>
                </div>

                {/* settings */}
                <div
                  className={
                    path === "/parametres"
                      ? `${styles.active} ${styles.div}`
                      : `${styles.div}`
                  }
                >
                  <Link
                    // onClick={() => setLoadingBar(65)}
                    href={"/parametres"}
                    className={
                      path === "/parametres"
                        ? `${styles.link} ${styles.active}  ${styles.mi}`
                        : `${styles.link} ${styles.mi}`
                    }
                  >
                    <span>
                      <IoMdSettings size={"1.35rem"} />{" "}
                    </span>
                    <label>Paramètres</label>
                  </Link>
                </div>
              </div>
              {/* logout */}
              <div className={styles.right}>
                <div className={styles.div}>
                  <button
                    onClick={handleLogout}
                    className={`${styles.link} ${styles.mil}`}
                  >
                    <span>
                      <HiOutlineLogout size={"1.45rem"} />
                    </span>
                    <label>Se déconnecter</label>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.md}>
            {isActiveMenu ? (
              <button
                onClick={() => setIsActiveMenu(false)}
                className={`${styles.link} ${styles.bg}`}
              >
                <i>
                  <CgClose size={"2rem"} />
                </i>
              </button>
            ) : (
              <button
                onClick={() => setIsActiveMenu(true)}
                className={`${styles.link} ${styles.nbg}`}
              >
                <i>
                  <CgMenuRightAlt size={"2rem"} />
                </i>
              </button>
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
