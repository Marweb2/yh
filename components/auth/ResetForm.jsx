/** @format */

"use client";
import { verifyJWTController } from "@/lib/controllers/jwt.controller";
import { resetPasswordController } from "@/lib/controllers/reset.controller";
import { isEmpty } from "@/lib/utils/isEmpty";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { FaCircleArrowLeft } from "react-icons/fa6";
import styles from "../../styles/auth/ResetForm.module.css";
import ClientOnly from "../ClientOnly";
import Spinner from "../Spinner";

export default function ResetPassword({ token }) {
  const { push } = useRouter();
  const cPass = useRef();
  const [spinner, setSpinner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadLink, setLoadLink] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [error, setError] = useState({
    expiredTokenError: false,
    notAnymoreValidToken: false,
    minPasswordRegisterError: false,
    // success
    resetPassword: false,
  });
  useEffect(() => {
    (async () => {
      if (!isEmpty(token)) {
        setSpinner(true);
        const res = await verifyJWTController(token);
        setSpinner(false);
        if (res?.secure) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            return nwe;
          });
          setNewUser(() => {
            let nwe = { ...res };
            nwe.newPassword = "";
            nwe.newCPassword = "";
            return nwe;
          });
        } else if (res?.notAnymoreValidToken) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.notAnymoreValidToken = true;
            return nwe;
          });
        } else if (res?.expiredTokenError) {
          setError((prev) => {
            let nwe = { ...prev };
            for (const key in nwe) {
              nwe[key] = false;
            }
            nwe.expiredTokenError = true;
            return nwe;
          });
        } else {
          push("/reset");
        }
      }
    })();
  }, [token]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !isEmpty(newUser.newPassword) &&
      newUser.newPassword === newUser.newCPassword
    ) {
      setIsLoading(true);
      const res = await resetPasswordController({
        id: newUser.id,
        token: newUser.token,
        password: newUser.newPassword,
      }).catch((error) => console.log(error));
      setIsLoading(false);
      setSpinner(true);
      if (res?.token) {
        push(`/reset?t=${res.token}`);
      } else if (res?.minPasswordRegisterError) {
        setSpinner(false);
        setError((prev) => {
          let nwe = { ...prev };
          for (const key in nwe) {
            nwe[key] = false;
          }
          nwe.minPasswordRegisterError = true;
          return nwe;
        });
      } else {
        push("/reset");
      }
    } else if (newUser.newPassword !== newUser.newCPassword) {
      cPass.current.setCustomValidity(
        "Les mots de passes ne correspondent pas."
      );
      cPass.current.reportValidity();
    }
  };
  if (isEmpty(token)) {
    push("/reset");
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
            <Link href={"/reset"}>
              <div className={styles.switchIcon}>
                <FaCircleArrowLeft size={"2rem"} />
              </div>
            </Link>
          </div>
          <div className={styles.contenu}>
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
            {/* can reset */}
            {!isEmpty(newUser) &&
              newUser?.secure &&
              !error.minPasswordRegisterError && (
                <>
                  <div className={styles.title}>
                    <label htmlFor="password">
                      Entrer le nouveau mot de passe.
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <input
                      type="password"
                      id="password"
                      onChange={(e) =>
                        setNewUser((prev) => {
                          let nwe = { ...prev };
                          nwe.newPassword = e.target.value;
                          return nwe;
                        })
                      }
                      value={newUser.newPassword}
                      required
                      placeholder={`Nouveau mot de passe`}
                    />
                    <input
                      ref={cPass}
                      type="password"
                      id="password"
                      onChange={(e) => {
                        cPass.current.setCustomValidity("");
                        setNewUser((prev) => {
                          let nwe = { ...prev };
                          nwe.newCPassword = e.target.value;
                          return nwe;
                        });
                      }}
                      value={newUser.newCPassword}
                      required
                      placeholder={`Confirmer nouveau mot de passe`}
                    />
                  </div>

                  <div className={isEmpty(newUser?.newPassword) ? "pen" : null}>
                    <button
                      className={
                        isLoading
                          ? `${styles.submit} ${styles.submitLoading}`
                          : `${styles.submit}`
                      }
                      disabled={isLoading || isEmpty(newUser?.newPassword)}
                      type="submit"
                    >
                      Valider
                    </button>
                  </div>
                </>
              )}
            {error.minPasswordRegisterError && (
              <>
                <div className={styles.title}>
                  <h1 htmlFor="password">
                    Désolé, Le changement du mot de passe a échoué pour la
                    raison suivante :
                  </h1>
                </div>
                <div className={styles.rais}>
                  <label htmlFor="password">
                    Le mot de passe doit faire au moins 6 caractères.
                  </label>
                </div>
                <div className={styles.inputs}>
                  <input
                    type="password"
                    id="password"
                    onChange={(e) =>
                      setNewUser((prev) => {
                        let nwe = { ...prev };
                        nwe.newPassword = e.target.value;
                        return nwe;
                      })
                    }
                    value={newUser.newPassword}
                    required
                    placeholder={`Nouveau mot de passe`}
                  />
                  <input
                    ref={cPass}
                    type="password"
                    id="password"
                    onChange={(e) => {
                      cPass.current.setCustomValidity("");
                      setNewUser((prev) => {
                        let nwe = { ...prev };
                        nwe.newCPassword = e.target.value;
                        return nwe;
                      });
                    }}
                    value={newUser.newCPassword}
                    required
                    placeholder={`Confirmer nouveau mot de passe`}
                  />
                </div>

                <div className={isEmpty(newUser?.newPassword) ? "pen" : null}>
                  <button
                    className={
                      isLoading
                        ? `${styles.submit} ${styles.submitLoading}`
                        : `${styles.submit}`
                    }
                    disabled={isLoading || isEmpty(newUser?.newPassword)}
                    type="submit"
                  >
                    Valider
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </ClientOnly>
  );
}
