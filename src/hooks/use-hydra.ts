"use client";

import { isNil } from "lodash";
import { useContext } from "react";
import { HydraContext, HydraContextType } from "~/contexts/hydra.context";

export const useHydra = function (): HydraContextType {
    const context = useContext<HydraContextType>(HydraContext);
    if (isNil(context)) {
        throw new Error("useWallet must be used within a WalletProvider");
    }

    return context;
};
