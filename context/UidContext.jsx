/** @format */

"use client";
import { verifyJWTController } from "@/lib/controllers/jwt.controller";
import { isEmpty } from "@/lib/utils/isEmpty";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  createContext,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUserInfos, fetchUserInfos } from "@/redux/slices/userSlice";
import { updatePersistInfos } from "@/redux/slices/persistSlice";
import { fetchUserInfosController } from "@/lib/controllers/user.controller";
import { logoutController } from "@/lib/controllers/auth.controller";
import useConfetti from "@/lib/hooks/useConfetti";
import { clientOnlyPaths, protecedPaths } from "@/lib/utils/paths";
import usePopup from "@/lib/hooks/usePopup";
import TopLoadingBar from "@/components/TopLoadingBar";

export const UidContext = createContext();

export const UidContextProvider = ({ children }) => {
  const path = usePathname();
  const activeToken = useSearchParams().get("t");
  const { authToken, userType, lang } = useSelector(
    (state) => state.persistInfos
  );
  const { push } = useRouter();
  const dispatch = useDispatch();
  const confetti = useConfetti();
  const popup = usePopup();

  const [widthProgressBar, setWidthProgressBar] = useState(0);

  const [userId, setUserId] = useState(null);
  const [isInfos, setIsInfos] = useState(false);
  const [render, setRender] = useState(0);
  const [verifyJWT, setVerifyJWT] = useState(false);
  const [infosStatus, setInfosStatus] = useState();
  const [isActive, setIsActive] = useState({ obj: "infos" });

  const [isLoadingJWT, setIsLoadingJWT] = useState(false);
  const [isVerifyAuthJWT, setIsVerifyAuthJWT] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [infosToUpdate, setInfosToUpdate] = useState({});
  const [isFetch, setIsFetch] = useState(false);
  const [id, setId] = useState(null);
  const [refetchDataCount, setRefetchDataCount] = useState(0);
  const [infoProjectAssistant, setInfoProjectAssistant] = useState({});
  const first = useRef(true);

  useEffect(() => {
    if (!first.current) true;
    if (confetti.isActive) {
      confetti.onDisable();
    }
    if (
      (path === "/accueil" ||
        path === "/nouveau-projet" ||
        path === "/mes-projets" ||
        path === "/info-hub" ||
        path === "/parametres" ||
        path === "/mes-avis") &&
      !isEmpty(activeToken)
    ) {
      (async () => {
        await verifyJWTController(activeToken).then((res) => {
          setVerifyJWT(true);
          if (res?.active) {
            confetti.onActive();
            popup.onActive();
            dispatch(fetchUserInfos({ user: res.user }));
            dispatch(
              updatePersistInfos({
                authToken: res.token,
                userType: res.userType,
                lang: res.lang,
              })
            );
            push("/accueil");
          } else {
            setIsVerifyAuthJWT(true);
          }
        });
      })();
    } else if (
      protecedPaths.includes(path) ||
      ((path === "/accueil" ||
        path === "/nouveau-projet" ||
        path === "/mes-projets" ||
        path === "/info-hub" ||
        path === "/parametres" ||
        path === "/mes-avis") &&
        isEmpty(activeToken))
    ) {
      if (isEmpty(authToken)) {
      } else {
        setIsLoadingJWT(true);
        setIsVerifyAuthJWT(true);
      }
    }
    first.current = false;
  }, []);

  useEffect(() => {
    if (isVerifyAuthJWT) {
      (async () =>
        await verifyJWTController(authToken).then((res) => {
          if (isEmpty(res?.infos)) {
            setIsLogout(true);
          } else {
            if (userType !== res.infos?.userType) {
              setInfosToUpdate((prev) => ({
                ...prev,
                userType: res.infos.userType,
              }));
            }
            if (lang !== res.infos?.lang) {
              setInfosToUpdate((prev) => ({
                ...prev,
                lang: res.infos.lang,
              }));
            }
            setIsFetch(true);
            setId(res.infos?.id);
          }
        }))();
    }
  }, [isVerifyAuthJWT]);

  useEffect(() => {
    if (isLogout) {
      (async () =>
        await logoutController(authToken)
          .then(() => {
            dispatch(updatePersistInfos({ authToken: null }));
            dispatch(removeUserInfos());
            setIsLoadingJWT(false);
          })
          .then(() => push("/login")))();
    }
  }, [isLogout]);

  useEffect(() => {
    if (isFetch) {
      (async () =>
        await fetchUserInfosController(id).then((res) => {
          if (isEmpty(res?.user)) {
            setIsLogout(true);
          } else {
            setUserId(res.user._id);
            dispatch(updatePersistInfos(infosToUpdate));
            dispatch(fetchUserInfos({ user: res.user }));
            setIsLoadingJWT(false);
            if (!protecedPaths.includes(path)) {
              push("/accueil");
            }
          }
        }))();
    }
  }, [isFetch]);

  useEffect(() => {
    let timeoutId;
    if (popup.isActive) {
      timeoutId = setTimeout(() => {
        popup.onDisable();
      }, 6000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [popup]);

  useLayoutEffect(() => {
    if (userType !== "client" && clientOnlyPaths.includes(path)) {
      redirect("/accueil");
    }
  }, [userType, push, path]);

  const setLoadingBar = (value) => {
    if (!isNaN(value)) {
      const numericValue = Number(value);
      if (Number.isInteger(numericValue)) {
        setWidthProgressBar(numericValue);
      }
    }
  };

  if (typeof window !== "undefined")
    return (
      <UidContext.Provider
        value={{
          userId,
          isLoadingJWT,
          setLoadingBar,
          verifyJWT,
          setVerifyJWT,
          refetchDataCount,
          setRefetchDataCount,
          setIsInfos,
          isInfos,
          setRender,
          render,
          setInfosStatus,
          infosStatus,
          setIsActive,
          isActive,
          setInfoProjectAssistant,
          infoProjectAssistant,
          widthProgressBar,
        }}
      >
        <>
          <TopLoadingBar
            width={widthProgressBar}
            visible={widthProgressBar > 0}
          />
          {children}
        </>
      </UidContext.Provider>
    );
};
