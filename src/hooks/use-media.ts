"use client";

import debounce from "lodash/debounce";
import { useState, useEffect } from "react";

export const useMedia = function (query: string, defaultState = false) {
    const [state, setState] = useState(function () {
        return typeof window === "undefined" ? defaultState : window.matchMedia(query).matches;
    });

    useEffect(function () {
        let mounted = true;
        const queryList = window.matchMedia(query);

        const onChange = function () {
            if (!mounted) {
                return;
            }

            setState(queryList.matches);
        };

        window.addEventListener("resize", debounce(onChange, 200));
        setState(queryList.matches);

        return () => {
            mounted = false;
            window.removeEventListener("resize", onChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return state;
};
