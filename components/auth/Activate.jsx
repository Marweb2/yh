/** @format */

"use client";
import { verifyJWTController } from "@/lib/controllers/jwt.controller";
import { sendMailActivateUserCompteController } from "@/lib/controllers/reset.controller";
import { isEmpty } from "@/lib/utils/isEmpty";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { FaCircleArrowLeft } from "react-icons/fa6";
import styles from "../../styles/auth/Activate.module.css";
import ClientOnly from "../ClientOnly";
import Spinner from "../Spinner";

export default function ActivateUserCompte() {
  const token = useSearchParams().get("t");
  const { push } = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadLink, setLoadLink] = useState(false);
  const [newUser, setNewUser] = useState({ email: "" });
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState({
    invalidEmailError: false,
    userNotFound: false,
    expiredTokenError: false,
    notAnymoreValidToken: false,

    // success
    emailSent: false,
    fail: false,
  });

  useEffect(() => {
    (async () => {
      if (!isEmpty(token)) {
        setSpinner(true);

        const res = await verifyJWTController(token);

        setSpinner(false);
        if (!isEmpty(res?.infos)) {
          setInitialData(res.infos);
          setNewUser(res.infos);
          if (res.infos?.invalidEmailError) {
            setError((prev) => {
              let nwe = { ...prev };
              for (const key in nwe) {
                nwe[key] = false;
              }
              nwe.invalidEmailError = true;
              nwe.fail = true;
              return nwe;
            });
          } else if (res.infos?.userNotFound) {
            setError((prev) => {
              let nwe = { ...prev };
              for (const key in nwe) {
                nwe[key] = false;
              }
              nwe.userNotFound = true;
              nwe.fail = true;

              return nwe;
            });
          } else if (res.infos?.emailSent) {
            setError((prev) => {
              let nwe = { ...prev };
              for (const key in nwe) {
                nwe[key] = false;
              }
              nwe.emailSent = true;

              return nwe;
            });
          }
        } else if (res?.notAnymoreValidToken) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.notAnymoreValidToken = true;
            nwe.fail = true;

            return nwe;
          });
        } else if (res?.expiredTokenError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.expiredTokenError = true;
            nwe.fail = true;

            return nwe;
          });
        } else {
          push("/login");
        }
      }
    })();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (error.fail) {
      setIsLoading(true);

      const res = await sendMailActivateUserCompteController(newUser.email);

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
    }
  };
  if (isEmpty(token)) {
    push("/login");
  } else if (spinner) return <Spinner />;

  return (
    <ClientOnly spin>
      <div
        className={
          isLoading || loadLink
            ? `${styles.container} pen`
            : `${styles.container}`
        }
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.switchBtn}>
            <Link
              href={"/login"}
              onClick={() =>
                setError((prev) => {
                  let nwe = { ...prev };
                  for (const key in nwe) {
                    nwe[key] = false;
                  }
                  return nwe;
                })
              }
            >
              <div className={styles.switchIcon}>
                <FaCircleArrowLeft size={"2rem"} />
              </div>
            </Link>
          </div>
          <div className={styles.contenu}>
            {/* sending email */}
            {error.invalidEmailError && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, L{"'"}activation de votre compte a échoué pour la
                    raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="email">
                    L{"'"}adresse e-mail :{" "}
                    <span className={styles.mail}>{initialData.email}</span> que
                    vous avez entré est invalide.{" "}
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    type="text"
                    id="email"
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />
                  <button
                    disabled={isLoading || loadLink}
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
              </>
            )}
            {error.userNotFound && (
              <>
                <div className={styles.title}>
                  <h1>
                    Désolé, L{"'"}activation de votre compte a échoué pour la
                    raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="mail">
                    L{"'"}adresse e-mail :{" "}
                    <span className={styles.mail}>{initialData.email}</span> que
                    vous avez entré n{"'"}est pas encore enregistré.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    type="text"
                    id="email"
                    value={newUser.email}
                    required
                    placeholder={`Adresse e-mail`}
                  />
                  <button
                    disabled={isLoading || loadLink}
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
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
            {/* email sent */}
            {error.emailSent && (
              <>
                <div className={styles.title}>
                  <label htmlFor="email">
                    La demande d{"'"}activation de votre compte est réussie.
                  </label>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="email">
                    Veuillez consulter votre e-mail.{" "}
                  </label>
                </div>
              </>
            )}

            {/* reset password */}
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
            {error.notAnymoreValidToken && (
              <>
                <div className={styles.rais}>
                  <label>La session n{"'"}est plus valide.</label>
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
