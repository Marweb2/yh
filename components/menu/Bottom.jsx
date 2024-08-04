/** @format */

"use client";

// styles
import styles from "../../styles/menu/Bottom.module.css";

// react
import Link from "next/link";

// icons
import { MdPhoneInTalk } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { ImBooks } from "react-icons/im";
import { FaCopyright, FaHome } from "react-icons/fa";

// hooks
import useLogout from "@/lib/hooks/useLogout";

// redux
import { useSelector, useDispatch } from "react-redux";
import { updateClientAvisInfos } from "@/redux/slices/clientAvisPotentielSlice";

// components
import ClientOnly from "../ClientOnly";
import { GoBellFill } from "react-icons/go";
import { TbBulb } from "react-icons/tb";
import { AiFillPlusCircle } from "react-icons/ai";
import { useContext } from "react";
import { UidContext } from "@/context/UidContext";
import { IoNewspaperOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";

export default function Bottom({ isInfos, setIsInfos }) {
  const { userType } = useSelector((state) => state.persistInfos);
  const { setLoadingBar } = useContext(UidContext);
  const isLogout = useLogout();
  const path = usePathname();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleHome = () => {
    if (isInfos) {
      setIsInfos(false);
      dispatch(
        updateClientAvisInfos({
          userInfos: user,
        })
      );
    }
  };

  return (
    <ClientOnly>
      <div
        className={
          isLogout.isActive ? `${styles.container} pen` : `${styles.container}`
        }
      >
        <div className={styles.left} />

        {/* lg only */}
        <div className={`${styles.div} ${styles.lgOnly}`}>
          <div
            href={"/nous-joindre"}
            className={
              path === "/nous-joindre"
                ? `${styles.link} ${styles.active}`
                : `${styles.link}`
            }
          >
            <span className={styles.cnt}>
              <MdPhoneInTalk size={"1.2rem"} className={styles.call} />
            </span>
            <label>Nous joindre</label>
          </div>
          <div
            href={"/a-propos"}
            className={
              path === "/a-propos"
                ? `${styles.link} ${styles.active}`
                : `${styles.link}`
            }
          >
            <span>
              <IoMdInformationCircle size={"1.75rem"} />
            </span>
            <label>A propos</label>
          </div>
          <div
            href={"/politiques"}
            className={
              path === "/politiques"
                ? `${styles.link} ${styles.active}`
                : `${styles.link}`
            }
          >
            <span>
              <ImBooks size={"1.65rem"} />
            </span>
            <label>Politiques</label>
          </div>
          <div
            href={"/copyright"}
            className={
              path === "/copyright"
                ? `${styles.link} ${styles.active}`
                : `${styles.link}`
            }
          >
            <span>
              <FaCopyright size={"1.5rem"} />
            </span>
            <label>Copyright</label>
          </div>
        </div>

        {/* md only */}
        <div onClick={handleHome} className={`${styles.div} ${styles.mdOnly}`}>
          <Link
            href={"/accueil"}
            className={
              path === "/accueil"
                ? `${styles.link} ${styles.active}`
                : `${styles.link}`
            }
          >
            <span>
              <FaHome size={"1.35rem"} className={styles.call} />
            </span>
            <label>Acceuil</label>
          </Link>

          {userType === "client" ? (
            <>
              {/* nouveau projet */}
              <Link
                onClick={() => setLoadingBar(48)}
                href={"/nouveau-projet"}
                className={
                  path === "/nouveau-projet"
                    ? `${styles.link} ${styles.active} ${styles.projet}`
                    : `${styles.link} ${styles.projet}`
                }
              >
                <span>
                  <AiFillPlusCircle size={"1.35rem"} className={styles.call} />
                </span>
                <label>Nouveau projet</label>
              </Link>

              {/* mes projets */}
              <Link
                onClick={() => setLoadingBar(55)}
                href={"/mes-projets"}
                className={
                  path === "/mes-projets"
                    ? `${styles.link} ${styles.active}`
                    : `${styles.link}`
                }
              >
                <span>
                  <TbBulb size={"1.5rem"} className={styles.call} />
                </span>
                <label>Mes projets</label>
              </Link>
            </>
          ) : (
            <>
              {/* mes avis */}
              <Link
                onClick={() => setLoadingBar(55)}
                href={"/mes-avis"}
                className={
                  path === "/mes-avis"
                    ? `${styles.link} ${styles.active}`
                    : `${styles.link}`
                }
              >
                <span>
                  <GoBellFill size={"1.35rem"} className={styles.call} />
                </span>
                <label>Mes avis</label>
              </Link>
            </>
          )}
          {/* infos hub */}
          <Link
            onClick={() => setLoadingBar(55)}
            href={"/info-hub"}
            className={
              path === "/info-hub"
                ? `${styles.link} ${styles.active}`
                : `${styles.link}`
            }
          >
            <span>
              <IoNewspaperOutline size={"1.5rem"} className={styles.call} />
            </span>
            <label>Info hub</label>
          </Link>
        </div>
        <div className={styles.right} />
      </div>
    </ClientOnly>
  );
}
