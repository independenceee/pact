"use client";

import { createContext } from "react";

export type HydraContextType = {
    headStatus: string;
    headStatusLoading: boolean;
};

export const HydraContext = createContext<HydraContextType>(null!);
