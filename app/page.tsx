'use client'

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { useEffect, useState } from "react";

export default function Home() {
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const [requestImageListFailed, setRequestImageListFailed] = useState(false);
  const [imageFound, setImageFound] = useState(0);
  const [images_list, setImagesList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [indexOverride, setIndexOverride] = useState(-1);
  const [preloadImageAmout, setPreloadImageAmout] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const intervalTime = 200;  // 1000 milliseconds = 1 second

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
      "expression": "resource_type=image AND uploaded_at>24h AND asset_folder=timelapse AND type=upload",
      "sort_by": [
        {
          "created_at": "desc"
        }
      ],
      "fields": [
        "secure_url"
      ],
      "max_results": 100
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
      setImagesList(state => [...state, element.secure_url.replace("image/upload", "image/upload/h_360")]);
    }
    );
    setImageFound(json.resources.length);
  }

  useEffect(() => {
    console.log("***useEffect");
    console.log("***imageFound: " + imageFound);
    console.log("***images_list.length: " + images_list.length);
    console.log("***currentIndex: " + currentIndex);
    console.log("***preloadImageAmout: " + preloadImageAmout);
    console.log("***isPreloading: " + isPreloading);
    console.log("***requestImageListFailed: " + requestImageListFailed);

    if (imageFound == 0 && !requestImageListFailed) {
      console.log("###***loadImageList");
      loadImageList();
    };

    if (!isPreloading && imageFound != 0 && images_list.length == imageFound) {
      console.log("###***preloadImages");
      preloadImages(images_list);
      setIsPreloading(true);
    }

    if (!isIntervalSet && images_list.length != 0 && preloadImageAmout >= images_list.length * 0.6) {
      console.log("###***setInterval");
      setIsIntervalSet(true);
      setInterval(() => {
        setCurrentIndex(state => (state + 1) % images_list.length);
      }, intervalTime);
    }
  }
  );

  const isImagePreloadEnough = () => (preloadImageAmout >= images_list.length * 0.6);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Make&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
        <br />
        <h1 className={title()}>
          websites regardless of your design experience.
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
        </h2>
      </div>
      Image Found: {imageFound}<br />
      Preload Progress: {images_list.length == 0 ? 0 : Math.floor((preloadImageAmout / images_list.length) * 100)}%<br />
      <img
        onContextMenu={(event) => {
          event.preventDefault();
          return false;
        }}
        onTouchStart={() => setIndexOverride(0)}
        onTouchMove={(event) => {
          // get where I'm touching
          console.log("****$$$" + event.touches[0].clientX);
          // screen width
          const screenWidth = window.innerWidth;
          const touchX = event.touches[0].clientX;
          const newIndex = Math.floor((touchX / screenWidth) * images_list.length);
          setIndexOverride(newIndex);
          // calculate the index
          // set the index
        }}
        onTouchEnd={() => setIndexOverride(-1)}
        width="1920"
        height="1080"
        src={
          indexOverride != -1
            ? images_list[indexOverride]
            : isImagePreloadEnough() ? images_list[images_list.length - 1 - currentIndex] : images_list[0]
        }
        sizes="100vw"
        alt="Timelapse"
      />
      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
