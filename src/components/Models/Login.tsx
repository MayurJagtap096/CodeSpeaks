import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/firebase";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

type Props = {};

function Login({}: Props) {
  const [authModal, setAuthModal] = useRecoilState(authModalState);
  const handleClick = (type: "login" | "register" | "forgotPassword") => {
    setAuthModal((prev) => ({ ...prev, type }));
  };

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [inputs, setInputs] = useState({ email: "", password: "" });

  const router = useRouter();
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputs.email == "" || inputs.password == "")
      return alert("🔴Please enter all fields");
    try {
      const newUser = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) return;
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };
  console.log(user, "user");

  useEffect(() => {
    if (error)
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
  }, [error]);

  return (
    <form action={"/"} className="space-y-6 px-6 pb-4 " onSubmit={handleLogin}>
      <h3 className="font-medium text-white text-xl">Sign in to LeetCode</h3>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium  text-blue-300 mr-3"
        >
          Email . . . . . . . .
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          placeholder="{Enter}"
          className=" text-blue-300 font-medium outline-none sm:text-sm bg-transparent w-60"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium  text-blue-300 mr-2"
        >
          Password . . . . .
        </label>
        <input
          onChange={handleChangeInput}
          type="password"
          name="password"
          id="password"
          placeholder="{Enter}"
          className=" text-blue-300 font-medium outline-none sm:text-sm bg-transparent w-60"
        />
      </div>
      <button className=" text-blue-100 font-medium hover:bg-white hover:text-blue-700 text-sm rounded-lg px-2.5 py-1.5 bg-blue-700 ">
        {loading ? "Loading..." : "Log In"}
      </button>
      <button className="block" onClick={() => handleClick("forgotPassword")}>
        <a
          href="#"
          className="text-sm block text-blue-300 hover:underline text-left"
        >
          Forgot password?
        </a>
      </button>
      <div className="text-sm font-medium text-blue-300">
        Not Registered?{" "}
        <a
          href="#"
          className="text-blue-300 hover:underline"
          onClick={() => handleClick("register")}
        >
          Create Account
        </a>
      </div>
    </form>
  );
}

export default Login;
