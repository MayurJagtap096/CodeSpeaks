import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import AuthModel from "@/components/Models/AuthModel";
import { authModalState } from "@/atoms/authModalAtom";
import { useRecoilValue } from "recoil";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import Image from "next/image";
type Props = {};

function AuthPage({}: Props) {
  const authModal = useRecoilValue(authModalState);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (user) router.push("/");
    if (!user && !loading) setPageLoading(false);
  }, [user, router, loading]);
  if (pageLoading) return null;

  return (
    <div className="bg-gradient-to-tr from-slate-800 to-black h-screen relative">
      <div className="max-w-4xl mx-auto">
        <Navbar />
        <div className="flex items-center justify-center text-white font-medium"></div>
      </div>
      {authModal.isOpen && <AuthModel />}
    </div>
  );
}

export default AuthPage;
