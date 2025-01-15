import React, { MutableRefObject, use, useEffect, useRef, useState } from "react";
import Timelapse from "./Timelapse";
import {
    VideoClient,
    VideoQuality,
    type VideoPlayer,
} from "@zoom/videosdk";

export enum VideoPanelMode {
    Stream = 'stream',
    Timelapse = 'timelapse',
    Static = 'static',
}

export const CamPanel = (props: {
    videoClient: MutableRefObject<typeof VideoClient>,
    camId: string,
    mode?: VideoPanelMode,
    className?: string,
    style?: React.CSSProperties,
    page?: number,
    onControlCommand?: () => void,
}) => {
    const client = props.videoClient;
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<VideoPanelMode>(props.mode ?? VideoPanelMode.Static);
    const [userId, setUserId] = useState<number>(0);
    const [isVideoAttached, setIsVideoAttached] = useState(false);
    const [rectChanged, setRectChanged] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isPTZStarted, setIsPTZStarted] = useState(false);
    const [ptzStartX, setPTZStartX] = useState(0);
    const [ptzPan, setPTZPan] = useState(0);
    const myRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef(rectChanged);

    const sendCommand = async (command: string) => {
        await client.current.getCommandClient().send(command);
      }

    useEffect(() => {
        console.log("###############*************useEffect, camId", props.camId);
        client.current.on("peer-video-state-change", async (payload: { action: "Start" | "Stop", userId: number; }) => {
            // console.log("total users: ", client.current.getAllUser().length);
            // console.log("peer-video-state-change", payload);
            const action = payload.action;
            const userId_ = payload.userId;
            if (action === "Start") {
                const camId = client.current.getUser(userId_)?.displayName;
                if (camId && camId === props.camId) {
                    console.log("**************video connected", camId, userId_);
                    setUserId(userId_);
                }
            } else if (action === "Stop") {
                if (videoContainerRef.current &&
                    videoContainerRef.current.children.length > 0 &&
                    (videoContainerRef.current.children[0].getAttribute("node-id") ?? 0) == userId_) {
                    console.log("**************video disconnected", userId_);
                    detachVideo();
                    setUserId(0);
                }
            }
        })

        const scrollEndHandler = (event: Event) => {
            console.log("***********set Rect on", event.type, rectChanged);
            setRectChanged(rectRef.current + 1);
        };

        document.addEventListener("scrollend", scrollEndHandler);

        const element = document.getElementById('myself');
        var resizeObserver: ResizeObserver | undefined;
        if (element && element.parentElement) {
            resizeObserver = new ResizeObserver(() => {
                console.log("***********set Rect on resize", rectChanged);
                setRectChanged(rectRef.current + 1);
            });
            resizeObserver.observe(element.parentElement);
            console.log("$$$$$$$$***********observer set", element.parentElement);
        } else {
            console.log("$$$$$$$$***********element not found");
        }

        return () => {
            document.removeEventListener("scrollend", scrollEndHandler);
            if (element && element.parentElement) {
                resizeObserver?.unobserve(element.parentElement);
                console.log("$$$$$$$$***********observer unset", element.parentElement);
            }
        }
    }, [props.camId]);

    const attachVideo = async () => {
        console.log("**************attaching", userId);
        const mediaStream = client.current.getMediaStream();
        const result = await mediaStream.attachVideo(userId, VideoQuality.Video_360P); // linanw: set 360 but the actual first video quality is 720p
        const videoPlayer = result as VideoPlayer;
        if (videoContainerRef.current) {
            var tempList: Element[] = [];
            for (var i = 0; i < videoContainerRef.current.children.length; i++) {
                tempList.push(videoContainerRef.current.children[i]);
            }
            console.log("###################******************tempList: ", tempList.length);
            videoContainerRef.current.appendChild(videoPlayer);
            for (var i = 0; i < tempList.length; i++) {
                console.log("###################******************removing: ", tempList[i]);
                tempList[i].remove();
            }
            console.log("**************attached!!!", userId);
        }
    }

    const detachVideo = async () => {
        if (videoContainerRef.current &&
            videoContainerRef.current.children.length > 0 &&
            (videoContainerRef.current.children[0].getAttribute("node-id") ?? 0) == userId) {
            const mediaStream = client.current.getMediaStream();
            console.log("**************detaching", userId);
            videoContainerRef.current.children[0].remove();
            // const element = await mediaStream.detachVideo(userId);
            // console.log("element: ", element);
            // Array.isArray(element)
            //     ? element.forEach((el) => el.remove())
            //     : element ? element.remove() : null; 
        }
    }

    useEffect(() => {
        console.log("###############*************useEffect2, userId", userId);
        if (userId > 0 && !isVideoAttached) { // && isVisible) { // linanw: old code to detach video when not visible, but buggy.
            attachVideo();
            if (!isVideoAttached) setIsVideoAttached(true);
        } else {
            detachVideo();
            if (isVideoAttached) setIsVideoAttached(false);
        }
    }, [userId, isVisible]);

    useEffect(() => {
        const elementIsVisibleInViewport = (rect: DOMRect, partiallyVisible = false) => {
            const { top, left, bottom, right } = rect;
            const { innerHeight, innerWidth } = window;
            return partiallyVisible
                ? ((top > 0 && top < innerHeight) ||
                    (bottom > 0 && bottom < innerHeight) ||
                    top <= 0 && bottom >= innerHeight) &&
                ((left > 0 && left < innerWidth) ||
                    (right > 0 && right < innerWidth) ||
                    left <= 0 && right >= innerWidth)
                : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
        };

        const isVisible_ = elementIsVisibleInViewport(myRef.current!.getBoundingClientRect(), true)
        if (isVisible_ != isVisible) setIsVisible(isVisible_);
    }, [rectChanged]);

    useEffect(() => {
        setRectChanged(rectRef.current + 1);
    }, [props.page]);

    if (userId == 0) {
        client.current.getAllUser().forEach((user) => {
            const camId = user.displayName;
            if (camId && camId === props.camId) {
                console.log("**************video bot connected", camId, user.userId);
                setUserId(user.userId);
            }
        });
    }

    // const isVideoAttached = (videoContainerRef.current != undefined && videoContainerRef.current.children.length > 0);
    console.log("******* videoContainerRef.current", videoContainerRef.current?.children.length, isVideoAttached, userId);
    console.log("*********** isAttached", isVideoAttached, userId);
    console.log("get ############## Rect", userId, myRef.current?.getBoundingClientRect());

    const currentRect = myRef.current?.getBoundingClientRect();

    return (
        <div className="cam-panal-container" style={props.style} id="myself" ref={myRef} role="presentation"
            onMouseUp={() => {
                if (isPTZStarted) {
                    console.log("%%%%%%%%%%##Send PTZ Command: ", ptzPan);
                    setIsPTZStarted(false);
                    setPTZPan(0);
                    setPTZStartX(0);
                    sendCommand(`#ch_ptz pan ${ptzPan * 10}`);
                }
            }}
            onMouseMove={(e) => {
                if (isPTZStarted) {
                    setPTZPan(e.clientX - ptzStartX);
                }
            }}>
            {/* Live */}
            <div ref={videoContainerRef} hidden={!(mode == VideoPanelMode.Stream && isVideoAttached)} style={{ width: '100%', height: '100%' }} />
            {/* <img src="https://thumbs.dreamstime.com/b/connection-concept-glitch-noise-distortion-connection-concept-glitch-noise-distortion-k-video-191192846.jpg" alt="no signal" hidden={!(mode == VideoPanelMode.Stream && !isVideoAttached)} /> */}
            {/* <div  hidden={!(mode == VideoPanelMode.Stream && isVideoAttached && !isFullyVisible())} /> */}

            {/* <img style={{ width: '100%', height: '100%', }} src="https://www.shutterstock.com/image-illustration/3d-rendering-no-signal-text-260nw-2434845591.jpg" alt="no signal" hidden={!(mode == VideoPanelMode.Stream && !isVideoAttached)} /> */}
            {/* <img style={{ width: '100%', height: '100%', }} src="https://www.shutterstock.com/image-illustration/tv-background-error-design-video-260nw-2052395315.jpg" alt="no signal" hidden={!(mode == VideoPanelMode.Stream && !isVideoAttached)}/> */}

            {/* Timelapse */}
            {/* <iframe title={props.camId} src="timelapse" style={{ width: '100%', height: '100%', }} hidden={!(mode == VideoPanelMode.Timelapse)} /> */}
            <Timelapse camId={""} hidden={!(mode == VideoPanelMode.Timelapse)} />

            {/* Static */}
            <img src="https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1729332612/1729332601_2024-10-19_18-10-01.jpg" alt="static" hidden={!(mode == VideoPanelMode.Static)} />

            {/* Control */}
            <div className="top-right text-shadow">
                <button onClick={() => {
                    const context = new AudioContext();
                    context.resume();
                    context.state === "running" ? console.log("audio context running") :
                        context.state === "suspended" ? console.log("audio context suspended") :
                            context.state === "closed" ? console.log("audio context closed") :
                                console.log("audio context unknown");
                    console.log("audio context resumed");
                    const stream = client.current.getMediaStream()
                    stream.startAudio({
                        originalSound: {
                            stereo: true,
                            hifi: true,
                        }, speakerOnly: true,
                    });
                    stream.unmuteAllAudio();
                    stream.unmuteAllUserAudioLocally();
                }}><p className={mode != VideoPanelMode.Stream ? "text-shadow" : "red-glow"}>Audio</p></button><br />
                <button onClick={() => setMode(VideoPanelMode.Stream)}><p className={mode != VideoPanelMode.Stream ? "text-shadow" : "red-glow"}>Live</p></button><br />
                <button onClick={() => setMode(VideoPanelMode.Static)}><p className={mode != VideoPanelMode.Static ? "text-shadow" : "yellow-glow"}>Snapshot</p></button><br />
                <button onClick={() => setMode(VideoPanelMode.Timelapse)}><p className={mode != VideoPanelMode.Timelapse ? "text-shadow" : "yellow-glow"}>Timelapse</p></button><br />
                <button onClick={() => {
                    if (myRef.current) {
                        if (document.fullscreenElement) {
                            document.exitFullscreen();
                        } else {
                            document.documentElement.requestFullscreen();
                        }
                    }
                }}><p className={mode != VideoPanelMode.Timelapse ? "text-shadow" : "yellow-glow"}>Fullscreen</p></button>
            </div>

            {/* PTZ */}
            <div className="bottom-center text-shadow">
                <button
                    onMouseDown={(e) => {
                        setPTZStartX(e.clientX);
                        setIsPTZStarted(true);
                    }}
                // onMouseUp={() => {
                //     if (isPTZStarted) {
                //         console.log("%%%%%%%%%%##Send PTZ Command");
                //         setIsPTZStarted(false);
                //     }
                // }}
                ><p>PTZ:{ptzPan}</p></button>
            </div>

            {/* Label */}
            <div className="bottom-right text-shadow">t:{currentRect?.top} b:{currentRect?.bottom} {props.camId} {userId} {isVideoAttached ? "attached" : "detached"}</div>
        </div>
    );
}