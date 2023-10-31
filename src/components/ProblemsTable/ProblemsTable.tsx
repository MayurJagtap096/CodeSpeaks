import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import Link from "next/link";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

function ProblemsTable({ setLoadingProblems }: any) {
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: "",
  });

  const problems = useGetProblems(setLoadingProblems);

  const solvedProblem = useGetSolvedProblems();
  const closeModal = () => {
    setYoutubePlayer({ isOpen: false, videoId: "" });
  };

  return (
    <>
      <tbody>
        {problems.map((problem, idx) => {
          const difficultyColor =
            problem.difficulty == "Hard"
              ? "text-red-500"
              : problem.difficulty == "Easy"
              ? "text-green-500"
              : "text-yellow-400";
          return (
            <>
              <tr
                className={`${
                  idx % 2 ? "" : ""
                } border-b-blue-300 text-blue-100 border-b`}
                key={problem.id}
              >
                <th className=" px-2 py-3 font-medium ">
                  {solvedProblem.includes(problem.id) ? (
                    <BsCheckCircle
                      fontSize={"18"}
                      width="18"
                      className="text-green-500"
                    />
                  ) : (
                    <BsCheckCircle fontSize={"18"} width="18" />
                  )}
                </th>
                <td className="px-4 py-6">
                  {problem.link ? (
                    <Link
                      href={problem.link}
                      className=" hover:text-blue-600 cursor-pointer"
                      target="_blank"
                    >
                      {problem.title}
                    </Link>
                  ) : (
                    <Link className="" href={`problems/${problem.id}`}>
                      {problem.title}
                    </Link>
                  )}
                </td>
                <td className={`px-4 py-6 ${difficultyColor}`}>
                  {problem.difficulty}
                </td>
                <td className={`px-4 py-6`}>{problem.category}</td>
                <td className={`px-4 py-6`}>
                  {problem.videoId ? (
                    <AiFillYoutube
                      onClick={() =>
                        setYoutubePlayer({
                          isOpen: true,
                          videoId: problem.videoId as string,
                        })
                      }
                      fontSize={"30"}
                      className={"hover:cursor-pointer hover:text-red-600"}
                    />
                  ) : (
                    <p>Coming Soon</p>
                  )}
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
      {youtubePlayer.isOpen && (
        <tfoot
          className="fixed top-0 left-0 h-screen backdrop-blur-sm w-screen flex items-center justify-center "
          onClick={closeModal}
        >
          <div className="bg-black z-10 opacity-40  top-0 left-0 w-screen h-screen absolute"></div>
          <div className="w-full z-50 h-full px-6 relative max-w-4xl ">
            <div className="w-full h-full flex items-center justify-center  relative">
              <div className="w-full relative border-2 border-blue-300">
                <IoClose
                  fontSize={"25"}
                  className="cursor-pointer absolute -top-8 right-0 text-white"
                  onClock={closeModal}
                />
                <YouTube
                  videoId={youtubePlayer.videoId}
                  loading="lazy"
                  iframeClassName="w-full min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </tfoot>
      )}
    </>
  );
}

export default ProblemsTable;

function useGetProblems(
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [problems, setProblems] = useState<DBProblem[]>([]);
  useEffect(() => {
    const getProblems = async () => {
      setLoadingProblems(true);
      const q = query(
        collection(firestore, "problems"),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      const tmp: DBProblem[] = [];
      querySnapshot.forEach((doc) => {
        tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
      });
      setProblems(tmp);
      setLoadingProblems(false);
    };
    getProblems();
  }, [setLoadingProblems]);
  console.log(problems);
  return problems;
}

function useGetSolvedProblems() {
  const [solvedProblems, setSolvedProblems] = useState<String[]>([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const gettSolvedProblems = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setSolvedProblems(userDoc.data().solvedProblems);
      }
    };
    if (user) gettSolvedProblems();
    if (!user) setSolvedProblems([]);
  }, [user]);
  return solvedProblems;
}
