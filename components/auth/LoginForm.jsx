/** @format */

"use client";
import { UidContext } from "@/context/UidContext";
import useLogout from "@/lib/hooks/useLogout";
import {
  loginController,
  logoutController,
} from "@/lib/controllers/auth.controller";
import { updatePersistInfos } from "@/redux/slices/persistSlice";
import { fetchUserInfos } from "@/redux/slices/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/auth/LoginForm.module.css";
import ClientOnly from "../ClientOnly";
import Spinner from "../Spinner";
import { isEmpty } from "@/lib/utils/isEmpty";
export default function LoginForm(req) {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const persistInfos = useSelector((state) => state.persistInfos);
  const isLogout = useLogout();
  const [spinner, setSpinner] = useState(false);
  const [userType, setUserType] = useState(persistInfos.userType);
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loadLink, setLoadLink] = useState(false);

  const { verifyJWT, setVerifyJWT } = useContext(UidContext);

  useEffect(() => {
    if (isLogout.isActive) {
      isLogout.onDisable();
    }
    if (verifyJWT) {
      setVerifyJWT(false);
    }
  }, []);
  const handleUserType = (e) => {
    e.preventDefault();
    setUserType(userType === "client" ? "assistant" : "client");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isEmpty(persistInfos.authToken)) {
      await logoutController(persistInfos.authToken).catch((err) =>
        console.log(err.message)
      );
      dispatch(updatePersistInfos({ authToken: null }));
    }

    const res = await loginController({
      email: userEmail,
      password: userPassword,
      userType,
      remember,
    });

    setSpinner(true);
    setIsLoading(false);

    if (res?.error) {
      push(`/fail?t=${res.error}`);
    } else {
      dispatch(fetchUserInfos({ user: res.user }));
      dispatch(updatePersistInfos({ authToken: res.token, userType }));

      window.location = "/accueil";
    }
  };
  if (spinner) return <Spinner />;
  return (
    <ClientOnly>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.title}>
              {userType === "client" ? (
                <label>Connexion client</label>
              ) : (
                <label>Connexion assistant</label>
              )}
            </div>
            <div
              className={
                isLoading || loadLink
                  ? `${styles.formMiddle} pen`
                  : `${styles.formMiddle}`
              }
            >
              <div className={styles.inputs}>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setUserEmail(e.target.value)}
                    value={userEmail}
                    placeholder={`Adresse e-mail`}
                    autoFocus={true}
                    required
                  />
                </div>
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={`Mot de passe`}
                    onChange={(e) => setUserPassword(e.target.value)}
                    value={userPassword}
                    required
                  />
                  <button>
                    {showPassword ? (
                      <IoMdEye
                        size={"1.25rem"}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(false);
                        }}
                        className="try1"
                      />
                    ) : (
                      <IoMdEyeOff
                        size={"1.25rem"}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(true);
                        }}
                        className="try1"
                      />
                    )}
                  </button>
                </div>
              </div>
              <div className={styles.rmb}>
                <label htmlFor="remember" className={styles.remember}>
                  <input
                    type="checkbox"
                    checked={remember}
                    id="remember"
                    onChange={() => setRemember(!remember)}
                  />
                  <span>Se souvenir de moi</span>
                </label>
              </div>
              <div className={styles.btn}>
                <div
                  className={
                    isLoading
                      ? `${styles.submit} ${styles.submitLoading}`
                      : `${styles.submit}`
                  }
                >
                  <button type="submit">
                    <span>Se connecter</span>
                  </button>
                </div>
                <div className={styles.switch}>
                  <button onClick={handleUserType}>
                    Se connecter en tant
                    {userType === "client" ? (
                      <> qu{"'"}assistant</>
                    ) : (
                      <> que client</>
                    )}
                  </button>
                </div>
              </div>
              <div className={styles.forgot}>
                <Link href={"/reset"} className={styles.link}>
                  <span>Mot de passe oublié</span> <span>?</span>
                </Link>
              </div>
              <div className={styles.hr} />
              <div className={styles.notRegistered}>
                <label>Vous n{"'"}avez pas de compte ?</label>
              </div>
              <Link
                onClick={() => setLoadLink(true)}
                href={"/register"}
                className={
                  loadLink
                    ? `${styles.register} ${styles.loadLink}`
                    : `${styles.register}`
                }
              >
                <span>S{"'"}inscrire</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ClientOnly>
  );
}
