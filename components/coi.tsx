"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";

export const COI = () => {
    const [coi, setCOI] = useState(false);

    useEffect (() => {
        setCOI(crossOriginIsolated);
    }
    );
    return (
        <>
      {coi ? "✅" : "❌"}
      </>
  );
};
