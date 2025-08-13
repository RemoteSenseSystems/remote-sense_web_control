'use client'

import { useEffect, useState } from "react";

const Timelapse = (props: { camId: string, speedTimes?: number, hidden?: boolean }) => {

    const [currentIntervalId, setCurrentIntervalId] = useState(0);
    const [currentInterval, setCurrentInterval] = useState(0);
    const [requestImageListFailed, setRequestImageListFailed] = useState(false);
    const [imageFound, setImageFound] = useState(0);
    const [imagesList, setImagesList] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [indexOverride, setIndexOverride] = useState(-1);
    const [preloadImageAmout, setPreloadImageAmout] = useState(0);
    const [isPreloading, setIsPreloading] = useState(false);
    const times = props.speedTimes ?? 1000; // default 3000 times faster
    const interval = (1000 * 60 * 5) / times;  // 5 minutes = 1000*60*5, 3000 times faster

    const camAngleNumber = 9; 

    const preloadImages = (array: string[]) => {
        for (var i = 0; i < array.length; i++) {
            var img = document.createElement("img");
            img.onload = function () {
                setPreloadImageAmout(state => state + 1);
            }
            img.src = array[i];
            img.alt = "preload";
        }
    }

    const loadImageList = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            // "expression": "resource_type=image AND uploaded_at>24h AND asset_folder=timelapse AND type=upload",
            "expression": "resource_type=image AND asset_folder=timelapse AND type=upload",
            "sort_by": [
                {
                    "created_at": "desc"
                }
            ],
            "fields": [
                "secure_url"
            ],
            "max_results": (60/5*3+10)* camAngleNumber, // 3 hours, 60 minutes / 5 minutes per image * 3 images per angle + 10 extra images
        });

        const response = await fetch("/cld/v1_1/dn9rloq0x/resources/search", {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        });

        if (!response.ok) {
            console.log("response not ok");
            return;
        }
        const json = await response.json();
        // check if json has resources
        if (json.error) {
            console.log("Error:", json.error.message);
            setRequestImageListFailed(true);
            return;
        }
        json.resources.forEach((element: { secure_url: string; }) => {
            if (element.secure_url.includes("main") || element.secure_url.includes("cam0_1753")) {
                setImagesList(state => [...state, element.secure_url.replace("image/upload", "image/upload/h_360")]);
            }
        }
        );
        setImageFound(json.resources.length);
    }

    useEffect(() => {
        if (imageFound == 0 && !requestImageListFailed) {
            loadImageList();
        };

        if (!isPreloading && imageFound != 0 && imagesList.length == imageFound / camAngleNumber) {
            preloadImages(imagesList);
            setIsPreloading(true);
        }
    }, [imageFound, requestImageListFailed]);

    useEffect(() => {
        if (imagesList.length != 0 && isImagePreloadEnough()) {
            if (currentIntervalId != 0) {
                console.log("*********clear interval", currentIntervalId);
                clearInterval(currentIntervalId);
            }
            if (!props.hidden) {
                console.log("******set interval", interval);
                const intervalID = setInterval(() => {
                    setCurrentIndex(state => (state + 1) % imagesList.length);
                }, interval);
                console.log("******set intervalID", intervalID);
                setCurrentIntervalId(intervalID as unknown as number); // linanw: if here is a type error, please ignore it, it's not valid.
                setCurrentInterval(interval);
            }
        }
    }, [props.speedTimes, preloadImageAmout, props.hidden]
    );

    const isImagePreloadEnough = () => (preloadImageAmout >= imagesList.length * 0.6);

    return (<div className="container" hidden={props.hidden ?? false}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <img className="timelapse"
            draggable="false"
            onContextMenu={(event) => {
                event.preventDefault();
                return false;
            }}
            onTouchStart={() => setIndexOverride(0)}
            onTouchMove={(event) => {
                const screenWidth = window.innerWidth;
                const touchX = event.touches[0].clientX;
                const touchControlAreaPercentage = 0.7;
                var newIndex = Math.floor(((touchX - screenWidth * (1 - touchControlAreaPercentage) / 2) / screenWidth / touchControlAreaPercentage) * imagesList.length);
                if (newIndex < 0) newIndex = 0;
                if (newIndex >= imagesList.length) newIndex = imagesList.length - 1;
                setIndexOverride(imagesList.length - 1 - newIndex);

            }}
            onTouchEnd={() => setIndexOverride(-1)}
            onMouseDown={() => setIndexOverride(0)}
            onMouseMove={(event) => {
                const screenWidth = window.innerWidth;
                const touchX = event.clientX;
                const touchControlAreaPercentage = 0.7;
                var newIndex = Math.floor(((touchX - screenWidth * (1 - touchControlAreaPercentage) / 2) / screenWidth / touchControlAreaPercentage) * imagesList.length);
                if (newIndex < 0) newIndex = 0;
                if (newIndex >= imagesList.length) newIndex = imagesList.length - 1;
                setIndexOverride(imagesList.length - 1 - newIndex);

            }}
            onMouseUp={() => setIndexOverride(-1)}
            onMouseLeave={() => setIndexOverride(-1)}
            width="100%"
            height="100%"
            src={
                indexOverride != -1
                    ? imagesList[indexOverride]
                    : isImagePreloadEnough() ? imagesList[imagesList.length - 1 - currentIndex] : imagesList[0]
            }
            sizes="100vw"
            alt="Timelapse"
        />
        <div className="top-left text-shadow"> Image: {imageFound}, Preload: {imagesList.length == 0 ? 0 : Math.floor((preloadImageAmout / imagesList.length) * 100)}%
            Speed: {times}x</div></div>)
}

export default Timelapse;
