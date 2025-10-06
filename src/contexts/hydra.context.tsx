"use client";

import { createContext } from "react";

export type HydraContextType = {
    status: string;
    isLoading: boolean;
};

export const HydraContext = createContext<HydraContextType>(null!);
