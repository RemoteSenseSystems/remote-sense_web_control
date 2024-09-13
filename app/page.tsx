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
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726248004/1726248001_2024-09-14_01-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726247704/1726247701_2024-09-14_01-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726247404/1726247401_2024-09-14_01-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726247104/1726247101_2024-09-14_01-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726246804/1726246801_2024-09-14_01-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726246505/1726246501_2024-09-14_00-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726246205/1726246201_2024-09-14_00-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726245905/1726245901_2024-09-14_00-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726245604/1726245601_2024-09-14_00-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726245304/1726245301_2024-09-14_00-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726245004/1726245001_2024-09-14_00-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726244704/1726244701_2024-09-14_00-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726244405/1726244401_2024-09-14_00-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726244104/1726244101_2024-09-14_00-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726243805/1726243801_2024-09-14_00-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726243505/1726243501_2024-09-14_00-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726243205/1726243201_2024-09-14_00-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726242904/1726242901_2024-09-13_23-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726242605/1726242601_2024-09-13_23-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726242304/1726242301_2024-09-13_23-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726242005/1726242001_2024-09-13_23-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726241704/1726241701_2024-09-13_23-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726241404/1726241401_2024-09-13_23-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726241105/1726241101_2024-09-13_23-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726240804/1726240801_2024-09-13_23-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726240504/1726240501_2024-09-13_23-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726240204/1726240201_2024-09-13_23-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726239904/1726239901_2024-09-13_23-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726239604/1726239601_2024-09-13_23-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726239304/1726239301_2024-09-13_22-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726239004/1726239001_2024-09-13_22-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726238704/1726238701_2024-09-13_22-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726238405/1726238401_2024-09-13_22-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726238104/1726238101_2024-09-13_22-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726237805/1726237801_2024-09-13_22-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726237505/1726237501_2024-09-13_22-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726237204/1726237201_2024-09-13_22-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726236905/1726236901_2024-09-13_22-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726236604/1726236601_2024-09-13_22-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726236305/1726236301_2024-09-13_22-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726236005/1726236002_2024-09-13_22-00-02.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726235705/1726235701_2024-09-13_21-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726235404/1726235401_2024-09-13_21-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726235104/1726235101_2024-09-13_21-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726234804/1726234801_2024-09-13_21-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726234504/1726234501_2024-09-13_21-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726234204/1726234201_2024-09-13_21-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726233904/1726233901_2024-09-13_21-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726233604/1726233601_2024-09-13_21-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726233304/1726233301_2024-09-13_21-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726233005/1726233001_2024-09-13_21-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726232704/1726232701_2024-09-13_21-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726232405/1726232401_2024-09-13_21-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726232104/1726232101_2024-09-13_20-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726231804/1726231801_2024-09-13_20-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726231504/1726231501_2024-09-13_20-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726231205/1726231202_2024-09-13_20-40-02.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726230905/1726230901_2024-09-13_20-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726230605/1726230601_2024-09-13_20-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726230304/1726230301_2024-09-13_20-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726230004/1726230001_2024-09-13_20-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726229705/1726229701_2024-09-13_20-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726229407/1726229401_2024-09-13_20-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726229105/1726229101_2024-09-13_20-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726228804/1726228801_2024-09-13_20-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726228504/1726228501_2024-09-13_19-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726228204/1726228201_2024-09-13_19-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726227904/1726227901_2024-09-13_19-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726227604/1726227601_2024-09-13_19-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726227304/1726227301_2024-09-13_19-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726227004/1726227001_2024-09-13_19-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726226704/1726226701_2024-09-13_19-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726226405/1726226401_2024-09-13_19-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726226105/1726226101_2024-09-13_19-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726225805/1726225801_2024-09-13_19-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726225504/1726225501_2024-09-13_19-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726225204/1726225201_2024-09-13_19-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726224904/1726224901_2024-09-13_18-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726224604/1726224601_2024-09-13_18-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726224304/1726224301_2024-09-13_18-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726224004/1726224001_2024-09-13_18-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726223705/1726223701_2024-09-13_18-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726223404/1726223401_2024-09-13_18-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726223104/1726223101_2024-09-13_18-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726222804/1726222801_2024-09-13_18-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726222504/1726222501_2024-09-13_18-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726222204/1726222201_2024-09-13_18-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726221904/1726221901_2024-09-13_18-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726221604/1726221601_2024-09-13_18-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726221305/1726221301_2024-09-13_17-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726221004/1726221001_2024-09-13_17-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726220704/1726220701_2024-09-13_17-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726220404/1726220401_2024-09-13_17-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726220105/1726220101_2024-09-13_17-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726219805/1726219801_2024-09-13_17-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726219504/1726219501_2024-09-13_17-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726219204/1726219201_2024-09-13_17-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726218904/1726218901_2024-09-13_17-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726218604/1726218601_2024-09-13_17-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726218304/1726218301_2024-09-13_17-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726214274/1726214270_2024-09-13_15-57-50.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726214145/1726214142_2024-09-13_15-55-42.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726212827/1726210501_2024-09-13_14-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213379/1726166701_2024-09-13_02-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213376/1726166401_2024-09-13_02-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213374/1726166101_2024-09-13_02-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213371/1726165801_2024-09-13_02-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213368/1726165501_2024-09-13_02-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213366/1726165201_2024-09-13_02-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213363/1726164901_2024-09-13_02-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213360/1726164601_2024-09-13_02-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213358/1726164301_2024-09-13_02-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213355/1726164001_2024-09-13_02-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213352/1726163701_2024-09-13_01-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213349/1726163401_2024-09-13_01-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213347/1726163101_2024-09-13_01-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213344/1726162801_2024-09-13_01-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213341/1726162501_2024-09-13_01-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213339/1726162201_2024-09-13_01-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213336/1726161901_2024-09-13_01-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213334/1726161601_2024-09-13_01-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213331/1726161301_2024-09-13_01-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213328/1726161001_2024-09-13_01-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213326/1726160701_2024-09-13_01-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213323/1726160401_2024-09-13_01-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213320/1726160101_2024-09-13_00-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213318/1726159801_2024-09-13_00-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213315/1726159502_2024-09-13_00-45-02.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213312/1726159201_2024-09-13_00-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213310/1726158901_2024-09-13_00-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213307/1726158601_2024-09-13_00-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213305/1726158301_2024-09-13_00-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213302/1726158001_2024-09-13_00-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213299/1726157701_2024-09-13_00-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213296/1726157401_2024-09-13_00-10-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213294/1726157101_2024-09-13_00-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213291/1726156801_2024-09-13_00-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213754/1726156641_2024-09-12_23-57-21.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213752/1726156594_2024-09-12_23-56-34.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213749/1726150002_2024-09-12_22-06-42.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213747/1726149901_2024-09-12_22-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213744/1726149601_2024-09-12_22-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213741/1726149301_2024-09-12_21-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213738/1726149001_2024-09-12_21-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213736/1726148701_2024-09-12_21-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213733/1726148401_2024-09-12_21-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213731/1726148101_2024-09-12_21-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213728/1726147801_2024-09-12_21-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213726/1726147501_2024-09-12_21-25-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213723/1726147201_2024-09-12_21-20-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213721/1726146901_2024-09-12_21-15-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213718/1726146602_2024-09-12_21-10-02.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213716/1726146301_2024-09-12_21-05-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213713/1726146001_2024-09-12_21-00-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213710/1726145701_2024-09-12_20-55-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213708/1726145401_2024-09-12_20-50-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213705/1726145101_2024-09-12_20-45-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213702/1726144801_2024-09-12_20-40-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213699/1726144501_2024-09-12_20-35-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213697/1726144201_2024-09-12_20-30-01.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213694/1726144105_2024-09-12_20-28-25.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213691/1726102395_2024-09-12_08-53-15.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213689/1726102354_2024-09-12_08-52-34.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213686/1726102329_2024-09-12_08-52-09.jpg",
"https://res.cloudinary.com/dn9rloq0x/image/upload/h_360/v1726213683/1726102259_2024-09-12_08-50-59.jpg",
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

  const loadImageList = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "expression": "resource_type=image AND display_name:2024-09-13 AND asset_folder=timelapse AND type=upload",
      "sort_by": [
        {
          "public_id": "desc"
        }
      ],
      "fields": [
        "public_id"
      ]
    });

    fetch("/cld/v1_1/dn9rloq0x/resources/search", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    })
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      }).catch((error) => console.error(error));
  }

  useEffect(() => {
    if (images_list.length > 0) {
      // loadImageList();
    };
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
        src={preloadImageAmout >= images_list.length ? images_list[images_list.length-1-(currentIndex % images_list.length)] : images_list[0]}
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
