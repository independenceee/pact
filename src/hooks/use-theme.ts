"use client";

import { THEME_KEY } from "~/constants/keys.constant";
import { useMedia } from "~/hooks/use-media";
import { ThemeOption } from "~/options/theme.option";
import { useEffect, useState } from "react";
import type { ThemeContextType } from "~/contexts/theme.context";

const userDarkMode = (): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
};

export const getThemeOption = () => {
    if (typeof window === "undefined") {
        return;
    }

    const storedThemeOption = localStorage?.getItem(THEME_KEY);
    if (storedThemeOption) {
        return storedThemeOption as ThemeOption;
    }

    return userDarkMode() ? ThemeOption.dark : ThemeOption.light;
};

export const syncTheme = (themeOption: ThemeOption | undefined) => {
    if (!themeOption || typeof document === "undefined") {
        return;
    }

    if (themeOption === ThemeOption.dark) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
    document.documentElement.style.setProperty("color-scheme", themeOption);
    localStorage?.setItem(THEME_KEY, themeOption);
};

export function useTheme(): ThemeContextType {
    const [currentThemeOption, setCurrentThemeOption] = useState<ThemeOption>("light" as ThemeOption);

    const isMobile = useMedia("(max-width: 767px)");

    useEffect(() => {
        const initialThemeOption = getThemeOption();
        if (!initialThemeOption) {
            return;
        }

        setCurrentThemeOption(initialThemeOption);
    }, []);

    function setThemeOption(themeOption: ThemeOption) {
        syncTheme(themeOption);
        setCurrentThemeOption(themeOption);
    }

    return {
        isMobile: isMobile,
        setThemeOption: setThemeOption,
        themeOption: currentThemeOption,
        forThemeOption: (map) => map[currentThemeOption],
    };
}
