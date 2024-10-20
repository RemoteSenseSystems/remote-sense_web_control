"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import ZoomVideo, {
  type VideoClient,
} from "@zoom/videosdk";
import { PhoneOff } from "lucide-react";
import { Button } from "@nextui-org/button";
import { COI } from "./coi";
import { CamPanel, VideoPanelMode } from "./CamPanel";

// linanw, use "async" here will have error.
const Videocall = (props: { session_name: string; JWT: string }) => {
  const [suggestedMode, setSuggestedMode] = useState(VideoPanelMode.Stream);
  const session = props.session_name;
  console.log("session: ", session);
  const jwt = props.JWT;
  const client = useRef<typeof VideoClient>(ZoomVideo.createClient());
  const [camIdList, setCamIdList] = useState<string[]>(["default_lubuntu-x299e", "linanw-cnc_cam0", "linanw-cnc_cam6", "linanw-cnc_cam7", "default_cam0", "default_cam1", "default_cam2", "default_cam3", "default_cam4", "default_cam5", "default_cam6", "default_cam7"]);
  const [currentTimeoutId, setCurrentTimeoutId] = useState<number>(0);

  const joinSession = async () => {
    console.log("joinSession");
    await client.current.init("en-US", "Global", { patchJsMedia: true });
    await client.current.join(session, jwt, userName, "0000").catch((e) => {
      console.log("***" + JSON.stringify(e) + "***");
    });
  };

  const sendCommand = async (command: string) => {
    await client.current.getCommandClient().send(command);
  }

  const leaveSession = async () => {
    await client.current.leave().catch((e) => console.log("leave error", e));
    // hard refresh to clear the state
    // window.location.href = "/";
  };

  useEffect(() => {
    joinSession();

    // schedule a timer to refresh the page at 00:00
    if (currentTimeoutId !== 0) {
      clearTimeout(currentTimeoutId);
    }
    const now = new Date();
    var millisTill00 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime() - now.getTime();
    if (millisTill00 < 0) {
      millisTill00 += 86400000; // it's after 00:00, try 00:00 tomorrow.
    }
    const timeoutId = setTimeout(function () {
      window.location.reload();
    }, millisTill00);
    setCurrentTimeoutId(timeoutId as unknown as number); // linanw: if here is a type error, please ignore it, it's not valid.

  }, [props.session_name]);

  return (
    <>
      <div className="flex h-full w-full flex-1 flex-col">
        <COI className="bottom-right" />
        <h1 className="text-center text-3xl font-bold mb-4 mt-0 top-left">
          Session: {session}
        </h1>
        {/* @ts-expect-error html component */}
        <video-player-container
          style={{
            backgroundColor: "lightgrey",
            width: `1280px`,
            height: `100%`,
          }}>
          {camIdList.map((camId, index) => (
            <CamPanel key={index} videoClient={client} mode={suggestedMode} camId={camId} />
          ))}
          {/* @ts-expect-error html component */}
        </video-player-container>


        <div className="flex w-full flex-col justify-around self-center">
          <div className="mt-4 flex w-[30rem] flex-1 justify-around self-center rounded-md bg-white p-4">
            <Button onClick={leaveSession} title="leave session">
              <PhoneOff />
            </Button>
            <Button onClick={() => sendCommand("#l")} title="send command">
              Send Command
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Videocall;

const videoPlayerStyle = {
  backgroundColor: "black",
  // height: "100vh",
  // width: "100vw",
  marginTop: "0rem",
  marginLeft: "0rem",
  marginRight: "0rem",
  alignContent: "center",
  borderRadius: "0px",
  overflow: "hidden",
} as CSSProperties;

const userName = `User-${new Date().getTime().toString().slice(8)}`;