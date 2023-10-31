import React, { useEffect, useState } from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from "react-icons/ai";
import { ISettings } from "../Playground";
import SettingsModal from "@/components/Models/SettingsModal";

type Props = {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
};

function PreferenceNav({ setSettings, settings }: Props) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };
  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }
    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullScreenChange", exitHandler);
    }
  }, []);

  return (
    <div className="flex justify-between items-center h-11 w-full ">
      <div className="flex items-center text-white">
        <button className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2  hover:bg-gray-500 px-1 py-1 ml-1 font-medium">
          <div className="flex items-center px-1">
            <div className="text-xs text-label-2">JavaScript</div>
          </div>
        </button>
      </div>
      <div className="flex items-center">
        <button
          className="preferenceBtn group"
          onClick={() =>
            setSettings({ ...settings, settingsModalIsOpen: true })
          }
        >
          <div className=" mr-3 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className=" absolute w-auto text-xs transition-all  group-hover:scale-100 scale-0 ease-linear">
            Settings
          </div>
        </button>
        <button className="preferenceBtn pr-2 group" onClick={handleFullScreen}>
          <div className=" mt-4 w-min">
            {isFullScreen ? (
              <AiOutlineFullscreenExit />
            ) : (
              <AiOutlineFullscreen />
            )}
          </div>
          <div className=" min-w-max scale-0 h-4  w-4  transition-all ease-linear text-xs group-hover:scale-100">
            Full Screen
          </div>
        </button>
      </div>
      {settings.settingsModalIsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
}

export default PreferenceNav;
