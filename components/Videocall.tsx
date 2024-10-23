"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import ZoomVideo, {
  type VideoClient,
} from "@zoom/videosdk";
import { FileX2, PhoneOff } from "lucide-react";
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
  const camPanelDefaultHeight = 360;
  const [camIdList, setCamIdList] = useState<string[]>(["default_cam4", "default_cam5", "linanw-cnc_cam7"]);
  const [currentTimeoutId, setCurrentTimeoutId] = useState<number>(0);
  const [zoomMultiplier, setZoomMultiplier] = useState(-1);
  const zoomMultiplierRef = useRef(zoomMultiplier);

  // useEffect(() => {
    zoomMultiplierRef.current = zoomMultiplier;
  // }, [zoomMultiplier]);

  const joinSession = async () => {
    console.log("joinSession");
    await client.current.init("en-US", "Global", { patchJsMedia: true });//enforceMultipleVideos: { disableRenderLimits: true } });
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


  const wheelZoomHandler = (event: WheelEvent) => {
    event.ctrlKey && event.preventDefault();
  }

  useEffect(() => {
    const shuffle = (array: string[]) => { 
      for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
      } 
      return array; 
    }; 

    // setCamIdList(shuffle(camIdList));

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

    const keyboardZoomHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === '+' || event.key === '=')) {
        console.log("ctrl +, current zoomMultiplier: ", zoomMultiplier);
        console.log("ctrl +, current zoomMultiplierRef.current: ", zoomMultiplierRef.current);
        event.preventDefault();
        zoomMultiplierRef.current < 0 ? setZoomMultiplier(findBiggestMultipler(camPanelDefaultHeight, innerHeight)) : setZoomMultiplier(zoomMultiplierRef.current - 1);
      } else if (event.ctrlKey && event.key === '-') {
        console.log("ctrl -, current zoomMultiplier: ", zoomMultiplier);
        console.log("ctrl -, current zoomMultiplierRef.current: ", zoomMultiplierRef.current);
        event.preventDefault();
        zoomMultiplierRef.current < 0 ? setZoomMultiplier(findBiggestMultipler(camPanelDefaultHeight, innerHeight) + 1) : setZoomMultiplier(zoomMultiplierRef.current + 1);
      } else if (event.ctrlKey && event.key === '0') {
        console.log("ctrl 0");
        event.preventDefault();
        setZoomMultiplier(-1);
      }
    }

    setCurrentTimeoutId(timeoutId as unknown as number); // linanw: if here is a type error, please ignore it, it's not valid.
    document.removeEventListener('keydown', keyboardZoomHandler);
    document.removeEventListener('wheel', wheelZoomHandler);

    console.log("#####*************effect set listener");
    document.addEventListener('keydown', keyboardZoomHandler);
    document.addEventListener('wheel', wheelZoomHandler, { passive: false });

    return () => {
      console.log("#####*************effect clean up");
      document.removeEventListener('keydown', keyboardZoomHandler);
      document.removeEventListener('wheel', wheelZoomHandler);
    }

  }, [props.session_name]);

  const element = document.getElementById("a");
  if (element) {
    new ResizeObserver(() => {
      // document.getElementsByTagName("body")[0].scrollTo(0, 0);
      element.parentElement!.scrollTo(0, 0);
      const isFullyVisible = elementIsHeightFitViewport(element);
      isFullyVisible ? element.parentElement!.style.justifyContent = "center" : element.parentElement!.style.justifyContent = "flex-start";
    }).observe(element);
  }

  const elementIsHeightFitViewport = (el: HTMLElement) => {
    const height = el.getBoundingClientRect().height;
    return height <= innerHeight;
  };

  const findBiggestMultipler = (value: number, ceiling: number): number => {
    let multiplier = 1;
    while (value * multiplier < ceiling) {
      multiplier++;
    }
    return multiplier - 1;
  }

  console.log("zoomMultiplier: ", zoomMultiplier);
  console.log("zoomMultiplierRef: ", zoomMultiplierRef.current);
  document.body.style.overflow = 'hidden';


  return (
    <>
      <div className="">
        {/* <COI className="bottom-right" /> */}
        {/* <h1 className="text-center text-3xl font-bold mb-4 mt-0 top-left">
          Session: {session}
        </h1> */}
        <div className="flex h-screen flex-col justify-center bg-black" >
          {/* @ts-expect-error html component */}
          <video-player-container id="a">
            <div className="flex flex-row  justify-center  flex-wrap" id="b">
              {camIdList.map((camId, index) => (
                <CamPanel className="cam-panel" key={index} videoClient={client} mode={suggestedMode} camId={camId} style={{
                  height: zoomMultiplierRef.current === -1 ? `${camPanelDefaultHeight}px` : zoomMultiplierRef.current > 0 ? `${innerHeight / zoomMultiplierRef.current}px` : `${innerHeight * Math.abs(zoomMultiplierRef.current)}px`
                }} />
              ))}
            </div>
            {/* {camIdList.map((camId, index) => (
            <CamPanel className="cam-panel" key={index} videoClient={client} mode={suggestedMode} camId={camId}/>
          ))} */}
            {/* @ts-expect-error html component */}
          </video-player-container>
        </div>


        <div className="flex w-full flex-col justify-center self-center">
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