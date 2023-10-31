import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaChevronLeft, FaChevronRight, FaRegUser } from "react-icons/fa";
import Logout from "../Buttons/Logout";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";
import { GrCaretNext } from "react-icons/gr";
import { FcNext, FcPrevious } from "react-icons/fc";
import { useRouter } from "next/router";
import { problems } from "@/utils/Problems";
import { Problem } from "@/utils/types/problem";

type Props = {
  problemPage?: boolean;
};

function Topbar({ problemPage }: Props) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleProblemChange = (isForward: boolean) => {
    const { order } = problems[router.query.pid as string] as Problem;
    const direction = isForward ? 1 : -1;
    const nextProblemOrder = direction + order;
    const nextProblemKey = Object.keys(problems).find(
      (key) => problems[key].order === nextProblemOrder
    );
    if (isForward && !nextProblemKey) {
      const firstProblemKey = Object.keys(problems).find(
        (key) => problems[key].order === 1
      );
      router.push(`/problems/${firstProblemKey}`);
    } else if (!isForward && !nextProblemKey) {
      const lastProblemKey = Object.keys(problems).find(
        (key) => problems[key].order === Object.keys(problems).length
      );
      router.push(`/problems/${lastProblemKey}`);
    } else {
      router.push(`/problems/${nextProblemKey}`);
    }
  };

  return (
    <div className="px-9">
      <nav className="relative flex w-full shrink-0 items-center px-5 ">
        <div
          className={`flex w-full items-center justify-between ${
            !problemPage ? "max-w-[1200px] mx-auto" : ""
          }`}
        >
          <Link href="/" className="h-[22px] flex-1 text-lg font-medium">
            CodeSpeaks
          </Link>
          {problemPage && (
            <div className=" flex gap-4 justify-center flex-1   ">
              <button
                className="group transform active:scale-75 transition-transform"
                onClick={() => handleProblemChange(false)}
              >
                <FcPrevious className=" cursor-pointer" fontSize={25} />
                <div className=" absolute text-blue-400 text-xs transition-all group-hover:scale-100 scale-0 ease-linear">
                  Previous
                </div>
              </button>
              <Link
                href={"/"}
                className="flex items-center max-w-[170px] cursor-pointer"
              >
                <p className="">Problem List</p>
              </Link>
              <button
                className="group transform active:scale-75 transition-transform"
                onClick={() => handleProblemChange(true)}
              >
                <FcNext className=" cursor-pointer" fontSize={25} />
                <div className=" absolute text-blue-400  text-xs transition-all group-hover:scale-100 scale-0 ease-linear">
                  Next
                </div>
              </button>
            </div>
          )}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <div>
              <button
                rel="noreferrer"
                className=" py-1.5 px-3  text-sm cursor-pointer rounded bg-blue-700 hover:bg-blue-800 "
              >
                Premium
              </button>
            </div>
            {!user && (
              <Link href="/auth">
                <button className=" bg-blue-700 text-sm py-1.5 px-3 cursor-pointer rounded transform active:scale-75 transition-transform ">
                  Sign In
                </button>
              </Link>
            )}
            {user && problemPage && <Timer />}
            {user && (
              <div className="cursor-pointer group relative">
                <FaRegUser fontSize={"25"} />
                <div
                  className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 
		              transition-all duration-300 ease-in-out"
                >
                  <p className="text-sm text-blue-300 font-medium">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>
          {user && <Logout />}
        </div>
      </nav>
      <hr className=" mt-4 border-blue-300" />
    </div>
  );
}

export default Topbar;
