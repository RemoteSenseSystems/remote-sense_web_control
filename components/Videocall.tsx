"use client";

import { CSSProperties, use, useEffect, useRef, useState } from "react";
import ZoomVideo, {
  type VideoClient,
} from "@zoom/videosdk";
// import { FileX2, PhoneOff } from "lucide-react";
// import { Button } from "@nextui-org/button";
// import { COI } from "./coi";
import { CamPanel, VideoPanelMode } from "./CamPanel";

const safeMaxNumberOfCamPanels = 8; // linanw: there will be render issue in fullscreen when camPanel number is greater than 8.
const maxNumberOfCamPanels = 25; // linanw: when this mumber bigger than safeMaxNumberOfCamPanels, rendering mothed will be changed.
const maxZoomMultiplier = 5;

// linanw, use "async" here will have error.
const Videocall = (props: { session_name: string; client_id: string; JWT: string }) => {
  const [suggestedMode, setSuggestedMode] = useState(VideoPanelMode.Static);
  const session_name = props.session_name;
  const jwt = props.JWT;
  const client = useRef<typeof VideoClient>(ZoomVideo.createClient());
  const camPanelDefaultHeight = 360;
  const [session, setSession] = useState(undefined);
  const [camIdList, setCamIdList] = useState<string[]>(["pty-portable-1_cam0", "pty-portable-1_cam0"]); //
  const [currentTimeoutId, setCurrentTimeoutId] = useState<number>(0);
  const [zoomMultiplier, setZoomMultiplier] = useState(0);
  // const [canvasOffset, setCanvasOffset] = useState(0);
  const [justifyContent, setJustifyContent] = useState("");
  const [page, setPage] = useState(0);
  const [viewportChanged, setViewportChanged] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const videoPlayerContainer = useRef<HTMLDivElement>(null);
  const zoomMultiplierRef = useRef(zoomMultiplier);
  const pageRef = useRef(page);
  const viewportChangedRef = useRef(viewportChanged);
  zoomMultiplierRef.current = zoomMultiplier;
  pageRef.current = page;
  viewportChangedRef.current = viewportChanged;

  const joinSession = async () => {
    await client.current.init("en-US", "Global", { patchJsMedia: true, enforceMultipleVideos: { disableRenderLimits: true } });
    const result: any = await client.current.join(session_name, jwt, userName, "0000").catch((e) => {
      console.log("***" + JSON.stringify(e) + "***");
    });
    setSession(result);
  };

  // const sendCommand = async (command: string) => {
  //   await client.current.getCommandClient().send(command);
  // }

  // const leaveSession = async () => {
  //   await client.current.leave().catch((e) => console.log("leave error", e));
  //   // hard refresh to clear the state
  //   // window.location.href = "/";
  // };

  const getMaxPage = (Height: number, winHeight: number) => {
    if (Height == 0) return 0;
    const result = zoomMultiplier != 1 || maxNumberOfCamPanels <= safeMaxNumberOfCamPanels ? Math.ceil(Height / winHeight) - 1
      : Math.ceil(Math.min(maxNumberOfCamPanels, camIdList.length) / Math.max(1, Math.floor(window.innerWidth / (window.innerHeight / 9 * 16)))) - 1;
    return result;
  };

  useEffect(() => {
    const isMobile_ = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) != null;
    if (isMobile != isMobile_) setIsMobile(isMobile_);
  });

  useEffect(() => {
    if (props.client_id && props.client_id !== '') setCamIdList([props.client_id]);
  }, [props.client_id]);

  useEffect(() => {
    document.body.style.overflow = isMobile ? "auto" : "hidden";
  }, [isMobile]);

  useEffect(() => {
    const shuffle = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // setCamIdList(shuffle(camIdList));

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
      const Height = videoPlayerContainer.current?.getBoundingClientRect().height ?? 0;
      const winHeight = window.innerHeight;
      const maxPage: number = getMaxPage(Height, winHeight);

      if ((event.key === '+' || event.key === '=')) {
        event.preventDefault();
        zoomMultiplierRef.current == 0 ? setZoomMultiplier(findBiggestMultipler(camPanelDefaultHeight, innerHeight)) : zoomMultiplierRef.current > 1 && setZoomMultiplier(zoomMultiplierRef.current - 1);
      } else if (event.key === '-') {
        event.preventDefault();
        zoomMultiplierRef.current == 0 ? setZoomMultiplier(findBiggestMultipler(camPanelDefaultHeight, innerHeight)) : zoomMultiplierRef.current < maxZoomMultiplier && setZoomMultiplier(zoomMultiplierRef.current + 1);
      } else if (event.key === '0') {
        event.preventDefault();
        setZoomMultiplier(0);
      } else if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' || event.key === '5' || event.key === '6') {
        event.preventDefault();
        setZoomMultiplier(parseInt(event.key) <= maxZoomMultiplier ? parseInt(event.key) : maxZoomMultiplier);
      } else if (event.code === 'PageDown' || event.code === 'ArrowDown' || event.code === 'ArrowRight') {
        event.preventDefault();
        if (pageRef.current > maxPage) setPage(maxPage);
        else if (pageRef.current < maxPage) setPage(pageRef.current + 1);
      } else if (event.code === 'PageUp' || event.code === 'ArrowUp' || event.code === 'ArrowLeft') {
        event.preventDefault();
        if (pageRef.current < 0) setPage(0);
        else if (pageRef.current > 0) setPage(pageRef.current - 1);
      } else if (event.altKey && event.code === 'Enter') {
        event.preventDefault();
        document.documentElement.requestFullscreen();
      }
    }

    const wheelZoomHandler = (event: WheelEvent) => {
      event.ctrlKey && event.preventDefault();
    }

    setCurrentTimeoutId(timeoutId as unknown as number); // linanw: if here is a type error, please ignore it, it's not valid. 
    document.removeEventListener('keydown', keyboardZoomHandler);
    document.removeEventListener('wheel', wheelZoomHandler);

    document.addEventListener('keydown', keyboardZoomHandler);
    document.addEventListener('wheel', wheelZoomHandler, { passive: false });

    document.body.addEventListener("touchmove", () => {
      setTimeout(() => setViewportChanged(viewportChangedRef.current + 1), 1000);
    });

    window.addEventListener("resize", () => {
      setViewportChanged(viewportChangedRef.current + 1);
    });

    window.addEventListener("beforeunload", () => {
      client.current.leave();
    });

    session || joinSession();

    return () => {
      document.removeEventListener('keydown', keyboardZoomHandler);
      document.removeEventListener('wheel', wheelZoomHandler);
      // if (element) resizeObserver.unobserve(element);
    }
  }, [props.session_name]);

  useEffect(() => {
    const element = document.getElementById("video-player-container");
    const isFullyVisible = elementIsHeightFitViewport(element!);
    if (isFullyVisible) {
      setJustifyContent("center");
      // element.parentElement!.style.justifyContent = "center";
    }
    else {
      setJustifyContent("start");
      // element.parentElement!.style.justifyContent = "start";
    }
    setPage(0);
  }, [props.session_name, viewportChanged]);

  const _canvasOffset = (page: number) => {
    if (page < 0) return 0;
    const Height = videoPlayerContainer.current?.getBoundingClientRect().height ?? 0;
    const winHeight = window.innerHeight;
    const maxPage = getMaxPage(Height, winHeight);
    if (page > maxPage) page = maxPage;

    const result = zoomMultiplier != 1 || maxNumberOfCamPanels <= safeMaxNumberOfCamPanels ? page * -winHeight : page == 0 ? 0 : -winHeight;
    return result;
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

  return (
    <>
      <div className="flex h-screen flex-col justify-center bg-black" style={{ justifyContent: justifyContent }}>
        {/* @ts-expect-error html component */}
        <video-player-container id="video-player-container" style={{ top: `${_canvasOffset(pageRef.current)}px` }} ref={videoPlayerContainer}>
          <div className="flex flex-row  justify-center  flex-wrap bg-black" id="b" >
            {isMobile && <div className="top-box" />}
            {!isMobile && Math.floor(window.innerWidth / (window.innerHeight / 9 * 16)) == 0 && zoomMultiplier == 1 && maxNumberOfCamPanels > safeMaxNumberOfCamPanels ? <div className="expand-notice">{"<< << << Please Expand The Browser Window Wider >> >> >>"}</div>
              : camIdList.slice(0, maxNumberOfCamPanels).map((camId, index) => (
                ((zoomMultiplier != 1 || maxNumberOfCamPanels <= safeMaxNumberOfCamPanels || isMobile || Math.abs(Math.floor(index / Math.max(1, Math.floor(window.innerWidth / (window.innerHeight / 9 * 16)))) - page) < 2)) &&
                <CamPanel
                  className={"cam-panal-container"}
                  key={index} videoClient={client} mode={suggestedMode} camId={camId} page={page}
                  height={isMobile ? window.innerWidth / 16 * 9 + "px" : zoomMultiplierRef.current === 0 ? `${camPanelDefaultHeight}px` : `${innerHeight / zoomMultiplierRef.current}px`}
                  alwaysAttach={true}
                  justifyContent={justifyContent} // linanw, pass in justifyContent to trigger recalucation of the visibility, when justifyContent changes.
                  viewportChanged={viewportChanged} //
                />
              ))}
          </div>
          {/* @ts-expect-error html component */}
        </video-player-container>
      </div>


      {/* <div className="flex w-full flex-col justify-center self-center">
          <div className="mt-4 flex w-[30rem] flex-1 justify-around self-center rounded-md bg-white p-4">
            <Button onClick={leaveSession} title="leave session">
              <PhoneOff />
            </Button>
            <Button onClick={() => sendCommand("#l")} title="send command">
              Send Command
            </Button>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Videocall;

const userName = `User-${new Date().getTime().toString().slice(8)}`;