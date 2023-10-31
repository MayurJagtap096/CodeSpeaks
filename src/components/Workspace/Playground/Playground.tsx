import React, { useEffect, useState } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { problems } from "@/utils/Problems";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropDownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess }) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem.starterCode);
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropDownIsOpen: false,
  });

  const [user] = useAuthState(auth);

  const {
    query: { pid },
  } = useRouter();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your code.", {
        position: "top-center",
        theme: "dark",
        autoClose: 3000,
      });
      return;
    }
    try {
      userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
      const cb = new Function(`return ${userCode}`)();
      const handler = problems[pid as string].handlerFunction;
      if (typeof handler === "function") {
        const success = handler(cb);
        if (success) {
          toast.success("All test cases passed.", {
            position: "top-center",
            theme: "dark",
            autoClose: 3000,
          });
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 4000);
          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
          });
        }
      }
    } catch (error: any) {
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("Oops! One or more Test Cases failed", {
          position: "top-center",
          theme: "dark",
          autoClose: 3000,
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    }
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${pid}`);
    if (user) {
      setUserCode(code ? JSON.parse(code) : problem.starterCode);
    } else {
      setUserCode(problem.starterCode);
    }
  }, [problem.starterCode, pid, user]);
  const onChange = (value: string) => {
    setUserCode(value);
    localStorage.setItem(`code-${pid}`, JSON.stringify(value));
  };

  return (
    <div className="flex flex-col relative">
      <PreferenceNav settings={settings} setSettings={setSettings} />
      <Split
        sizes={[60, 40]}
        className="h-[calc(100vh-94px)]"
        minSize={60}
        direction="vertical"
      >
        <div className="w-full overflow-auto h-max">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            extensions={[javascript()]}
            style={{ fontSize: settings.fontSize }}
            onChange={onChange}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex flex-col justify-center cursor-pointer h-full">
              <div className="text-sm font-medium leading-5 text-white">
                TestCases
              </div>
              <hr className="absolute h-0.5  w-full rounded-full bottom-0 bg-white" />
            </div>
          </div>
          <div className="flex">
            {problem.examples.map((example, index) => (
              <div
                className="mt-2 text-white items-start mr-2"
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center  transition-all inline-flex focus:outline-none relative rounded-lg px-2.5 py-1 text-sm whitespace-nowrap bg-gray-800 hover:bg-gray-600 cursor-pointer
                  ${
                    index == activeTestCaseId ? "text-white" : "text-gray-500"
                  } `}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="font-semibold">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border text-sm border-transparent px-3 py-1.5 bg-gray-800 mt-2 text-white">
              {problem.examples[activeTestCaseId].inputText}
            </div>
          </div>
          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border text-sm border-transparent px-3 py-1.5 bg-gray-800 mt-2 text-white">
              {problem.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};

export default Playground;
