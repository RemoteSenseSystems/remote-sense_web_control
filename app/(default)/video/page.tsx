'use client'

import { title } from "@/components/primitives";
import { useEffect } from "react";
import ZoomVideo from "@zoom/videosdk";
import { KJUR } from 'jsrsasign';

export function generateVideoToken(
    sdkKey: string,
    sdkSecret: string,
    topic: string,
    sessionKey = '',
    userIdentity = '',
    roleType = 1,
    cloud_recording_option = '',
    cloud_recording_election = '',
    telemetry_tracking_id = ''
  ) {
    let signature = '';
    try {
      const iat = Math.round(new Date().getTime() / 1000) - 30;
      const exp = iat + 60 * 60 * 2;
  
      // Header
      const oHeader = { alg: 'HS256', typ: 'JWT' };
      // Payload
      const oPayload = {
        app_key: sdkKey,
        iat,
        exp,
        tpc: topic,
        role_type: roleType
      };
      if (cloud_recording_election === '' && cloud_recording_option === '1') {
        Object.assign(oPayload, {
          cloud_recording_option: 1
        });
      } else {
        Object.assign(oPayload, {
          cloud_recording_option: parseInt(cloud_recording_option, 10),
          cloud_recording_election: parseInt(cloud_recording_election, 10)
        });
      }
      if (sessionKey) {
        Object.assign(oPayload, { session_key: sessionKey });
      }
      if (userIdentity) {
        Object.assign(oPayload, { user_identity: userIdentity });
      }
  
      if (telemetry_tracking_id) {
        Object.assign(oPayload, { telemetry_tracking_id });
      }
      // Sign JWT
      const sHeader = JSON.stringify(oHeader);
      const sPayload = JSON.stringify(oPayload);
      signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
    } catch (e) {
      console.error(e);
    }
    return signature;
  }

export default function VideoPage() {
useEffect(() => {
    const client = ZoomVideo.createClient();
    client.init("en-US", "CDN");
    const token = generateVideoToken(
        process.env.NEXT_PUBLIC_ZOMM_VIDEO_SDK_KEY || '',
        process.env.NEXT_PUBLIC_ZOMM_VIDEO_SDK_SECRET || '',
        "New",
        "",
        ""
    )
    console.log(token);
    client.join(
        "New",
        token,
        "web1",
        "1234"
    )
        .then(() => {
            console.log("Joined meeting successfully");
        })
        .catch((error) => {
            console.error("Failed to join meeting", error);
        });

    return () => {
        client.leave();
    };
}, []);
  return <div id="zoom-meeting"></div>;
}
