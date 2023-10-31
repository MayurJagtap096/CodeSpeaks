import { auth } from "@/firebase/firebase";
import React, { useEffect, useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

type Props = {};

function RessetPassword({}: Props) {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const [email, setEmail] = useState("");
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await sendPasswordResetEmail(email);
    if (success)
      toast.success("Password reset Email sent", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
  };

  useEffect(() => {
    if (error) alert("🔴 " + error.message);
  }, [error]);

  return (
    <form
      action={"/"}
      className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8"
      onSubmit={handleReset}
    >
      <h3 className="text-xl font-medium  text-white">Reset Password</h3>
      <p className="text-sm text-white ">
        Forgotten your password? Enter your e-mail address below, and we&apos;ll
        send you an e-mail allowing you to reset it.
      </p>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium  text-blue-300 mr-3"
        >
          Email . . . . . . . .
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="{Enter}"
          onChange={(e) => setEmail(e.target.value)}
          className=" text-blue-300 font-medium outline-none sm:text-sm bg-transparent w-60"
        />
      </div>

      <button className=" text-blue-100 font-medium hover:bg-white hover:text-blue-700 text-sm rounded-lg px-2.5 py-1.5 bg-blue-700 ">
        Reset Password
      </button>
    </form>
  );
}

export default RessetPassword;
