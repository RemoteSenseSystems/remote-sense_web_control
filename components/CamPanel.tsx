import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Timelapse from "./Timelapse";
import {
    VideoClient,
    VideoQuality,
    type VideoPlayer,
} from "@zoom/videosdk";
import { viewport } from "@/app/(default)/layout";

export enum VideoPanelMode {
    Stream = 'stream',
    Timelapse = 'timelapse',
    Static = 'static',
}

const ptzThreshold = 5;
const ptzPanMax = 90;
const ptzTiltMax = 90;

export const CamPanel = (props: {
    videoClient: MutableRefObject<typeof VideoClient>,
    camId: string,
    mode?: VideoPanelMode,
    className?: string,
    height: string,
    page: number,
    alwaysAttach?: boolean,
    justifyContent: string,
    viewportChanged: number,
    onControlCommand?: () => void,
}) => {
    const client = props.videoClient;
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<VideoPanelMode>(props.mode ?? VideoPanelMode.Static);
    const [userId, setUserId] = useState<number>(0);
    const [isVideoAttached, setIsVideoAttached] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isPTZStarted, setIsPTZStarted] = useState(false);
    const [ptzStartX, setPTZStartX] = useState(0);
    const [ptzStartY, setPTZStartY] = useState(0);
    const [ptzPan, setPTZPan] = useState(0);
    const [ptzTilt, setPTZTilt] = useState(0);
    const [videoStarts, setVideoStarts] = useState(0);
    const myRef = useRef<HTMLDivElement>(null);
    const videoStartsRef = useRef(videoStarts);
    videoStartsRef.current = videoStarts;

    const sendCommand = async (command: string) => {
        await client.current.getCommandClient().send(command, userId);
    }

    useEffect(() => {
        client.current.on("peer-video-state-change", async (payload: { action: "Start" | "Stop", userId: number; }) => {
            const action = payload.action;
            const userId_ = payload.userId;
            if (action === "Start") {
                const camId = client.current.getUser(userId_)?.displayName;
                if (camId && camId === props.camId) {
                    if (userId != userId_) setUserId(userId_);
                    setVideoStarts(videoStartsRef.current + 1);
                }
            } else if (action === "Stop") {
                if (videoContainerRef.current &&
                    videoContainerRef.current.children.length > 0 &&
                    (videoContainerRef.current.children[0].getAttribute("node-id") ?? 0) == userId_) {
                    setUserId(0);
                }
            }
        })
    }, [props.camId]);

    const attachVideo = async () => {
        const mediaStream = client.current.getMediaStream();
        const result = await mediaStream.attachVideo(userId, VideoQuality.Video_360P); // linanw: set 360 but the actual first video quality is 720p
        const videoPlayer = result as VideoPlayer;
        if (videoContainerRef.current) {
            var tempList: Element[] = [];
            for (var i = 0; i < videoContainerRef.current.children.length; i++) {
                tempList.push(videoContainerRef.current.children[i]);
                // videoContainerRef.current.children[i].remove();
            }
            videoContainerRef.current.appendChild(videoPlayer);
            for (var i = 0; i < tempList.length; i++) {
                tempList[i].remove();
            }
        }
    }

    const detachVideo = async () => {
        if (videoContainerRef.current &&
            videoContainerRef.current.children.length > 0 &&
            (videoContainerRef.current.children[0].getAttribute("node-id") ?? 0) == userId) {
            const mediaStream = client.current.getMediaStream();
            videoContainerRef.current.children[0].remove();
            const elements = await mediaStream.detachVideo(userId);
            if (Array.isArray(elements)) {
                elements.forEach((e) => e.remove());
            } else {
                elements.remove();
            }
        }
    }

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

    useEffect(() => {
        if (userId > 0 && (isVisible || props.alwaysAttach)) { // && isVisible) { // linanw: old code to detach video when not visible, but buggy.
            if (!isVideoAttached) {
                attachVideo();
                setIsVideoAttached(true);
            }
        } else {
            detachVideo();
            if (isVideoAttached) setIsVideoAttached(false);
        }
    }, [userId, videoStarts, isVisible]);

    useEffect(() => {
        const isVisible_ = elementIsVisibleInViewport(myRef.current!.getBoundingClientRect(), true)
        if (isVisible_ != isVisible) {
            setIsVisible(isVisible_);
        }
    }, [props.page, props.height, props.viewportChanged, props.justifyContent]);

    if (userId == 0) {
        client.current.getAllUser().forEach((user) => {
            const camId = user.displayName;
            if (camId && camId === props.camId) {
                setUserId(user.userId);
            }
        });
    }

    return (
        <div className={props.className}
            style={{ height: props.height }}
            id={"cam-panal-container_" + props.camId}
            ref={myRef}
            role="presentation"
            onMouseDown={(e) => {
                if (e.button > 0) return;
                document.getElementsByTagName("body")[0].style.cursor = "none";
                setPTZStartX(e.clientX);
                setPTZStartY(e.clientY);
                setIsPTZStarted(true);
            }}
            onMouseUp={(e) => {
                if (isPTZStarted) {
                    document.getElementsByTagName("body")[0].style.cursor = "auto";
                    sendCommand(`#ch_ptz pan ${ptzPan * 10} tilt ${ptzTilt * 10}`);
                    setIsPTZStarted(false);
                    setPTZPan(0);
                    setPTZStartX(0);
                    setPTZTilt(0);
                    setPTZStartY(0);
                }
            }}
            onMouseMove={(e) => {
                if (isPTZStarted) {
                    var pan = e.clientX - ptzStartX;
                    var tilt = e.clientY - ptzStartY;
                    Math.abs(pan) >= ptzThreshold ? pan > 0 ? pan -= ptzThreshold : pan += ptzThreshold : pan = 0;
                    Math.abs(tilt) >= ptzThreshold ? tilt > 0 ? tilt -= ptzThreshold : tilt += ptzThreshold : tilt = 0;
                    pan = Math.floor(pan / 2);
                    tilt = Math.floor(tilt / 1.5);
                    pan > ptzPanMax ? pan = ptzPanMax : pan < -ptzPanMax ? pan = -ptzPanMax : pan;
                    tilt > ptzTiltMax ? tilt = ptzTiltMax : tilt < -ptzTiltMax ? tilt = -ptzTiltMax : tilt;

                    const ptzVerticalLine = document.getElementById("ptzVerticallLine_" + props.camId);
                    const width = ptzVerticalLine?.parentElement?.offsetWidth;
                    if (ptzVerticalLine) {
                        ptzVerticalLine.style.transform = `translateX(` + (pan / 60 * (width ?? 0)) + `px)`;
                    }
                    const ptzHorizontalLine = document.getElementById("ptzHorizontalLine_" + props.camId);
                    const height = ptzHorizontalLine?.parentElement?.offsetHeight;
                    if (ptzHorizontalLine) {
                        ptzHorizontalLine.style.transform = `translateY(` + (tilt / 35 * (height ?? 0)) + `px)`;
                    }
                    setPTZPan(pan);
                    setPTZTilt(tilt);
                }
            }}
            onMouseLeave={(e) => {
                if (isPTZStarted) {
                    document.getElementsByTagName("body")[0].style.cursor = "auto";
                    setIsPTZStarted(false);
                    setPTZPan(0);
                    setPTZStartX(0);
                    setPTZTilt(0);
                    setPTZStartY(0);
                }
            }}>
            {/* Live */}
            <div className="fill" ref={videoContainerRef} hidden={!(mode == VideoPanelMode.Stream && isVideoAttached)} />
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
            <div className="top-right text-shadow" role="presentation"
                onMouseDown={(e) => {
                    0
                    e.stopPropagation();
                }}>
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
                }}><p className={"red-glow"}>Audio</p></button><br />
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
                }}><p className={"text-shadow"}>Fullscreen</p></button>
            </div>

            {/* PTZ Arrows */}
            <div className="arrow-box-left text-shadow" hidden={ptzPan > 0 || (ptzStartX == 0 && ptzStartY == 0)}><img src="/arrow.png" alt="left" className="arrow-left" draggable={false} />{ptzPan == 0 ? "" : ptzPan}</div>
            <div className="arrow-box-right text-shadow" hidden={ptzPan < 0 || (ptzStartX == 0 && ptzStartY == 0)}>{ptzPan == 0 ? "" : ptzPan}<img src="/arrow.png" alt="right" className="arrow-right" draggable={false} /></div>
            <div className="arrow-box-up text-shadow" hidden={ptzTilt > 0 || (ptzStartX == 0 && ptzStartY == 0)}><img src="/arrow.png" alt="up" className="arrow-up" draggable={false} />{ptzTilt == 0 ? "" : ptzTilt}</div>
            <div className="arrow-box-down text-shadow" hidden={ptzTilt < 0 || (ptzStartX == 0 && ptzStartY == 0)}>{ptzTilt == 0 ? "" : ptzTilt}<img src="/arrow.png" alt="down" className="arrow-down" draggable={false} /></div>
            <div id={"ptzVerticallLine_" + props.camId} className="ptz-vertical-line" hidden={!isPTZStarted}></div>
            <div id={"ptzHorizontalLine_" + props.camId} className="ptz-horizontal-line" hidden={!isPTZStarted}></div>

            {/* Label */}
            <div className="bottom-right text-shadow">
                {props.camId}
                {/* {userId} */}
                page: {props.page}
                <span className={isVideoAttached ? "green" : "gray"}>●</span>
                <span className={isVisible ? "green" : "gray"}>●</span>
            </div>
        </div>
    );
}  