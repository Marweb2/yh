"use client";
import { registerController } from "@/lib/controllers/auth.controller";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useState } from "react";
import styles from "../../styles/auth/RegisterForm.module.css";
import ClientOnly from "../ClientOnly";
import Terms from "./Terms";
import Spinner from "../Spinner";
import Btn from "./Btn";
import Conditions from "./Conditions";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { isEmpty } from "@/lib/utils/isEmpty";
import { useDispatch } from "react-redux";
import { updatePersistInfos } from "@/redux/slices/persistSlice";
export default function RegisterForm() {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const cPassRef = useRef();

  const [loadLink, setLoadLink] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [userType, setUserType] = useState({
    value: "",
    submit: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptConditions, setAcceptconditions] = useState({
    obj: "",
    value: false,
    submit: false,
  });

  const [isHovered, setIsHovered] = useState({ obj: "", value: false });

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [activePopup, setActivePopup] = useState({ obj: null });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAcceptconditions({ ...acceptConditions, submit: true });
    setUserType((prev) => ({ ...prev, submit: true }));

    if (password !== cPassword) {
      cPassRef.current.setCustomValidity(
        "Les mots de passes ne correspondent pas."
      );
      cPassRef.current.reportValidity();
    } else if (
      !isEmpty(userType.value) &&
      acceptConditions.value &&
      password === cPassword
    ) {
      setIsLoading(true);
      const res = await registerController({
        name,
        username,
        email,
        password,
        userType: userType.value,
      }).catch((error) => console.log(error.message));

      setSpinner(true);
      setIsLoading(false);

      if (res?.error) {
        push(`/fail?t=${res.error}`);
      } else if (res?.token) {
        dispatch(updatePersistInfos({ userType: userType.value }));
        push(`/success?t=${res.token}`);
      } else {
        setSpinner(false);
      }
    }
  };
  if (spinner) return <Spinner />;
  return (
    <ClientOnly spin>
      <div
        className={
          isHovered.obj === "assistant" && isHovered.value
            ? `${styles.container}`
            : `${styles.container} ${styles.ov}`
        }
      >
        <div
          className={
            isLoading || loadLink
              ? `${styles.formContainer} pen`
              : `${styles.formContainer}`
          }
        >
          <form onSubmit={handleSubmit}>
            <div onClick={() => setLoadLink(true)} className={styles.switchBtn}>
              <Link href={"/login"} className={styles.link}>
                <div className={styles.switchIcon}>
                  <FaCircleArrowLeft size={"2rem"} />
                </div>
              </Link>
            </div>
            <div className={styles.contenu}>
              <div className={styles.rtgh}>
                <div className={styles.inputs}>
                  <div>
                    <input
                      type="text"
                      value={name}
                      placeholder={`Nom`}
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      placeholder={`Prénom`}
                      required
                      value={username}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      value={email}
                      placeholder={`Adresse e-mail`}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      autoComplete="new-password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      value={password}
                      placeholder={`Mot de passe`}
                      required
                    />
                  </div>
                  <div>
                    <input
                      ref={cPassRef}
                      type="password"
                      onChange={(e) => {
                        cPassRef.current.setCustomValidity("");
                        setCPassword(e.target.value);
                      }}
                      value={cPassword}
                      required
                      placeholder={`Confirmer mot de passe`}
                    />
                  </div>
                </div>
                <div className={styles.registerChoice}>
                  S{"'"}inscrire en tant que
                </div>
                <div
                  className={
                    userType.submit && isEmpty(userType.value)
                      ? `${styles.btn} ${styles.red}`
                      : `${styles.btn}`
                  }
                >
                  <Btn
                    setUserType={setUserType}
                    setIsHovered={setIsHovered}
                    isHovered={isHovered}
                    userType={userType}
                  />
                </div>
                <Terms
                  setAcceptconditions={setAcceptconditions}
                  acceptConditions={acceptConditions}
                  activePopup={activePopup}
                  setActivePopup={setActivePopup}
                />
                <div
                  className={
                    isLoading
                      ? `${styles.submit} ${styles.submitLoading}`
                      : `${styles.submit}`
                  }
                >
                  <button disabled={isLoading} type="submit">
                    S{"'"}inscrire
                  </button>
                </div>
              </div>
            </div>
          </form>
          {!isEmpty(activePopup.obj) && (
            <Conditions
              acceptConditions={acceptConditions}
              setAcceptconditions={setAcceptconditions}
              activePopup={activePopup}
              setActivePopup={setActivePopup}
            />
          )}
        </div>
      </div>
    </ClientOnly>
  );
}
