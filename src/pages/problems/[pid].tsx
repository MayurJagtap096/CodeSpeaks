import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import { problems } from "@/utils/Problems";
import { Problem } from "@/utils/types/problem";
import React from "react";

type Props = {
  problem: Problem;
};

function ProblemPage({ problem }: Props) {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  return (
    <div className="bg-gradient-to-tr from-slate-800 to-black  relative text-white py-3">
      <Topbar problemPage />
      <Workspace problem={problem} />
    </div>
  );
}

export default ProblemPage;

export async function getStaticPaths() {
  const paths = Object.keys(problems).map((key) => ({
    params: { pid: key },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  const problem = problems[pid];
  if (!problem) {
    return {
      notFound: true,
    };
  }
  problem.handlerFunction = problem.handlerFunction.toString();
  return {
    props: {
      problem,
    },
  };
}
