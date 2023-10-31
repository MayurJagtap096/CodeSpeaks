import Topbar from "@/components/Topbar/Topbar";
import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import { useState } from "react";
import useHasMounted from "@/hooks/useHasMounted";

export default function Home() {
  const [loadingProblems, setLoadingProblems] = useState(true);
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  return (
    <main className="bg-gradient-to-tr from-slate-800 to-black  relative text-white py-3">
      <Topbar />
      <h1 className="text-2xl text-center text-blue-300 font-medium  mt-10 mb-5">
        {"PROBLEM's LIST"}
      </h1>

      <div className="relative overflow-x-auto mx-auto  pb-10  ">
        {loadingProblems && (
          <div className=" max-w-[1200px] mx-auto sm:w-7/12 w-full">
            {[...Array(10)].map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))}
          </div>
        )}
        <table className=" text-left text-gray-500 dark:text-gray-400 sm:w-8/12 w-full max-w-[1200px] mx-auto ">
          {!loadingProblems && (
            <thead className="uppercase border-b-blue-300 border-b font-serif text-blue-200  ">
              <tr>
                <th scope="col" className="px-1 py-3  w-0 font-medium">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 w-0 font-medium">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 w-0 font-medium">
                  Difficulty
                </th>

                <th scope="col" className="px-6 py-3 w-0 font-medium">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 w-0 font-medium">
                  Solution
                </th>
              </tr>
            </thead>
          )}
          <ProblemsTable setLoadingProblems={setLoadingProblems} />
        </table>
      </div>
    </main>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6 animate-pulse">
      <div className="w-10 h-10 shrink-0 rounded-full bg-gray-700 "></div>
      <div className="h-10 sm:w-52  w-50  rounded-full bg-gray-700 "></div>
      <div className="h-10 sm:w-52  w-50 rounded-full bg-gray-700 "></div>
      <div className="h-10 sm:w-52 w-50 rounded-full bg-gray-700 "></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
