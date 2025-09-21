"use client";
import { createContext } from "react";
import { ThemeOption } from "~/options/theme.option";

const themeOption: ThemeOption = ThemeOption.dark;

export type ThemeContextType = {
    isMobile: boolean;
    themeOption: ThemeOption;
    setThemeOption: (themeOption: ThemeOption) => void;
    forThemeOption?: <Template>(map: Record<ThemeOption, Template>) => Template;
};

export const ThemeContext = createContext<ThemeContextType>({
    isMobile: false,
    themeOption: themeOption,
    setThemeOption: function () {
        console.warn("setThemeOption is not implemented");
        return null;
    },
});
