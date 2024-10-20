import { MutableRefObject, use, useEffect, useRef, useState } from "react";
import Timelapse from "./Timelapse";
import {
    VideoClient,
    VideoQuality,
    type VideoPlayer,
} from "@zoom/videosdk";
import { user } from "@nextui-org/theme";

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
    onControlCommand?: () => void,
}) => {
    const client = props.videoClient;
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<VideoPanelMode>(props.mode ?? VideoPanelMode.Stream);
    const [userId, setUserId] = useState<number>(0);
    useEffect(() => {
        console.log("###############*************useEffect, camId", props.camId);
        client.current.on("peer-video-state-change", async (payload: { action: "Start" | "Stop", userId: number; }) => {
            // console.log("total users: ", client.current.getAllUser().length);
            // console.log("peer-video-state-change", payload);
            const action = payload.action;
            const userId_ = payload.userId;
            const mediaStream = client.current.getMediaStream();
            if (action === "Start") {
                const camId = client.current.getUser(userId_)?.displayName;
                if (camId && camId === props.camId) {
                    console.log("**************attaching", camId, userId_);
                    const result = await mediaStream.attachVideo(userId_, VideoQuality.Video_360P);
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
                        console.log("**************attached!!!", camId, userId_);
                    }
                    else {
                        console.log("videoContainerRef.current is null");
                    }
                    setUserId(userId_);
                }
            } else if (action === "Stop") {
                if (videoContainerRef.current &&
                    videoContainerRef.current.children.length > 0 &&
                    (videoContainerRef.current.children[0].getAttribute("node-id") ?? 0) == userId_) {
                    console.log("**************detaching", userId_);
                    videoContainerRef.current.children[0].remove();
                    const element = await mediaStream.detachVideo(userId);
                    console.log("element: ", element);  
                    Array.isArray(element)
                        ? element.forEach((el) => el.remove())
                        : element ? element.remove() : null;
                    setUserId(0);
                }
            }
        }
        );
    }, [props.camId]);

    // console.log("******* videoPlayer", videoPlayer);
    // console.log("******* videoContainerRef.current", videoContainerRef.current);
    // videoPlayer && videoContainerRef.current?.appendChild(videoPlayer);
    const isVideoAttached = (videoContainerRef.current != undefined && videoContainerRef.current.children.length > 0);
    // !isVideoAttached && userId != 0 && setUserId(0);
    console.log("******* videoContainerRef.current", videoContainerRef.current?.children.length, isVideoAttached, userId);

    return (
        <div className="cam-panal-container">
            {/* Stream */}
            <div ref={videoContainerRef} hidden={!(mode == VideoPanelMode.Stream && isVideoAttached)} />
            <img style={{ width: '100%', height: '100%', }} src="https://thumbs.dreamstime.com/b/connection-concept-glitch-noise-distortion-connection-concept-glitch-noise-distortion-k-video-191192846.jpg" alt="no signal" hidden={!(mode == VideoPanelMode.Stream && !isVideoAttached)} />
            {/* <img style={{ width: '100%', height: '100%', }} src="https://www.shutterstock.com/image-illustration/3d-rendering-no-signal-text-260nw-2434845591.jpg" alt="no signal" hidden={!(mode == VideoPanelMode.Stream && !isVideoAttached)} /> */}
            {/* <img style={{ width: '100%', height: '100%', }} src="https://www.shutterstock.com/image-illustration/tv-background-error-design-video-260nw-2052395315.jpg" alt="no signal" hidden={!(mode == VideoPanelMode.Stream && !isVideoAttached)}/> */}

            {/* Timelapse */}
            {/* <iframe title={props.camId} src="timelapse" style={{ width: '100%', height: '100%', }} hidden={!(mode == VideoPanelMode.Timelapse)} /> */}
            <Timelapse camId={""} hidden={!(mode == VideoPanelMode.Timelapse)} />

            {/* Static */}
            <img style={{ width: '100%', height: '100%', }} src="https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1729332612/1729332601_2024-10-19_18-10-01.jpg" alt="static" hidden={!(mode == VideoPanelMode.Static)} />

            {/* Control */}
            <div className="top-right text-shadow">
                <button onClick={() => setMode(VideoPanelMode.Stream)}><p className={mode != VideoPanelMode.Stream ? "text-shadow" : "red-glow"}>Live</p></button><br />
                <button onClick={() => setMode(VideoPanelMode.Static)}><p className={mode != VideoPanelMode.Static ? "text-shadow" : "yellow-glow"}>Snapshot</p></button><br />
                <button onClick={() => setMode(VideoPanelMode.Timelapse)}><p className={mode != VideoPanelMode.Timelapse ? "text-shadow" : "yellow-glow"}>Timelapse</p></button>
            </div>

            {/* Label */}
            <div className="bottom-right text-shadow"> {props.camId} {userId} {isVideoAttached ? "attached" : "detached"}</div>
        </div>
    );
}