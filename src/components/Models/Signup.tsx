import { authModalState } from "@/atoms/authModalAtom";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

type Props = {};

function Signup({}: Props) {
  const [authModal, setAuthModal] = useRecoilState(authModalState);
  const handleClick = () => {
    setAuthModal((prev) => ({ ...prev, type: "login" }));
  };

  const router = useRouter();

  const [inputs, setInputs] = useState({ email: "", password: "", name: "" });

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputs.email == "" || inputs.name == "" || inputs.password == "")
      return alert("🔴Please fill the fields completely!");
    try {
      toast.loading("Creating your account", {
        position: "top-center",
        toastId: "loadingToast",
      });
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) return;
      const userData = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        displayName: inputs.name,
        createAt: Date.now(),
        updatedAt: Date.now(),
        likedProblems: [],
        displikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
      };
      await setDoc(doc(firestore, "users", newUser.user.uid), userData);

      router.push("/");
    } catch (error: any) {
      toast.error(error);
    } finally {
      toast.dismiss("loadingToast");
    }
    console.log(inputs);
  };

  useEffect(() => {
    if (error) alert(error.message);
  }, [error]);

  return (
    <div>
      <form
        action={"/"}
        className="space-y-6 px-6 pb-4"
        onSubmit={handleRegister}
      >
        <h3 className="font-medium text-white text-xl">Register to LeetCode</h3>
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium  text-blue-300 mr-3"
          >
            Name . . . . . . .{" "}
          </label>
          <input
            onChange={handleChangeInput}
            type="name"
            name="name"
            id="name"
            placeholder="{Enter}"
            className=" text-blue-300 font-medium outline-none sm:text-sm bg-transparent w-60"
          />
        </div>
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
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-sm font-medium text-blue-300">
          Already have an account?{" "}
          <a
            href="#"
            className="text-blue-300 hover:underline"
            onClick={handleClick}
          >
            Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default Signup;
