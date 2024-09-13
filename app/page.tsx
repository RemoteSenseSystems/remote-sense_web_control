'use client'

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { useEffect, useState } from "react";

const images_list = [
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213683/1726102259_2024-09-12_08-50-59.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213686/1726102329_2024-09-12_08-52-09.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213689/1726102354_2024-09-12_08-52-34.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213691/1726102395_2024-09-12_08-53-15.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213694/1726144105_2024-09-12_20-28-25.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213697/1726144201_2024-09-12_20-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213699/1726144501_2024-09-12_20-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213702/1726144801_2024-09-12_20-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213705/1726145101_2024-09-12_20-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213708/1726145401_2024-09-12_20-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213710/1726145701_2024-09-12_20-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213713/1726146001_2024-09-12_21-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213716/1726146301_2024-09-12_21-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213718/1726146602_2024-09-12_21-10-02.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213721/1726146901_2024-09-12_21-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213723/1726147201_2024-09-12_21-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213726/1726147501_2024-09-12_21-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213728/1726147801_2024-09-12_21-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213731/1726148101_2024-09-12_21-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213733/1726148401_2024-09-12_21-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213736/1726148701_2024-09-12_21-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213738/1726149001_2024-09-12_21-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213741/1726149301_2024-09-12_21-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213744/1726149601_2024-09-12_22-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213747/1726149901_2024-09-12_22-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213749/1726150002_2024-09-12_22-06-42.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213752/1726156594_2024-09-12_23-56-34.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213754/1726156641_2024-09-12_23-57-21.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213757/2024-09-12_00-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213759/2024-09-12_00-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213761/2024-09-12_00-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213763/2024-09-12_00-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213766/2024-09-12_00-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213768/2024-09-12_00-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213771/2024-09-12_00-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213774/2024-09-12_00-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213776/2024-09-12_00-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213778/2024-09-12_00-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213781/2024-09-12_00-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213783/2024-09-12_00-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213785/2024-09-12_01-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213787/2024-09-12_01-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213790/2024-09-12_01-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213792/2024-09-12_01-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213794/2024-09-12_01-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213797/2024-09-12_01-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213799/2024-09-12_01-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213801/2024-09-12_01-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213803/2024-09-12_01-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213806/2024-09-12_01-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213808/2024-09-12_01-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213810/2024-09-12_01-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213812/2024-09-12_02-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213815/2024-09-12_02-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213817/2024-09-12_02-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213819/2024-09-12_02-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213822/2024-09-12_02-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213824/2024-09-12_02-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213826/2024-09-12_02-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213828/2024-09-12_02-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213831/2024-09-12_02-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213833/2024-09-12_02-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213835/2024-09-12_02-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213837/2024-09-12_02-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213840/2024-09-12_03-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213842/2024-09-12_03-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213844/2024-09-12_03-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213847/2024-09-12_03-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213849/2024-09-12_03-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213851/2024-09-12_03-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213853/2024-09-12_03-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213856/2024-09-12_03-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213858/2024-09-12_03-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213860/2024-09-12_03-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213862/2024-09-12_03-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213865/2024-09-12_03-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213867/2024-09-12_04-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213869/2024-09-12_04-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213871/2024-09-12_04-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213873/2024-09-12_04-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213876/2024-09-12_04-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213878/2024-09-12_04-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213880/2024-09-12_04-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213882/2024-09-12_04-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213885/2024-09-12_04-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213887/2024-09-12_04-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213890/2024-09-12_04-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213892/2024-09-12_04-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213894/2024-09-12_05-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213896/2024-09-12_05-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213899/2024-09-12_05-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213901/2024-09-12_05-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213903/2024-09-12_05-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213905/2024-09-12_05-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213908/2024-09-12_05-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213910/2024-09-12_05-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213912/2024-09-12_05-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213915/2024-09-12_05-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213917/2024-09-12_05-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213919/2024-09-12_05-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213921/2024-09-12_06-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213924/2024-09-12_06-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213926/2024-09-12_06-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213928/2024-09-12_06-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213930/2024-09-12_06-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213933/2024-09-12_06-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213935/2024-09-12_06-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213937/2024-09-12_06-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213940/2024-09-12_06-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213943/2024-09-12_06-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213945/2024-09-12_06-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213948/2024-09-12_06-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213950/2024-09-12_07-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213952/2024-09-12_07-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213954/2024-09-12_07-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213957/2024-09-12_07-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213959/2024-09-12_07-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213961/2024-09-12_07-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213963/2024-09-12_07-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213965/2024-09-12_07-35-02.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213967/2024-09-12_07-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213970/2024-09-12_07-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213972/2024-09-12_07-50-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213975/2024-09-12_07-55-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213977/2024-09-12_08-00-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213979/2024-09-12_08-05-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213983/2024-09-12_08-10-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213986/2024-09-12_08-15-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213988/2024-09-12_08-20-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213990/2024-09-12_08-25-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213993/2024-09-12_08-30-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213996/2024-09-12_08-35-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213998/2024-09-12_08-40-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726214000/2024-09-12_08-45-01.jpg",
  "http://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726214003/2024-09-12_08-50-10.jpg",
];



export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    if (!isPreloading) {
      preloadImages(images_list);
      setIsPreloading(true);
    }

    if (currentIndex == 0 && preloadImageAmout >= images_list.length) {
      setInterval(() => {
        setCurrentIndex(state => state + 1);
      }, intervalTime);
    }
  }
  );

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
      {preloadImageAmout / images_list.length * 100}%
      <img
        width="1920"
        height="1080"
        src={preloadImageAmout == images_list.length ? images_list[currentIndex % images_list.length] : images_list[images_list.length - 1]}
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
