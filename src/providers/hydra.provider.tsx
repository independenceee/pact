"use client";

import React, { PropsWithChildren, useState } from "react";
import { HydraContext } from "~/contexts/hydra.context";

export const HydraProvider: React.FC<PropsWithChildren> = function ({ children }) {
    const [headStatus, setHeadStatus] = useState<string>("");
    return <HydraContext.Provider value={{ headStatus }}>{children}</HydraContext.Provider>;
};
