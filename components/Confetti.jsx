import ReactConfetti from "react-confetti";
export default function Confetti() {
  const colors = [
    "#ff5757",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#036eff",
    "#03a9f4",
    "#00bcd4",
    "#4CAF50",
    "#8BC34A",
    "#badf5b",
    "#FFEB3B",
    "#c14ac3",
    "#b36eb4",
    "#dfa85b",
    "#a58559",
    "#ff3b58",
    "#e8e8e8",
    "#ebebeb",
    "#b9b9b9",
  ];
  const duration = 3 * 60 * 1000;
  return (
    <ReactConfetti
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "30",
        width: "100vw",
        height: "100vh",
      }}
      colors={colors}
      tweenDuration={duration}
      numberOfPieces={3000}
      recycle={false}
    />
  );
}
