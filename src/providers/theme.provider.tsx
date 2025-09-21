"use client";

import React from "react";
import { useTheme } from "~/hooks/use-theme";
import { ThemeContext } from "~/contexts/theme.context";

export const ThemeProvider: React.FC<React.PropsWithChildren<unknown>> = function ({ children }) {
    const theme = useTheme();

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
