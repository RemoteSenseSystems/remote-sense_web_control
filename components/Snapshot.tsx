'use client'

import { useEffect, useState } from "react";

const Snapshot = (props: { hidden?: boolean }) => {

    const [snapshotUrl, setSnapshotUrl] = useState("");
    const [intervalId, setIntervalId] = useState(0);
    const interval = 1000 * 60 * 1; // 1 minute

    useEffect(() => {
        console.log("useEffect");
        if (intervalId === 0) {
            loadImage();
            console.log("Setting interval for snapshot image loading...");
            const id = setInterval(() => {
                console.log("Loading snapshot image...");
                loadImage();
            }, interval);
            setIntervalId(id as unknown as number);
        }
    }, [intervalId]);

    const loadImage = async () => {
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
            "max_results": 144 // use the same max_results as in Timelapse component, the result is cached in middleware for reuse.
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
            return;
        }
        const element = json.resources[0];
        setSnapshotUrl(element.secure_url);
    }
    return <div hidden={props.hidden}><img alt="Snapshot" src={snapshotUrl} /></div>
}
export default Snapshot;
