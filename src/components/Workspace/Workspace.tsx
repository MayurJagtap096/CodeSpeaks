import React, { useState } from "react";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Split from "react-split";
import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  problem: Problem;
};

function Workspace({ problem }: Props) {
  const [success, setSuccess] = useState(false);
  return (
    <>
      <Split className="split overflow-hidden " minSize={0}>
        <ProblemDescription problem={problem} />
        <Playground problem={problem} setSuccess={setSuccess} />
      </Split>

      {success && (
        <Confetti
          className="overflow-hidden max-h-min"
          gravity={0.3}
          tweenDuration={4000}
          height={600}
          width={1200}
        />
      )}
    </>
  );
}

export default Workspace;
