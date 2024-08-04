/** @format */

import MesProjets from "@/components/mes-projets/MesProjets";
import styles from "./projet.module.css";
import LR from "@/components/LR";
export default function MyProjectPage() {
  return (
    <>
      <div className={styles.container}>
        {/* <LR isMyProject></LR> */}
        <MesProjets />
      </div>
    </>
  );
}
