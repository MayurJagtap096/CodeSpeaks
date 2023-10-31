import { auth } from "@/firebase/firebase";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { FiLogOut } from "react-icons/fi";

type Props = {};

function Logout({}: Props) {
  const [signOut, loading, error] = useSignOut(auth);
  const handleLogOut = () => {
    signOut();
  };
  return (
    <button
      className="cursor-pointer px-2 py-1.5 bg-blue-700 rounded ml-4 transform active:scale-75 transition-transform "
      onClick={handleLogOut}
    >
      <FiLogOut fontSize={"22"} />
    </button>
  );
}

export default Logout;
