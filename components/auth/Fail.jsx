/** @format */

"use client";

// controllers
import {
  loginController,
  registerController,
} from "@/lib/controllers/auth.controller";
import { sendMailActivateUserCompteController } from "@/lib/controllers/reset.controller";
import { verifyJWTController } from "@/lib/controllers/jwt.controller";

import { isEmpty } from "@/lib/utils/isEmpty";
import { updatePersistInfos } from "@/redux/slices/persistSlice";
import { updateUserInfos } from "@/redux/slices/userSlice";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import styles from "../../styles/auth/Fail.module.css";
import ClientOnly from "../ClientOnly";
import Spinner from "../Spinner";
export default function Fail() {
  const token = useSearchParams().get("t");
  const { push } = useRouter();
  const dispatch = useDispatch();
  const cPass = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loadLink, setLoadLink] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    // register errors
    minNameRegisterError: false,
    maxNameRegisterError: false,

    minUsernameRegisterError: false,
    maxUsernameRegisterError: false,

    invalidRegisterEmailError: false,
    alreadyExistRegisterEmailError: false,

    minPasswordRegisterError: false,

    // login errors
    invalidLoginEmailError: false,
    invalidLoginPasswordError: false,
    invalidLoginUserTypeError: false,
    notActive: false,

    // options
    expiredTokenError: false,
    login: false,
    register: false,
  });
  const [newUser, setNewUser] = useState({});
  useEffect(() => {
    (async () => {
      setSpinner(true);
      const res = await verifyJWTController(token);
      setSpinner(false);
      if (!isEmpty(res?.infos) && (res?.infos?.register || res?.infos?.login)) {
        setInitialData({ password: "", cPassword: "", ...res.infos });
        setNewUser({ valid: false, password: "", cPassword: "", ...res.infos });
        if (res.infos?.minNameRegisterError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.register = true;
            nwe.minNameRegisterError = true;
            return nwe;
          });
        } else if (res.infos?.maxNameRegisterError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.register = true;
            nwe.maxNameRegisterError = true;
            return nwe;
          });
        } else if (res.infos?.minUsernameRegisterError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.register = true;
            nwe.minUsernameRegisterError = true;
            return nwe;
          });
        } else if (res.infos?.maxUsernameRegisterError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.register = true;
            nwe.maxUsernameRegisterError = true;
            return nwe;
          });
        } else if (res.infos?.invalidRegisterEmailError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.register = true;
            nwe.invalidRegisterEmailError = true;
            return nwe;
          });
        } else if (res.infos?.alreadyExistRegisterEmailError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.register = true;
            nwe.alreadyExistRegisterEmailError = true;
            return nwe;
          });
        } else if (res.infos?.minPasswordRegisterError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.valid = false;
            nwe.register = true;
            nwe.minPasswordRegisterError = true;
            return nwe;
          });
        } else if (res.infos?.invalidLoginEmailError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.login = true;
            nwe.invalidLoginEmailError = true;
            return nwe;
          });
        } else if (res.infos?.invalidLoginPasswordError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.login = true;
            nwe.invalidLoginPasswordError = true;
            return nwe;
          });
        } else if (res.infos?.invalidLoginUserTypeError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.login = true;
            nwe.invalidLoginUserTypeError = true;
            return nwe;
          });
        } else if (res.infos?.notActive) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.login = true;
            nwe.notActive = true;
            return nwe;
          });
          setNewUser({
            valid: true,
            password: "",
            cPassword: "",
            ...res.infos,
          });
        }
      } else if (res?.invalidTokenSession) {
        setError((prev) => {
          let nwe = { ...prev };
          for (const key in nwe) {
            nwe[key] = false;
          }
          nwe.login = true;
          nwe.expiredTokenError = true;
          return nwe;
        });
      } else {
        push("/login");
      }
    })();
  }, [token]);
  useEffect(() => {
    if (newUser?.name?.trim() !== initialData?.name && !newUser.valid) {
      setNewUser((prev) => ({ ...prev, valid: true }));
    }
    if (newUser?.username?.trim() !== initialData?.username && !newUser.valid) {
      setNewUser((prev) => ({ ...prev, valid: true }));
    }
    if (newUser?.email?.trim() !== initialData?.email && !newUser.valid) {
      setNewUser((prev) => ({ ...prev, valid: true }));
    }
    if (newUser?.password !== initialData?.password && !newUser.valid) {
      setNewUser((prev) => ({ ...prev, valid: true }));
    }
    if (newUser?.userType !== initialData?.userType && !newUser.valid) {
      setNewUser((prev) => ({ ...prev, valid: true }));
    }
    if (
      newUser?.minPasswordRegisterError &&
      newUser?.cPassword !== initialData?.password &&
      !newUser.valid
    ) {
      setNewUser((prev) => ({ ...prev, valid: true }));
    }
  }, [newUser]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUser?.valid) {
      return null;
    } else if (error.register && newUser.password !== newUser.cPassword) {
      setNewUser((prev) => ({ ...prev, valid: false }));
      cPass.current.setCustomValidity(
        "Les mots de passes ne correspondent pas."
      );
      cPass.current.reportValidity();
    } else if (error.login && error.notActive) {
      setIsLoading(true);
      const res = await sendMailActivateUserCompteController(
        newUser.email
      ).catch((error) => console.log(error));
      setSpinner(true);
      setIsLoading(false);
      if (res?.error) {
        push(`/fail?t=${res.error}`);
      } else if (res?.token) {
        push(`/activate?t=${res.token}`);
      } else {
        setSpinner(false);
        window.location = "/accueil";
      }
    } else if (error.login && !error.notActive) {
      setIsLoading(true);
      const res = await loginController({
        email: newUser.email,
        password: newUser.password,
        userType: newUser.userType,
        remember: newUser.remember,
      }).catch((error) => console.log(error));
      setSpinner(true);
      setIsLoading(false);
      if (res?.error) {
        push(`/fail?t=${res.error}`);
      } else {
        dispatch(updateUserInfos({ user: res.user }));
        dispatch(
          updatePersistInfos({
            authToken: res.token,
            userType: newUser.userType,
          })
        );

        window.location = "/accueil";
      }
    } else if (newUser.password === newUser.cPassword && error.register) {
      setIsLoading(true);
      const res = await registerController({
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        userType: newUser.userType,
      }).catch((error) => console.log(error));
      setSpinner(true);
      setIsLoading(false);
      if (res?.error) {
        push(`/fail?t=${res.error}`);
      } else {
        push(`/success?t=${res.token}`);
      }
    }
  };
  if (isEmpty(token) && typeof window !== "undefined") {
    push("/login");
  } else if (spinner) return <Spinner />;
  return (
    <ClientOnly spin>
      <div className={styles.container}>
        <form
          onSubmit={handleSubmit}
          className={isLoading || loadLink ? `${styles.pen}` : null}
        >
          <div className={styles.switchBtn}>
            <Link
              href={error.login ? "/login" : "/register"}
              className={styles.link}
            >
              <div className={styles.switchIcon}>
                <FaCircleArrowLeft size={"2rem"} />
              </div>
            </Link>
          </div>
          <div className={styles.contenu}>
            {/* register errors */}
            {error.minNameRegisterError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, Votre compte {initialData.userType} n{"'"}a pas été
                    créé pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="name">
                    Le nom doit faire au moins 3 caractères.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="name"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    value={newUser.name}
                    required
                    placeholder={`Nom`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    value={newUser.password}
                    required
                    placeholder={`Mot de passe`}
                  />

                  <input
                    type="password"
                    ref={cPass}
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => ({
                        ...prev,
                        cPassword: e.target.value,
                      }));
                    }}
                    value={newUser.cPassword}
                    required
                    placeholder={`Confirmer mot de passe`}
                  />
                </div>

                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />
                <div className={styles.notRegistered}>
                  <label>Vous avez déjà un compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/login"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>Se connecter</span>
                </Link>
              </>
            )}
            {error.maxNameRegisterError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, Votre compte {initialData.userType} n{"'"}a pas été
                    créé pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="name">
                    Le nom doit pas dépasser les 50 caractères.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="name"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    value={newUser.name}
                    required
                    placeholder={`Nom`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    value={newUser.password}
                    required
                    placeholder={`Mot de passe`}
                  />

                  <input
                    type="password"
                    ref={cPass}
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => ({
                        ...prev,
                        cPassword: e.target.value,
                      }));
                    }}
                    value={newUser.cPassword}
                    required
                    placeholder={`Confirmer mot de passe`}
                  />
                </div>
                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />
                <div className={styles.notRegistered}>
                  <label>Vous avez déjà un compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/login"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>Se connecter</span>
                </Link>
              </>
            )}
            {error.minUsernameRegisterError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, Votre compte {initialData.userType} n{"'"}a pas été
                    créé pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="username">
                    Le prénom doit faire au moins 3 caractères.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="username"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    value={newUser.username}
                    required
                    placeholder={`Prénom`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    value={newUser.password}
                    required
                    placeholder={`Mot de passe`}
                  />

                  <input
                    type="password"
                    ref={cPass}
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => ({
                        ...prev,
                        cPassword: e.target.value,
                      }));
                    }}
                    value={newUser.cPassword}
                    required
                    placeholder={`Confirmer mot de passe`}
                  />
                </div>
                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />
                <div className={styles.notRegistered}>
                  <label>Vous avez déjà un compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/login"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>Se connecter</span>
                </Link>
              </>
            )}
            {error.maxUsernameRegisterError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, Votre compte {initialData.userType} n{"'"}a pas été
                    créé pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="username">
                    Le prénom ne doit pas dépasser les 50 caractères.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="username"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    value={newUser.username}
                    required
                    placeholder={`Prénom`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    value={newUser.password}
                    required
                    placeholder={`Mot de passe`}
                  />

                  <input
                    type="password"
                    ref={cPass}
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => ({
                        ...prev,
                        cPassword: e.target.value,
                      }));
                    }}
                    value={newUser.cPassword}
                    required
                    placeholder={`Confirmer mot de passe`}
                  />
                </div>
                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />
                <div className={styles.notRegistered}>
                  <label>Vous avez déjà un compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/login"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>Se connecter</span>
                </Link>
              </>
            )}
            {error.invalidRegisterEmailError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, Votre compte {initialData.userType} n{"'"}a pas été
                    créé pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="mail">
                    L{"'"}adresse e-mail :{" "}
                    <span className={styles.mail}>{initialData.email}</span> que
                    vous avez entré est invalide.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="mail"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    value={newUser.password}
                    required
                    placeholder={`Mot de passe`}
                  />

                  <input
                    type="password"
                    ref={cPass}
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => ({
                        ...prev,
                        cPassword: e.target.value,
                      }));
                    }}
                    value={newUser.cPassword}
                    required
                    placeholder={`Confirmer mot de passe`}
                  />
                </div>
                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />
                <div className={styles.notRegistered}>
                  <label>Vous avez déjà un compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/login"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>Se connecter</span>
                </Link>
              </>
            )}
            {error.alreadyExistRegisterEmailError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, Votre compte {initialData.userType} n{"'"}a pas été
                    créé pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="mail">
                    L{"'"}adresse e-mail :{" "}
                    <span className={styles.mail}>{initialData.email}</span> est
                    déjà associé à un compte {initialData.userType}.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="mail"
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    value={newUser.password}
                    required
                    placeholder={`Mot de passe`}
                  />

                  <input
                    type="password"
                    ref={cPass}
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => ({
                        ...prev,
                        cPassword: e.target.value,
                      }));
                    }}
                    value={newUser.cPassword}
                    required
                    placeholder={`Confirmer mot de passe`}
                  />
                </div>

                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />
                <div className={styles.notRegistered}>
                  <label>Vous avez déjà un compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/login"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>Se connecter</span>
                </Link>
              </>
            )}
            {error.minPasswordRegisterError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, Votre compte {initialData.userType} n{"'"}a pas été
                    créé pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="password">
                    Le mot de passe doit faire au moins 6 caractères.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    value={newUser.password}
                    required
                    placeholder={`Mot de passe`}
                  />

                  <input
                    type="password"
                    ref={cPass}
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => ({
                        ...prev,
                        cPassword: e.target.value,
                      }));
                    }}
                    value={newUser.cPassword}
                    required
                    placeholder={`Confirmer mot de passe`}
                  />
                </div>
                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />
                <div className={styles.notRegistered}>
                  <label>Vous avez déjà un compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/login"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>Se connecter</span>
                </Link>
              </>
            )}
            {/* login errors */}

            {error.invalidLoginEmailError && (
              <>
                <div className={styles.title}>
                  <h1>
                    La connexion à votre compte {initialData.userType} a échoué
                    pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="mail">
                    L{"'"}adresse e-mail :{" "}
                    <span className={styles.mail}>{initialData.email}</span> que
                    vous avez entrée n{"'"}est pas encore enregistrée ou est
                    incorrecte. Veuillez réessayer.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="mail"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      value={newUser.password}
                      required
                      placeholder={`Mot de passe`}
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
                {!initialData.remember && (
                  <label htmlFor="remember" className={styles.remember}>
                    <input
                      type="checkbox"
                      checked={newUser.remember}
                      id="remember"
                      onChange={() =>
                        setNewUser((prev) => {
                          let nwe = { ...prev };
                          nwe.remember === true
                            ? (nwe.remember = false)
                            : (nwe.remember = true);
                          return nwe;
                        })
                      }
                    />
                    <span>Se souvenir de moi</span>
                  </label>
                )}
                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
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
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>S{"'"}inscrire</span>
                </Link>
              </>
            )}

            {error.invalidLoginPasswordError && (
              <>
                <div className={styles.title}>
                  <h1>
                    La connexion à votre compte {initialData.userType} a échoué
                    pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="password">
                    Le mot de passe que vous avez entré est invalide.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="mail"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      value={newUser.password}
                      required
                      placeholder={`Mot de passe`}
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
                {!initialData.remember && (
                  <label htmlFor="remember" className={styles.remember}>
                    <input
                      type="checkbox"
                      checked={newUser.remember}
                      id="remember"
                      onChange={() =>
                        setNewUser((prev) => {
                          let nwe = { ...prev };
                          nwe.remember === true
                            ? (nwe.remember = false)
                            : (nwe.remember = true);
                          return nwe;
                        })
                      }
                    />
                    <span>Se souvenir de moi</span>
                  </label>
                )}

                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
                <div className={styles.hr} />

                <div className={styles.forgot}>
                  <Link href={"/reset"} className={styles.link}>
                    <span>Mot de passe oublié</span> <span>?</span>
                  </Link>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/register"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>S{"'"}inscrire</span>
                </Link>
              </>
            )}
            {error.invalidLoginUserTypeError && (
              <>
                <div className={styles.title}>
                  <h1>
                    La connexion à votre compte {initialData.userType} a échoué
                    pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="mail">
                    Aucun {initialData.userType} correspond à l{"'"}adresse
                    e-mail{" "}
                    <span className={styles.mail}>{initialData.email}</span>
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="mail"
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      value={newUser.password}
                      required
                      placeholder={`Mot de passe`}
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setNewUser((prev) => {
                        let nwe = { ...prev };
                        nwe.userType === "client"
                          ? (nwe.userType = "assistant")
                          : (nwe.userType = "client");
                        return nwe;
                      });
                    }}
                    className={
                      initialData.userType !== newUser.userType
                        ? `${styles.ubtn} ${styles.active}`
                        : `${styles.ubtn}`
                    }
                  >
                    Se connecter en tant
                    {initialData.userType === "client" ? (
                      <> qu{"'"}assistant</>
                    ) : (
                      <> que client</>
                    )}
                  </button>
                </div>

                <div className={!newUser.valid ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Valider
                  </button>
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
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>S{"'"}inscrire</span>
                </Link>
              </>
            )}
            {error.notActive && (
              <>
                <div className={styles.title}>
                  <h1>
                    La connexion à votre compte {initialData.userType} a échoué
                    pour la raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="mail">
                    Votre compte n{"'"}est pas encore activé.
                    <br />
                    Veuillez consultez votre e-mail ou redemander l{"'"}
                    activation.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="text"
                    id="mail"
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />
                </div>

                <div>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || !newUser.valid}
                    type="submit"
                  >
                    Activer mon compte
                  </button>
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
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>S{"'"}inscrire</span>
                </Link>
              </>
            )}
            {/* expires */}
            {error.expiredTokenError && (
              <>
                <div className={styles.rais}>
                  <label>La session est expirée.</label>
                </div>
                <div className={styles.hr} />
                <Link
                  href={"/login"}
                  className={`${styles.switch} ${styles.login}`}
                >
                  <span>Se connecter</span>
                </Link>
                <div className={styles.notRegistered}>
                  <label>Vous n{"'"}avez pas de compte ?</label>
                </div>
                <Link
                  onClick={() => setLoadLink(true)}
                  href={"/register"}
                  className={
                    loadLink
                      ? `${styles.switch} ${styles.register} ${styles.loadLink}`
                      : `${styles.switch} ${styles.register}`
                  }
                >
                  <span>S{"'"}inscrire</span>
                </Link>
              </>
            )}
          </div>
        </form>
      </div>
    </ClientOnly>
  );
}
