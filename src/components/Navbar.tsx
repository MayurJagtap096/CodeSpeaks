import { authModalState } from "@/atoms/authModalAtom";
import Link from "next/link";
import React from "react";
import { useSetRecoilState } from "recoil";

type Props = {};

function Navbar({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: true }));
  };
  return (
    <div className=" flex items-center justify-between ">
      <Link
        href="/"
        className="flex items-center font-medium text-xl justify-center h-20 text-white"
      >
        {" "}
        CodeSpeaks
      </Link>
      <div className=" flex items-center">
        <button
          className=" bg-blue-700 text-white px-3 py-1 sm:px-4 animated-button rounded-md font-medium"
          onClick={handleClick}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Navbar;
