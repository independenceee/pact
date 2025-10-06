"use client";

import { useQuery } from "@tanstack/react-query";
import React, { PropsWithChildren, useState } from "react";
import { HeadStatus } from "~/constants/common.constant";
import { HEAD_STATUS_QUERY_KEY } from "~/constants/keys.constant";
import { HydraContext } from "~/contexts/hydra.context";
import { useWallet } from "~/hooks/use-wallet";
import { getStatus } from "~/services/hydra.service";

export const HydraProvider: React.FC<PropsWithChildren> = function ({ children }) {
    const { address } = useWallet();
    const { data, isLoading } = useQuery<string>({
        initialData: HeadStatus.IDLE,
        queryKey: [HEAD_STATUS_QUERY_KEY, address],
        queryFn: async function () {
            return getStatus({ walletAddress: address as string, isCreator: true });
        },
        enabled: !!address,
    });
    return <HydraContext.Provider value={{ status: data, isLoading: isLoading }}>{children}</HydraContext.Provider>;
};
